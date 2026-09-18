var SIDECAR_SCREENSHOT_MIME_TYPE = "image/png";
var MacScreenshotCodec = {
  async normalize(image2) {
    if (image2.mimeType !== SIDECAR_SCREENSHOT_MIME_TYPE) {
      throw new Error(`Mac screenshot must be ${SIDECAR_SCREENSHOT_MIME_TYPE}, received ${image2.mimeType}`);
    }
    const Jimp = await getMinimalJimp();
    const decoded = await Jimp.read(Buffer.from(image2.data, "base64"));
    const webp = await encodeMacLosslessWebp({
      data: decoded.bitmap.data,
      width: decoded.bitmap.width,
      height: decoded.bitmap.height
    });
    return webp.toString("base64");
  }
};
