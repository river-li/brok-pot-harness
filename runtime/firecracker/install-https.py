#!/usr/bin/env python3
"""Opt-in authenticated HTTPS ingress for the existing Firecracker Gateway."""
import argparse
import hashlib
import io
import ipaddress
import json
import os
from pathlib import Path
import subprocess
import tarfile
import urllib.request

VERSION = '2.11.4'
SHA256 = '527fbf917c39189a1e3b31d34fa955601680b2d5c8055d2a87b8b9588dec7bb9'
BASE = Path('/srv/gbh-firecracker')
LIB = Path('/usr/local/lib/gbh-firecracker')


def config(address, token):
    if not ipaddress.IPv4Address(address).is_global:
        raise ValueError('A controlled public IPv4 address is required')
    if len(token) < 32 or not all(c.isalnum() or c in '-_' for c in token):
        raise ValueError('Unexpected Gateway credential format')
    proxy = {'handler': 'reverse_proxy', 'upstreams': [{'dial': '127.0.0.1:1640'}],
             'flush_interval': -1, 'transport': {'protocol': 'http', 'dial_timeout': 5000000000}}
    return {
        'admin': {'disabled': True, 'config': {'persist': False}},
        'logging': {'logs': {'default': {'level': 'WARN', 'exclude': ['http.log.access', 'http.log.error']}}},
        'apps': {
            'tls': {'certificates': {'automate': [address]}, 'automation': {'policies': [
                {'subjects': [address], 'issuers': [{'module': 'acme',
                 'ca': 'https://acme-v02.api.letsencrypt.org/directory', 'profile': 'shortlived'}]}
            ]}},
            'http': {'servers': {
                'gateway': {
                    'listen': [':443'], 'protocols': ['h1', 'h2'],
                    'tls_connection_policies': [{'default_sni': address}],
                    'automatic_https': {'disable_redirects': True},
                    'read_header_timeout': 10000000000, 'idle_timeout': 60000000000,
                    'max_header_bytes': 16384,
                    'routes': [
                        {'match': [{'host': [address]}],
                         'handle': [{'handler': 'request_body', 'max_size': 33554432,
                                     'read_timeout': 30000000000}, proxy], 'terminal': True},
                        {'handle': [{'handler': 'static_response', 'status_code': 401,
                                     'headers': {'Cache-Control': ['no-store']}}], 'terminal': True}
                    ]
                },
                'acme': {'listen': [':80'], 'read_header_timeout': 10000000000,
                         'idle_timeout': 15000000000, 'max_header_bytes': 16384,
                         'routes': [{'handle': [{'handler': 'static_response', 'status_code': 404}]}]}
            }}
        }
    }


def main():
    if os.geteuid() != 0:
        raise SystemExit('Run as root on the deployment host')
    address = (BASE / 'public-ipv4').read_text().strip()
    token = subprocess.check_output(['gbh-guest', 'cat', '/var/lib/gbh/gateway-token'], text=True).strip()
    settings = config(address, token)
    LIB.mkdir(mode=0o755, exist_ok=True)
    parser = argparse.ArgumentParser()
    parser.add_argument('--reuse-caddy', action='store_true', help='Keep the previously installed, root-owned pinned Caddy binary')
    args = parser.parse_args()
    if args.reuse_caddy:
        binary = LIB / 'caddy'
        info = binary.lstat()
        if not binary.is_file() or binary.is_symlink() or info.st_uid != 0 or info.st_mode & 0o022:
            raise SystemExit('Existing Caddy must be a root-owned, protected regular file')
        version = subprocess.check_output([str(binary), 'version'], text=True)
        if not version.startswith('v' + VERSION + ' '):
            raise SystemExit('Existing Caddy version does not match pinned release')
    else:
        archive = urllib.request.urlopen(
            f'https://github.com/caddyserver/caddy/releases/download/v{VERSION}/caddy_{VERSION}_linux_amd64.tar.gz',
            timeout=60).read()
        if hashlib.sha256(archive).hexdigest() != SHA256:
            raise SystemExit('Caddy archive checksum mismatch')
        with tarfile.open(fileobj=io.BytesIO(archive)) as bundle:
            member = bundle.getmember('caddy')
            if not member.isfile():
                raise SystemExit('Unexpected Caddy archive')
            binary = bundle.extractfile(member).read()
        temporary = LIB / 'caddy.new'
        temporary.write_bytes(binary)
        temporary.chmod(0o755)
        temporary.replace(LIB / 'caddy')
    private = BASE / 'https.json'
    fd = os.open(private, os.O_WRONLY | os.O_CREAT | os.O_TRUNC | os.O_NOFOLLOW, 0o600)
    with os.fdopen(fd, 'w') as stream:
        os.fchmod(stream.fileno(), 0o600)
        json.dump(settings, stream)
    (LIB / 'remote-gateway.cjs').write_bytes(Path(__file__).with_name('remote-gateway.cjs').read_bytes())
    gateway_settings = BASE / 'remote-gateway.json'
    fd = os.open(gateway_settings, os.O_WRONLY | os.O_CREAT | os.O_TRUNC | os.O_NOFOLLOW, 0o600)
    with os.fdopen(fd, 'w') as stream:
        os.fchmod(stream.fileno(), 0o600)
        json.dump({'origin': 'https://' + address, 'token': token}, stream)
    gateway_unit = """[Unit]
Description=Shared remote Host and Box authentication gateway
After=network-online.target gbh-fc-forward.service
Wants=gbh-fc-forward.service
[Service]
DynamicUser=yes
LoadCredential=gateway.json:/srv/gbh-firecracker/remote-gateway.json
ExecStart=/usr/bin/node /usr/local/lib/gbh-firecracker/remote-gateway.cjs
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
RestrictNamespaces=yes
RestrictAddressFamilies=AF_INET AF_INET6 AF_UNIX
MemoryMax=256M
CPUQuota=100%
TasksMax=64
LimitNOFILE=2048
[Install]
WantedBy=multi-user.target
"""
    Path('/etc/systemd/system/gbh-remote-gateway.service').write_text(gateway_unit)
    unit = '''[Unit]
Description=Shared authenticated HTTPS Gateway
Wants=network-online.target gbh-fc-forward.service gbh-remote-gateway.service
After=network-online.target gbh-fc-forward.service gbh-remote-gateway.service
[Service]
DynamicUser=yes
StateDirectory=gbh-https
StateDirectoryMode=0700
Environment=XDG_DATA_HOME=/var/lib/gbh-https
Environment=XDG_CONFIG_HOME=/var/lib/gbh-https
LoadCredential=gateway.json:/srv/gbh-firecracker/https.json
ExecStart=/usr/local/lib/gbh-firecracker/caddy run --config %d/gateway.json
Restart=on-failure
RestartSec=5
AmbientCapabilities=CAP_NET_BIND_SERVICE
CapabilityBoundingSet=CAP_NET_BIND_SERVICE
NoNewPrivileges=yes
ProtectSystem=strict
ProtectHome=yes
PrivateTmp=yes
PrivateDevices=yes
ProtectKernelTunables=yes
ProtectKernelModules=yes
ProtectControlGroups=yes
RestrictSUIDSGID=yes
RestrictNamespaces=yes
RestrictAddressFamilies=AF_INET AF_INET6 AF_UNIX
MemoryMax=256M
CPUQuota=100%
TasksMax=128
LimitNOFILE=2048
[Install]
WantedBy=multi-user.target
'''
    Path('/etc/systemd/system/gbh-https.service').write_text(unit)
    subprocess.run(['systemctl', 'daemon-reload'], check=True)
    subprocess.run(['systemctl', 'enable', 'gbh-https', 'gbh-remote-gateway'], check=True)
    subprocess.run(['systemctl', 'restart', 'gbh-remote-gateway', 'gbh-https'], check=True)
    print('HTTPS ingress configured for https://' + address + '; verify certificate issuance and client access.')


if __name__ == '__main__':
    main()
