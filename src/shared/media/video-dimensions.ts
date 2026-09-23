function toDimensions({ width, height }) {
  if (!Number.isFinite(width) || !Number.isFinite(height)) return null;
  if (width <= 0 || height <= 0) return null;
  return { width, height };
}
function fourCharTag2(view, offset) {
  return String.fromCharCode(
    view.getUint8(offset),
    view.getUint8(offset + 1),
    view.getUint8(offset + 2),
    view.getUint8(offset + 3)
  );
}
var Mp4Dimensions = class _Mp4Dimensions {
  static read(window2) {
    const view = new DataView(window2.buffer, window2.byteOffset, window2.byteLength);
    let searchFrom = 0;
    while (searchFrom + 4 <= view.byteLength) {
      const moovTag = _Mp4Dimensions.indexOfTag(view, "moov", searchFrom);
      if (moovTag < 0) return null;
      const dimensions = _Mp4Dimensions.readMoov(view, moovTag);
      if (dimensions != null) return dimensions;
      searchFrom = moovTag + 4;
    }
    return null;
  }
  static indexOfTag(view, tag, from2) {
    const t0 = tag.charCodeAt(0);
    const t1 = tag.charCodeAt(1);
    const t2 = tag.charCodeAt(2);
    const t3 = tag.charCodeAt(3);
    for (let at3 = Math.max(from2, 4); at3 + 4 <= view.byteLength; at3++) {
      if (view.getUint8(at3) === t0 && view.getUint8(at3 + 1) === t1 && view.getUint8(at3 + 2) === t2 && view.getUint8(at3 + 3) === t3) {
        return at3;
      }
    }
    return -1;
  }
  static readMoov(view, moovTag) {
    const box = _Mp4Dimensions.clampedBoxAt(view, { at: moovTag - 4, end: view.byteLength });
    if (box == null) return null;
    for (const trak of _Mp4Dimensions.childBoxes(view, box.body, "trak")) {
      for (const tkhd of _Mp4Dimensions.childBoxes(view, trak, "tkhd")) {
        const dimensions = _Mp4Dimensions.readTkhd(view, tkhd);
        if (dimensions != null) return dimensions;
      }
    }
    return null;
  }
  static clampedBoxAt(view, { at: at3, end }) {
    if (at3 < 0 || at3 + 8 > end) return null;
    let size = view.getUint32(at3);
    let header = 8;
    if (size === 1) {
      if (at3 + 16 > end) return null;
      size = view.getUint32(at3 + 12);
      header = 16;
    } else if (size === 0) {
      size = end - at3;
    }
    if (size < header) return null;
    return {
      body: { start: at3 + header, end: Math.min(at3 + size, end) },
      next: at3 + size
    };
  }
  static childBoxes(view, range2, type2) {
    const children = [];
    let offset = range2.start;
    while (offset + 8 <= range2.end) {
      const box = _Mp4Dimensions.clampedBoxAt(view, { at: offset, end: range2.end });
      if (box == null) break;
      if (fourCharTag2(view, offset + 4) === type2) {
        children.push(box.body);
      }
      if (box.next > range2.end) break;
      offset = box.next;
    }
    return children;
  }
  static readTkhd(view, box) {
    if (box.start >= box.end) return null;
    const body = new DataView(view.buffer, view.byteOffset + box.start, box.end - box.start);
    const version3 = body.getUint8(0);
    const matrixAt = 40 + (version3 === 1 ? 12 : 0);
    const widthAt = matrixAt + 36;
    if (widthAt + 8 > body.byteLength) return null;
    const width = _Mp4Dimensions.read16Dot16(body, widthAt);
    const height = _Mp4Dimensions.read16Dot16(body, widthAt + 4);
    if (_Mp4Dimensions.matrixIsQuarterTurn(body, matrixAt)) {
      return toDimensions({ width: height, height: width });
    }
    return toDimensions({ width, height });
  }
  static read16Dot16(view, offset) {
    return view.getUint32(offset) >>> 16;
  }
  static matrixIsQuarterTurn(view, matrixAt) {
    const a = view.getUint32(matrixAt);
    const b2 = view.getUint32(matrixAt + 4);
    const c = view.getUint32(matrixAt + 12);
    const d = view.getUint32(matrixAt + 16);
    return a === 0 && d === 0 && b2 !== 0 && c !== 0;
  }
};
