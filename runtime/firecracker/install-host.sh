#!/usr/bin/env bash
# Install a prepared, dedicated deployment. Never manages another Compose stack.
set -euo pipefail
network_values=$(python3 "$(dirname "$0")/network-config.py")
eval "$network_values"
unset network_values
base=/srv/gbh-firecracker
! systemctl is-active --quiet gbh-firecracker.service
data=${1:?dedicated data directory required}
[[ "$data" = /*/gbh-firecracker ]]
[[ -f "$base/vmlinux" && -f "$base/initrd.img" && -f "$data/rootfs.ext4" ]]
[[ -f "$base/inference.json" && -f "$base/guest-host-key.pub" ]]
lib=/usr/local/lib/gbh-firecracker
install -d -m 755 "$lib"
install -m 755 "$base/network-up.sh" "$lib/network-up.sh"
install -m 644 "$base/inference-proxy.py" "$lib/inference-proxy.py"
install -m 644 "$base/cleanup-jail.py" "$lib/cleanup-jail.py"
install -m 644 "$base/network-config.py" "$lib/network-config.py"
uid=$(id -u gbh-firecracker)
gid=$(id -g gbh-firecracker)
jail="$base/jailer/firecracker/bot/root"
install -d -m 700 "$jail"
install -m 444 "$base/vmlinux" "$jail/vmlinux"
install -m 444 "$base/initrd.img" "$jail/initrd.img"
touch "$jail/rootfs.ext4"
chown "$uid:$gid" "$data/rootfs.ext4"
chmod 600 "$data/rootfs.ext4"
python3 - "$jail" "$FC_GUEST_MAC" <<'PY'
import json,pathlib,sys
jail=pathlib.Path(sys.argv[1])
rate={'bandwidth':{'size':67108864,'refill_time':1000},'ops':{'size':20000,'refill_time':1000}}
config={'boot-source':{'kernel_image_path':'/vmlinux','initrd_path':'/initrd.img','boot_args':'console=ttyS0 reboot=k panic=1 pci=off ipv6.disable=1 root=/dev/vda rw rootfstype=ext4'},'drives':[{'drive_id':'rootfs','path_on_host':'/rootfs.ext4','is_root_device':True,'is_read_only':False,'rate_limiter':rate}], 'machine-config':{'vcpu_count':4,'mem_size_mib':12288,'smt':False},'network-interfaces':[{'iface_id':'eth0','host_dev_name':'tap0','guest_mac':sys.argv[2],'rx_rate_limiter':rate,'tx_rate_limiter':rate}]}
(jail/'config.json').write_text(json.dumps(config,indent=2)+'\n')
PY
chown -R "$uid:$gid" "$jail"
{ printf '%s ' "$FC_GUEST_IP"; cut -d' ' -f1-2 "$base/guest-host-key.pub"; } > "$base/known_hosts"
chmod 600 "$base/known_hosts"
cat > /etc/systemd/system/gbh-fc-network.service <<UNIT
[Unit]
Description=GBH microVM isolated network and scoped egress policy
After=network-online.target docker.service
Wants=network-online.target
[Service]
Type=oneshot
ExecStart=$lib/network-up.sh
RemainAfterExit=yes
[Install]
WantedBy=multi-user.target
UNIT
cat > /etc/systemd/system/gbh-fc-inference.service <<UNIT
[Unit]
Description=GBH restricted LiteLLM inference relay
Requires=gbh-fc-network.service
After=gbh-fc-network.service
[Service]
Type=simple
DynamicUser=yes
LoadCredential=inference.json:$base/inference.json
ExecStart=/usr/bin/python3 $lib/inference-proxy.py
Restart=on-failure
RestartSec=3
NoNewPrivileges=yes
ProtectSystem=strict
ProtectHome=yes
PrivateTmp=yes
PrivateDevices=yes
ProtectKernelTunables=yes
ProtectKernelModules=yes
ProtectControlGroups=yes
RestrictSUIDSGID=yes
RestrictAddressFamilies=AF_INET AF_UNIX
CapabilityBoundingSet=
MemoryMax=192M
CPUQuota=50%
TasksMax=40
LimitNOFILE=128
[Install]
WantedBy=multi-user.target
UNIT
cat > /etc/systemd/system/gbh-firecracker.service <<UNIT
[Unit]
Description=GBH Firecracker microVM (root-capable Bot guest)
Requires=gbh-fc-network.service
After=gbh-fc-network.service gbh-fc-inference.service
Wants=gbh-fc-inference.service gbh-fc-forward.service
RequiresMountsFor=$data
[Service]
Type=forking
PIDFile=$jail/firecracker.pid
ExecStartPre=/usr/bin/python3 $lib/cleanup-jail.py
ExecStartPre=/bin/sh -c '/usr/bin/mountpoint -q $jail/rootfs.ext4 || /bin/mount --bind $data/rootfs.ext4 $jail/rootfs.ext4'
ExecStart=$base/bin/jailer --id bot --exec-file $base/bin/firecracker --uid $uid --gid $gid --chroot-base-dir $base/jailer --netns /run/netns/gbh-fc --cgroup-version 2 --parent-cgroup system.slice/gbh-firecracker.service --new-pid-ns --daemonize --resource-limit no-file=256 -- --config-file /config.json --api-sock /api.socket
ExecStop=-/usr/bin/timeout 20 /usr/local/sbin/gbh-guest systemctl reboot
ExecStopPost=/usr/bin/python3 $lib/cleanup-jail.py
KillMode=control-group
TimeoutStartSec=30
TimeoutStopSec=30
Restart=on-failure
RestartSec=5
MemoryMax=13G
MemorySwapMax=0
CPUQuota=400%
TasksMax=64
LimitCORE=0
[Install]
WantedBy=multi-user.target
UNIT
cat > /etc/systemd/system/gbh-fc-forward.service <<UNIT
[Unit]
Description=Loopback-only authenticated access to GBH guest services
PartOf=gbh-firecracker.service
Requires=gbh-firecracker.service
After=gbh-firecracker.service
[Service]
Type=simple
ExecStart=/usr/bin/ssh -NT -i $base/guest-key -o BatchMode=yes -o IdentitiesOnly=yes -o StrictHostKeyChecking=yes -o UserKnownHostsFile=$base/known_hosts -o ExitOnForwardFailure=yes -o ServerAliveInterval=15 -o ServerAliveCountMax=3 -L 127.0.0.1:1540:127.0.0.1:1540 -L 127.0.0.1:6180:127.0.0.1:6180 -L 127.0.0.1:6181:127.0.0.1:6181 root@$FC_GUEST_IP
Restart=always
RestartSec=5
NoNewPrivileges=yes
ProtectSystem=strict
ProtectHome=yes
PrivateTmp=yes
MemoryMax=64M
TasksMax=4
[Install]
WantedBy=multi-user.target
UNIT
cat > /usr/local/sbin/gbh-guest <<ADMIN
#!/bin/sh
exec /usr/bin/ssh -i /srv/gbh-firecracker/guest-key -o BatchMode=yes -o ConnectTimeout=5 -o IdentitiesOnly=yes -o StrictHostKeyChecking=yes -o UserKnownHostsFile=/srv/gbh-firecracker/known_hosts root@$FC_GUEST_IP "\$@"
ADMIN
chmod 755 /usr/local/sbin/gbh-guest
systemctl daemon-reload
systemctl enable gbh-fc-network gbh-fc-inference gbh-firecracker gbh-fc-forward
systemctl start gbh-fc-network gbh-fc-inference gbh-firecracker gbh-fc-forward
