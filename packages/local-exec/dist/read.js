/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/local-exec/dist/read.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/2
init_dist4();
var import_iconv_lite2 = __toESM(require_lib(), 1);

// @recovered-fragment 2/2
var STREAMING_READ_CHUNK_BYTES = 64 * 1024;
var logger42 = createLogger("LocalReadExecutor");
var TERMINAL_BLOCK_DELIMITER = Buffer.from("\n---\n");
var KNOWN_BINARY_MAGIC_PREFIXES = [
  // ── Documents ──
  Buffer.from("%PDF-", "ascii"),
  // PDF
  Buffer.from([208, 207, 17, 224, 161, 177, 26, 225]),
  // OLE2 / Compound File Binary (.msi, legacy .doc/.xls/.ppt, .msg)
  // ── ZIP family (DOCX/XLSX/PPTX/JAR/EPUB/APK/IPA all start with these) ──
  Buffer.from([80, 75, 3, 4]),
  // ZIP local file header
  Buffer.from([80, 75, 5, 6]),
  // ZIP empty archive end-of-central-dir
  Buffer.from([80, 75, 7, 8]),
  // ZIP spanned / data descriptor
  // ── Executables ──
  Buffer.from([127, 69, 76, 70]),
  // ELF (Linux/BSD .so/.elf executables)
  Buffer.from([254, 237, 250, 206]),
  // Mach-O 32-bit BE
  Buffer.from([254, 237, 250, 207]),
  // Mach-O 64-bit BE
  Buffer.from([206, 250, 237, 254]),
  // Mach-O 32-bit LE
  Buffer.from([207, 250, 237, 254]),
  // Mach-O 64-bit LE
  Buffer.from([77, 90, 144]),
  // Windows PE / DOS MZ (.exe / .dll). 3-byte
  // prefix avoids text false positives on the ASCII bigram "MZ" — every
  // Microsoft-toolchain PE has e_cblp = 0x0090 in the third byte.
  Buffer.from([0, 97, 115, 109]),
  // WASM module ("\0asm")
  // ── Images (rejected for agent-tools .txt — real images are read via the
  //    image branch on the slow path; here they only appear if a download
  //    landed an image at a .txt suffix) ──
  Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
  // PNG (8-byte signature)
  Buffer.from([255, 216, 255]),
  // JPEG
  Buffer.from("GIF87a", "ascii"),
  // GIF87a
  Buffer.from("GIF89a", "ascii"),
  // GIF89a
  // ── Databases ──
  Buffer.from("SQLite format 3\0", "ascii"),
  // SQLite 3 database
  // ── Compression / archives ──
  Buffer.from([31, 139]),
  // gzip
  Buffer.from("BZh", "ascii"),
  // bzip2 (always followed by '1'-'9' block size)
  Buffer.from([253, 55, 122, 88, 90, 0]),
  // xz
  Buffer.from([40, 181, 47, 253]),
  // zstd (Zstandard frame magic)
  Buffer.from([55, 122, 188, 175, 39, 28]),
  // 7z
  Buffer.from([82, 97, 114, 33, 26, 7, 0]),
  // RAR (v1.50 - v4.x)
  Buffer.from([82, 97, 114, 33, 26, 7, 1, 0])
  // RAR5 (v5.0+)
];

