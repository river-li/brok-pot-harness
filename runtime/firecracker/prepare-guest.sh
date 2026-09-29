#!/usr/bin/env bash
# Fresh, dedicated guest image only. Run as root in a private mount namespace.
set -euo pipefail
network_values=$(python3 "$(dirname "$0")/network-config.py")
eval "$network_values"
unset network_values
base=${1:?management directory required}
data=${2:?dedicated data directory required}
[[ "$base" = /srv/gbh-firecracker && "$data" = /*/gbh-firecracker ]] || exit 2
[[ $EUID = 0 ]]
[[ $(readlink /proc/self/ns/mnt) != $(readlink /proc/1/ns/mnt) ]] || { echo 'Run through unshare --mount'; exit 1; }
for tool in debootstrap curl zstd mkfs.ext4 python3; do command -v "$tool" >/dev/null; done
[[ -z $(dpkg --audit) ]] || { echo 'Resolve host package-manager health separately before preparation'; exit 1; }
python3 - "$data" <<'PREFLIGHT'
import os,pathlib,sys
parent=pathlib.Path(sys.argv[1]).parent
assert parent.is_dir() and os.stat(parent).st_dev != os.stat('/').st_dev, 'Data volume must already be mounted separately from the host root'
PREFLIGHT
[[ ! -e "$data/rootfs.ext4" ]] || { echo 'Refusing to overwrite an existing guest disk'; exit 1; }
install -d -m 700 "$base" "$data" "$base/bin" "$base/downloads" "$base/guest"
printf 'inet4_only = on\ntimeout = 20\ntries = 3\n' > "$base/downloads/wgetrc"
export WGETRC="$base/downloads/wgetrc"
getent passwd gbh-firecracker >/dev/null || useradd --system --no-create-home --shell /usr/sbin/nologin gbh-firecracker
curl -4 -fL --retry 3 https://github.com/firecracker-microvm/firecracker/releases/download/v1.17.0/firecracker-v1.17.0-x86_64.tgz -o "$base/downloads/firecracker.tgz"
printf '%s  %s\n' 06094a1108ae9e82aa4c23a775aa92758f53f1175d422270d9d6162cb9ade558 "$base/downloads/firecracker.tgz" | sha256sum -c -
tar -xzf "$base/downloads/firecracker.tgz" -C "$base/downloads"
install -m 755 "$base/downloads/release-v1.17.0-x86_64/firecracker-v1.17.0-x86_64" "$base/bin/firecracker"
install -m 755 "$base/downloads/release-v1.17.0-x86_64/jailer-v1.17.0-x86_64" "$base/bin/jailer"
truncate -s 64G "$data/rootfs.ext4"
mkfs.ext4 -F -m 1 "$data/rootfs.ext4"
mount --make-rprivate /
mount -o loop "$data/rootfs.ext4" "$base/guest"
guest="$base/guest"
trap 'umount -R "$guest" || true' EXIT
debootstrap --arch=amd64 --variant=minbase --include=ca-certificates noble "$guest" http://nova.clouds.archive.ubuntu.com/ubuntu
find "$guest/var/lib/apt/lists" -maxdepth 1 -type f -delete
printf '#!/bin/sh\nexit 101\n' > "$guest/usr/sbin/policy-rc.d"
chmod 755 "$guest/usr/sbin/policy-rc.d"
mount --bind /dev "$guest/dev"
mount -t proc proc "$guest/proc"
mount -t sysfs sysfs "$guest/sys"
cat > "$guest/etc/apt/sources.list" <<'APT'
deb http://archive.ubuntu.com/ubuntu noble main universe
deb http://archive.ubuntu.com/ubuntu noble-updates main universe
deb http://security.ubuntu.com/ubuntu noble-security main universe
APT
chroot "$guest" /usr/bin/env DEBIAN_FRONTEND=noninteractive /bin/bash -s <<'GUEST'
set -euo pipefail
printf 'Acquire::ForceIPv4 "true";\n' > /etc/apt/apt.conf.d/99-gbh-ipv4
apt-get update
apt-get install -y --no-install-recommends systemd-sysv systemd-timesyncd openssh-server iproute2 iptables kmod linux-image-virtual initramfs-tools curl ca-certificates gnupg xz-utils python3
install -d -m 755 /etc/apt/keyrings
curl -4 -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
printf 'deb [arch=amd64 signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu noble stable\n' > /etc/apt/sources.list.d/docker.list
apt-get update
apt-get install -y --no-install-recommends docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
cd /tmp
curl -4 -fLO https://nodejs.org/dist/v24.14.0/node-v24.14.0-linux-x64.tar.xz
curl -4 -fL https://nodejs.org/dist/v24.14.0/SHASUMS256.txt -o node-shasums
awk '$2=="node-v24.14.0-linux-x64.tar.xz" {print}' node-shasums | sha256sum -c -
tar -xJf node-v24.14.0-linux-x64.tar.xz -C /usr/local --strip-components=1
rm node-v24.14.0-linux-x64.tar.xz node-shasums
printf 'virtio_mmio\nvirtio_blk\nvirtio_net\next4\n' >> /etc/initramfs-tools/modules
update-initramfs -u -k all
apt-get clean
systemctl enable ssh docker systemd-networkd systemd-timesyncd
GUEST
printf 'gbh-guest\n' > "$guest/etc/hostname"
printf '127.0.0.1 localhost\n127.0.1.1 gbh-guest\n' > "$guest/etc/hosts"
printf 'nameserver %s\nnameserver %s\n' "$FC_DNS_1" "$FC_DNS_2" > "$guest/etc/resolv.conf"
install -d "$guest/etc/systemd/network" "$guest/etc/ssh/sshd_config.d" "$guest/etc/docker"
cat > "$guest/etc/systemd/network/20-gbh.network" <<NETWORK
[Match]
Name=eth0
[Network]
Address=$FC_GUEST_CIDR
Gateway=$FC_GATEWAY_IP
LinkLocalAddressing=no
IPv6AcceptRA=no
NETWORK
cat > "$guest/etc/ssh/sshd_config.d/10-gbh.conf" <<'SSH'
PasswordAuthentication no
KbdInteractiveAuthentication no
PermitRootLogin prohibit-password
AllowAgentForwarding no
X11Forwarding no
AllowTcpForwarding local
PermitOpen 127.0.0.1:1540 127.0.0.1:6180 127.0.0.1:6181
SSH
printf '{"log-driver":"local","log-opts":{"max-size":"10m","max-file":"3"}}\n' > "$guest/etc/docker/daemon.json"
ssh-keygen -q -t ed25519 -N '' -f "$base/guest-key"
install -d -m 700 "$guest/root/.ssh"
{ printf 'from="%s",no-agent-forwarding,no-X11-forwarding ' "$FC_HOST_IP"; cat "$base/guest-key.pub"; } > "$guest/root/.ssh/authorized_keys"
chmod 600 "$guest/root/.ssh/authorized_keys"
cp "$guest/etc/ssh/ssh_host_ed25519_key.pub" "$base/guest-host-key.pub"
cp "$guest"/boot/vmlinuz-* "$base/vmlinuz"
cp "$guest"/boot/initrd.img-* "$base/initrd.img"
python3 "$base/extract-kernel.py" "$base/vmlinuz" "$base/vmlinux"
rm "$guest/usr/sbin/policy-rc.d"
sync
printf 'Guest image prepared\n'
