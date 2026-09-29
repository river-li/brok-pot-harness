#!/usr/bin/env python3
"""Validate deployment-owned network settings and emit safely quoted shell values."""
import ipaddress
import json
import re
import shlex
import stat
from pathlib import Path


def variables(settings):
    interfaces = {key: ipaddress.IPv4Interface(settings[key]) for key in
                  ('host_cidr', 'namespace_cidr', 'guest_cidr', 'gateway_cidr')}
    host, namespace, guest, gateway = (interfaces[key] for key in
                                     ('host_cidr', 'namespace_cidr', 'guest_cidr', 'gateway_cidr'))
    for interface in interfaces.values():
        if not interface.ip.is_private or interface.ip.is_loopback or interface.ip.is_link_local:
            raise ValueError('Point-to-point addresses must be private unicast IPv4')
        if interface.network.prefixlen != 30 or interface.ip in (interface.network.network_address, interface.network.broadcast_address):
            raise ValueError('Point-to-point networks require usable /30 addresses')
    if host.network != namespace.network or host.ip == namespace.ip:
        raise ValueError('Host and namespace must be distinct peers')
    if guest.network != gateway.network or guest.ip == gateway.ip or guest.network.overlaps(host.network):
        raise ValueError('Guest network must be a separate peer network')
    dns = [ipaddress.IPv4Address(value) for value in settings['dns_ipv4']]
    if len(dns) != 2 or not all(value.is_global for value in dns):
        raise ValueError('Configure two public IPv4 DNS resolvers')
    mac = settings['guest_mac']
    if not re.fullmatch(r'(?:[0-9a-f]{2}:){5}[0-9a-f]{2}', mac) or int(mac[:2], 16) & 1:
        raise ValueError('Configure a unicast guest MAC')
    result = {}
    for key, interface in interfaces.items():
        prefix = 'FC_' + key.removesuffix('_cidr').upper()
        result[prefix + '_IP'] = str(interface.ip)
        result[prefix + '_CIDR'] = str(interface)
    result.update(FC_GUEST_SUBNET=str(guest.network), FC_DNS_1=str(dns[0]),
                  FC_DNS_2=str(dns[1]), FC_GUEST_MAC=mac)
    return result


if __name__ == '__main__':
    path = Path('/srv/gbh-firecracker/network.json')
    info = path.lstat()
    if not stat.S_ISREG(info.st_mode) or info.st_uid != 0 or info.st_mode & 0o077:
        raise SystemExit('network.json must be a root-owned private regular file')
    for key, value in variables(json.loads(path.read_text())).items():
        print(key + '=' + shlex.quote(value))
