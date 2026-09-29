#!/usr/bin/env bash
# Owns only gbh-fc netns/veth, gbh_fc_* tables and narrowly scoped FORWARD rules.
set -euo pipefail
network_values=$(python3 "$(dirname "$0")/network-config.py")
eval "$network_values"
unset network_values
ns=gbh-fc
link=gbh-fc-host
guest=$FC_GUEST_IP
public=$(cat /srv/gbh-firecracker/public-ipv4)
python3 - "$public" <<'PYIP'
import ipaddress,sys
assert ipaddress.IPv4Address(sys.argv[1]).is_global
PYIP
if ip netns list | awk '{print $1}' | grep -qx "$ns"; then
  nft list table inet gbh_fc_guard >/dev/null
  nft list table ip gbh_fc_nat >/dev/null
  ip -4 route show $FC_GUEST_SUBNET | grep -q "via $FC_NAMESPACE_IP dev gbh-fc-host"
  exit 0
fi
! ip link show "$link" >/dev/null 2>&1
! nft list table inet gbh_fc_guard >/dev/null 2>&1
[[ $(sysctl -n net.ipv4.ip_forward) = 1 ]]
ip netns add "$ns"
ip link add "$link" type veth peer name uplink netns "$ns"
ip addr add $FC_HOST_CIDR dev "$link"
ip link set "$link" up
ip -n "$ns" link set lo up
ip -n "$ns" addr add $FC_NAMESPACE_CIDR dev uplink
ip -n "$ns" link set uplink up
ip -n "$ns" route add default via $FC_HOST_IP
ip route add $FC_GUEST_SUBNET via $FC_NAMESPACE_IP dev "$link"
ip netns exec "$ns" sysctl -qw net.ipv4.ip_forward=1 net.ipv6.conf.all.disable_ipv6=1
ip netns exec "$ns" ip tuntap add tap0 mode tap user gbh-firecracker
ip -n "$ns" addr add $FC_GATEWAY_CIDR dev tap0
ip -n "$ns" link set tap0 up
ip netns exec "$ns" nft -f - <<NFT
table inet gbh_guest_edge {
 chain input { type filter hook input priority -20; policy accept; iifname "tap0" drop; }
 chain forward { type filter hook forward priority -20; policy drop;
  iifname "tap0" oifname "uplink" ip saddr $FC_GUEST_IP accept
  iifname "uplink" oifname "tap0" ip daddr $FC_GUEST_IP accept
 }
}
NFT
nft -f - <<NFT
table inet gbh_fc_guard {
 set restricted { type ipv4_addr; flags interval; elements = { 0.0.0.0/8, 10.0.0.0/8, 100.64.0.0/10, 127.0.0.0/8, 169.254.0.0/16, 172.16.0.0/12, 192.0.0.0/24, 192.0.2.0/24, 192.168.0.0/16, 198.18.0.0/15, 198.51.100.0/24, 203.0.113.0/24, 224.0.0.0/3, 168.63.129.16 } }
 chain input { type filter hook input priority -20; policy accept;
  iifname "gbh-fc-host" ip saddr $FC_GUEST_IP ip daddr $FC_HOST_IP ct state established,related accept
  iifname "gbh-fc-host" ip saddr $FC_GUEST_IP ip daddr $FC_HOST_IP tcp dport 4010 accept
  iifname "gbh-fc-host" counter drop
 }
 chain forward { type filter hook forward priority -20; policy accept;
  iifname "gbh-fc-host" ip saddr != $FC_GUEST_IP counter drop
  iifname "gbh-fc-host" meta nfproto ipv6 counter drop
  iifname "gbh-fc-host" ip daddr @restricted counter drop
  iifname "gbh-fc-host" tcp dport { 80, 443 } accept
  iifname "gbh-fc-host" ip daddr { $FC_DNS_1, $FC_DNS_2 } udp dport 53 accept
  iifname "gbh-fc-host" counter drop
  oifname "gbh-fc-host" ip daddr $FC_GUEST_IP ct state established,related accept
  oifname "gbh-fc-host" counter drop
 }
}
table ip gbh_fc_nat {
 chain postrouting { type nat hook postrouting priority srcnat; policy accept;
  ip saddr $FC_GUEST_IP oifname != "gbh-fc-host" masquerade
 }
}
NFT
nft add element inet gbh_fc_guard restricted "{ $public }"
# Docker's FORWARD policy is DROP. Permit only this guest after our earlier filter.
iptables -I FORWARD 1 -i "$link" -s "$guest" -j ACCEPT
iptables -I FORWARD 1 -o "$link" -d "$guest" -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT
