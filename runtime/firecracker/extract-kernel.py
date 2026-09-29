#!/usr/bin/env python3
"""Extract an ELF kernel from a distro-verified x86 bzImage (gzip or zstd)."""
import pathlib
import struct
import subprocess
import sys
import zlib


def complete_elf(data):
    if len(data) < 64 or data[:6] != b'\x7fELF\x02\x01':
        return False
    phoff, shoff = struct.unpack_from('<QQ', data, 32)
    phsize, phnum, shsize, shnum = struct.unpack_from('<HHHH', data, 54)
    if phsize != 56 or phnum == 0 or phoff + phsize * phnum > len(data):
        return False
    if shoff and shoff + shsize * shnum > len(data):
        return False
    for n in range(phnum):
        offset = phoff + n * phsize
        file_offset = struct.unpack_from('<Q', data, offset + 8)[0]
        file_size = struct.unpack_from('<Q', data, offset + 32)[0]
        if file_offset + file_size > len(data):
            return False
    return True


def extract(source):
    if complete_elf(source):
        return source
    for magic, method in [(b'\x1f\x8b\x08', 'gzip'), (b'\x28\xb5\x2f\xfd', 'zstd')]:
        offset = 0
        for _ in range(128):
            offset = source.find(magic, offset)
            if offset < 0:
                break
            try:
                if method == 'gzip':
                    output = zlib.decompress(source[offset:], 16 + zlib.MAX_WBITS)
                else:
                    output = subprocess.run(['zstd', '-dc'], input=source[offset:], capture_output=True, timeout=30).stdout
                # bzImage trailers can make zstd return nonzero after completing
                # the frame. Check the extracted ELF's segment/table bounds.
                if complete_elf(output):
                    return output
            except zlib.error:
                pass
            offset += 1
    raise ValueError('No complete gzip/zstd ELF kernel found')


if __name__ == '__main__':
    pathlib.Path(sys.argv[2]).write_bytes(extract(pathlib.Path(sys.argv[1]).read_bytes()))
