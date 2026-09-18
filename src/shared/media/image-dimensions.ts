function toImageDimensions({ width, height }) {
  if (!Number.isFinite(width) || !Number.isFinite(height)) return null;
  if (width <= 0 || height <= 0) return null;
  return { width, height };
}
function dataViewOf(bytes) {
  return new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
}
function readU24LE(view, offset) {
  return view.getUint16(offset, true) | view.getUint8(offset + 2) << 16;
}
function fourCharTag(view, offset) {
  return String.fromCharCode(
    view.getUint8(offset),
    view.getUint8(offset + 1),
    view.getUint8(offset + 2),
    view.getUint8(offset + 3)
  );
}
function indexOfFourCharTag(view, tag) {
  const t0 = tag.charCodeAt(0);
  const t1 = tag.charCodeAt(1);
  const t2 = tag.charCodeAt(2);
  const t3 = tag.charCodeAt(3);
  for (let at2 = 0; at2 + 4 <= view.byteLength; at2++) {
    if (view.getUint8(at2) === t0 && view.getUint8(at2 + 1) === t1 && view.getUint8(at2 + 2) === t2 && view.getUint8(at2 + 3) === t3) {
      return at2;
    }
  }
  return -1;
}
function mirrorAxisOf(imirByte) {
  return (imirByte & 1) === 0 ? "vertical" : "horizontal";
}
var HeicDimensions = class _HeicDimensions {
  static read(buffer) {
    const view = dataViewOf(buffer);
    const selected = _HeicDimensions.primaryOf(buffer);
    if (selected == null) return null;
    const width = view.getUint32(selected.ispeBody);
    const height = view.getUint32(selected.ispeBody + 4);
    if (selected.quarterTurns === 1 || selected.quarterTurns === 3) {
      return toImageDimensions({ width: height, height: width });
    }
    return toImageDimensions({ width, height });
  }
  static readTransform(buffer) {
    const selected = _HeicDimensions.primaryOf(buffer);
    if (selected == null) return null;
    return { quarterTurns: selected.quarterTurns, mirrorAxis: selected.mirrorAxis };
  }
  static primaryOf(buffer) {
    if (buffer.length < 12) return null;
    const view = dataViewOf(buffer);
    if (fourCharTag(view, 4) !== "ftyp") return null;
    return _HeicDimensions.selectPrimary(view);
  }
  static boxes(view, { start, end }) {
    const boxes = [];
    let offset = start;
    while (offset + 8 <= end) {
      let size = view.getUint32(offset);
      let header = 8;
      if (size === 1) {
        if (offset + 16 > end) break;
        size = view.getUint32(offset + 12);
        header = 16;
      } else if (size === 0) {
        size = end - offset;
      }
      if (size < header || offset + size > end) break;
      boxes.push({
        type: fourCharTag(view, offset + 4),
        body: offset + header,
        end: offset + size
      });
      offset += size;
    }
    return boxes;
  }
  static find(boxes, type2) {
    return boxes.find((box) => box.type === type2);
  }
  static contents(box, skip = 0) {
    return { start: box.body + skip, end: box.end };
  }
  static primaryItemId(view, pitm) {
    if (pitm.body + 6 > pitm.end) return null;
    const version3 = view.getUint8(pitm.body);
    const at2 = pitm.body + 4;
    if (version3 === 0) return view.getUint16(at2);
    if (at2 + 4 > pitm.end) return null;
    return view.getUint32(at2);
  }
  static itemPropertyIndices(view, ipma, itemId) {
    let offset = ipma.body;
    if (offset + 8 > ipma.end) return null;
    const version3 = view.getUint8(offset);
    const flags = view.getUint8(offset + 1) << 16 | view.getUint8(offset + 2) << 8 | view.getUint8(offset + 3);
    offset += 4;
    const entryCount = view.getUint32(offset);
    offset += 4;
    const idBytes = version3 >= 1 ? 4 : 2;
    const indexIs16 = (flags & 1) === 1;
    for (let entry = 0; entry < entryCount; entry++) {
      if (offset + idBytes + 1 > ipma.end) return null;
      const id = idBytes === 4 ? view.getUint32(offset) : view.getUint16(offset);
      offset += idBytes;
      const associations = view.getUint8(offset);
      offset += 1;
      const indices = [];
      for (let association = 0; association < associations; association++) {
        if (indexIs16) {
          if (offset + 2 > ipma.end) return null;
          indices.push(view.getUint16(offset) & 32767);
          offset += 2;
        } else {
          if (offset + 1 > ipma.end) return null;
          indices.push(view.getUint8(offset) & 127);
          offset += 1;
        }
      }
      if (id === itemId) return indices;
    }
    return null;
  }
  static selectPrimary(view) {
    const firstIspe = indexOfFourCharTag(view, "ispe");
    const firstIrot = indexOfFourCharTag(view, "irot");
    const firstImir = indexOfFourCharTag(view, "imir");
    const fallback2 = () => {
      if (firstIspe < 0 || firstIspe + 16 > view.byteLength) return null;
      return {
        ispeBody: firstIspe + 8,
        quarterTurns: firstIrot >= 0 && firstIrot + 4 < view.byteLength ? view.getUint8(firstIrot + 4) & 3 : 0,
        mirrorAxis: firstImir >= 0 && firstImir + 4 < view.byteLength ? mirrorAxisOf(view.getUint8(firstImir + 4)) : null
      };
    };
    const meta = _HeicDimensions.find(
      _HeicDimensions.boxes(view, { start: 0, end: view.byteLength }),
      "meta"
    );
    if (meta == null) return fallback2();
    const metaBoxes = _HeicDimensions.boxes(view, _HeicDimensions.contents(meta, 4));
    const pitm = _HeicDimensions.find(metaBoxes, "pitm");
    const iprp = _HeicDimensions.find(metaBoxes, "iprp");
    if (pitm == null || iprp == null) return fallback2();
    const iprpBoxes = _HeicDimensions.boxes(view, _HeicDimensions.contents(iprp));
    const ipco = _HeicDimensions.find(iprpBoxes, "ipco");
    const ipma = _HeicDimensions.find(iprpBoxes, "ipma");
    if (ipco == null || ipma == null) return fallback2();
    const properties = _HeicDimensions.boxes(view, _HeicDimensions.contents(ipco));
    const primaryId = _HeicDimensions.primaryItemId(view, pitm);
    const indices = primaryId == null ? null : _HeicDimensions.itemPropertyIndices(view, ipma, primaryId);
    if (indices == null) return fallback2();
    let ispeBody = null;
    let quarterTurns = 0;
    let mirrorAxis = null;
    for (const index of indices) {
      const property = properties[index - 1];
      if (property == null) continue;
      if (property.type === "ispe" && ispeBody == null && property.body + 12 <= property.end) {
        ispeBody = property.body + 4;
      } else if (property.type === "irot" && property.body < property.end) {
        quarterTurns = view.getUint8(property.body) & 3;
      } else if (property.type === "imir" && property.body < property.end) {
        mirrorAxis = mirrorAxisOf(view.getUint8(property.body));
      }
    }
    if (ispeBody == null) return fallback2();
    return { ispeBody, quarterTurns, mirrorAxis };
  }
};
function readHeicTransform(buffer) {
  return HeicDimensions.readTransform(buffer);
}
function readWebpDimensions2(buffer) {
  if (buffer.length < 12) return null;
  const view = dataViewOf(buffer);
  if (fourCharTag(view, 0) !== "RIFF") return null;
  if (fourCharTag(view, 8) !== "WEBP") return null;
  switch (fourCharTag(view, 12)) {
    case "VP8 ": {
      const width = view.getUint16(26, true) & 16383;
      const height = view.getUint16(28, true) & 16383;
      return toImageDimensions({ width, height });
    }
    case "VP8L": {
      const packed = view.getUint32(21, true);
      const width = (packed & 16383) + 1;
      const height = (packed >>> 14 & 16383) + 1;
      return toImageDimensions({ width, height });
    }
    case "VP8X": {
      const width = readU24LE(view, 24) + 1;
      const height = readU24LE(view, 27) + 1;
      return toImageDimensions({ width, height });
    }
    default:
      return null;
  }
}
function readWebpOrHeicDimensions(buffer) {
  return readWebpDimensions2(buffer) ?? HeicDimensions.read(buffer);
}
var PNG_SIGNATURE2 = [137, 80, 78, 71, 13, 10, 26, 10];
var JPEG_SEGMENTLESS_MARKERS = /* @__PURE__ */ new Set([
  1,
  208,
  209,
  210,
  211,
  212,
  213,
  214,
  215,
  216,
  217
]);
var JPEG_NON_FRAME_MARKERS = /* @__PURE__ */ new Set([196, 200, 204]);
function readPngDimensions2(buffer) {
  if (!PNG_SIGNATURE2.every((byte, index) => buffer[index] === byte)) {
    return null;
  }
  const view = dataViewOf(buffer);
  if (fourCharTag(view, 12) !== "IHDR") return null;
  return toImageDimensions({
    width: view.getUint32(16),
    height: view.getUint32(20)
  });
}
function readGifDimensions(buffer) {
  const header = String.fromCharCode(...buffer.subarray(0, 6));
  if (header !== "GIF87a" && header !== "GIF89a") return null;
  const view = dataViewOf(buffer);
  return toImageDimensions({
    width: view.getUint16(6, true),
    height: view.getUint16(8, true)
  });
}
function readJpegDimensions2(buffer) {
  if (buffer.length < 2 || buffer[0] !== 255 || buffer[1] !== 216) return null;
  const view = dataViewOf(buffer);
  let offset = 2;
  while (offset + 3 < buffer.length) {
    if (view.getUint8(offset) !== 255) {
      offset += 1;
      continue;
    }
    const marker17 = view.getUint8(offset + 1);
    if (marker17 === 255) {
      offset += 1;
      continue;
    }
    if (JPEG_SEGMENTLESS_MARKERS.has(marker17)) {
      offset += 2;
      continue;
    }
    if (marker17 === 218) return null;
    const segmentLength = view.getUint16(offset + 2);
    if (segmentLength < 2) return null;
    const isFrameHeader = marker17 >= 192 && marker17 <= 207 && !JPEG_NON_FRAME_MARKERS.has(marker17);
    if (isFrameHeader) {
      return toImageDimensions({
        width: view.getUint16(offset + 7),
        height: view.getUint16(offset + 5)
      });
    }
    offset += 2 + segmentLength;
  }
  return null;
}
function readImageFileDimensions(buffer) {
  return readWebpOrHeicDimensions(buffer) ?? readPngDimensions2(buffer) ?? readGifDimensions(buffer) ?? readJpegDimensions2(buffer);
}
