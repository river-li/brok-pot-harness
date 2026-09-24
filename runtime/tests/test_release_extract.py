import importlib.util
import io
import tempfile
import tarfile
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
SPEC = importlib.util.spec_from_file_location("release_extract", ROOT / "runtime/release-extract.py")
EXTRACTOR = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(EXTRACTOR)


class ReleaseExtractorTests(unittest.TestCase):
    def archive(self, root, members):
        archive_path = root / "candidate.tar.gz"
        with tarfile.open(archive_path, "w:gz") as archive:
            for name, kind, payload, mode in members:
                member = tarfile.TarInfo(name)
                member.type = kind
                member.mode = mode
                member.size = len(payload) if kind == tarfile.REGTYPE else 0
                archive.addfile(member, io.BytesIO(payload) if payload else None)
        return archive_path

    def test_extracts_regular_tree_and_normalizes_executable_bits(self):
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            archive = self.archive(root, [
                ("gbh-server/", tarfile.DIRTYPE, b"", 0o700),
                ("gbh-server/install.sh", tarfile.REGTYPE, b"#!/bin/sh\n", 0o1755),
                ("gbh-server/runtime/server.cjs", tarfile.REGTYPE, b"module.exports = {};\n", 0o0777),
            ])
            destination = root / "out"
            EXTRACTOR.extract(archive, destination)

            installer = destination / "gbh-server/install.sh"
            payload = destination / "gbh-server/runtime/server.cjs"
            self.assertEqual(installer.read_text(), "#!/bin/sh\n")
            self.assertEqual(installer.stat().st_mode & 0o777, 0o755)
            self.assertEqual(payload.stat().st_mode & 0o777, 0o755)

    def test_rejects_traversal_and_dot_segments(self):
        for name in ("../outside", "gbh/../../outside", "./gbh/install.sh", "/tmp/outside", "gbh\\..\\outside"):
            with self.subTest(name=name), tempfile.TemporaryDirectory() as temporary:
                root = Path(temporary)
                archive = self.archive(root, [(name, tarfile.REGTYPE, b"escape", 0o644)])
                with self.assertRaisesRegex(ValueError, "unsafe path"):
                    EXTRACTOR.extract(archive, root / "out")
                self.assertFalse((root / "outside").exists())

    def test_rejects_duplicate_paths_links_and_special_files(self):
        malformed = [
            [("gbh/file", tarfile.REGTYPE, b"one", 0o644), ("gbh/file", tarfile.REGTYPE, b"two", 0o644)],
            [("gbh/link", tarfile.SYMTYPE, b"", 0o777)],
            [("gbh/hardlink", tarfile.LNKTYPE, b"", 0o777)],
            [("gbh/fifo", tarfile.FIFOTYPE, b"", 0o644)],
        ]
        for members in malformed:
            with self.subTest(kind=members[-1][1]), tempfile.TemporaryDirectory() as temporary:
                root = Path(temporary)
                archive = self.archive(root, members)
                with self.assertRaises(ValueError):
                    EXTRACTOR.extract(archive, root / "out")

    def test_requires_empty_non_symlink_destination(self):
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            archive = self.archive(root, [("gbh/file", tarfile.REGTYPE, b"file", 0o644)])
            destination = root / "out"
            destination.mkdir()
            (destination / "user.txt").write_text("keep")
            with self.assertRaisesRegex(ValueError, "must be empty"):
                EXTRACTOR.extract(archive, destination)
            self.assertEqual((destination / "user.txt").read_text(), "keep")

            link = root / "linked-out"
            link.symlink_to(destination, target_is_directory=True)
            with self.assertRaisesRegex(ValueError, "cannot be a symlink"):
                EXTRACTOR.extract(archive, link)


if __name__ == "__main__":
    unittest.main()
