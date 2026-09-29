#!/usr/bin/env bash
# Runs in the guest after the verified snapshot and private server.env are copied.
set -euo pipefail
cd /opt/gbh
python3 - <<'PY'
import json,hashlib,pathlib
root=pathlib.Path('/opt/gbh'); manifest=json.loads((root/'deployment-manifest.json').read_text())
for name,expected in manifest['files'].items():
 p=root/name
 if p.is_symlink() or hashlib.sha256(p.read_bytes()).hexdigest()!=expected:
  raise SystemExit('Deployment snapshot verification failed: '+name)
print('Verified private deployment snapshot:',len(manifest['files']),'files')
PY
GBH_SERVER_STATE_DIR=/var/lib/gbh node runtime/server.cjs install
cat > /etc/systemd/system/gbh-bot.service <<'UNIT'
[Unit]
Description=GBH Host and root-capable Box inside Firecracker
Requires=docker.service
After=docker.service network-online.target
Wants=network-online.target
[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/opt/gbh
Environment=GBH_SERVER_STATE_DIR=/var/lib/gbh
Environment=GBH_SERVER_PROJECT=gbh-firecracker
ExecStart=/usr/local/bin/node runtime/server.cjs start
ExecStop=/usr/local/bin/node runtime/server.cjs stop
TimeoutStartSec=1800
TimeoutStopSec=240
[Install]
WantedBy=multi-user.target
UNIT
systemctl daemon-reload
systemctl enable gbh-bot
systemctl start gbh-bot
