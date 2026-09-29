#!/usr/bin/env python3
"""Remove only transient Jailer nodes, without following jail-controlled links."""
import os

FLAGS = os.O_RDONLY | os.O_DIRECTORY | os.O_NOFOLLOW
root = os.open('/srv/gbh-firecracker/jailer/firecracker/bot/root', FLAGS)

def remove(directory, names):
    for name in names:
        try:
            os.unlink(name, dir_fd=directory)
        except FileNotFoundError:
            pass

try:
    remove(root, ('api.socket', 'firecracker.pid'))
    try:
        dev = os.open('dev', FLAGS, dir_fd=root)
    except FileNotFoundError:
        dev = None
    if dev is not None:
        try:
            remove(dev, ('kvm', 'urandom', 'userfaultfd'))
            try:
                net = os.open('net', FLAGS, dir_fd=dev)
            except FileNotFoundError:
                net = None
            if net is not None:
                try:
                    remove(net, ('tun',))
                finally:
                    os.close(net)
        finally:
            os.close(dev)
finally:
    os.close(root)
