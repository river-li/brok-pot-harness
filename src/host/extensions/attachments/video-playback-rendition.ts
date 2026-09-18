var TRANSCODE_THREADS = 2;
var MAX_CACHED_RENDITIONS2 = 8;
var videoPlaybackRecipe = {
  medium: "video",
  renditionExtension: ".mp4",
  maxCached: MAX_CACHED_RENDITIONS2,
  async plan(sourcePath, step) {
    const probe = await step.attempt(
      "probe",
      () => step.run("ffprobe", [
        "-v",
        "error",
        "-select_streams",
        "v:0",
        "-show_entries",
        "stream=codec_name",
        "-of",
        "default=noprint_wrappers=1:nokey=1",
        "-protocol_whitelist",
        "file",
        sourcePath
      ])
    );
    if (probe === null) return null;
    if (probe.trim().toLowerCase() !== "hevc") return { kind: "source" };
    return {
      kind: "rendition",
      ffmpegArgs: (outputPath) => [
        "-v",
        "error",
        "-nostdin",
        "-y",
        "-protocol_whitelist",
        "file",
        "-i",
        sourcePath,
        "-map",
        "0:v:0",
        "-map",
        "0:a:0?",
        "-c:v",
        "libx264",
        "-threads",
        String(TRANSCODE_THREADS),
        "-preset",
        "veryfast",
        "-crf",
        "23",
        "-pix_fmt",
        "yuv420p",
        "-c:a",
        "aac",
        "-b:a",
        "128k",
        "-movflags",
        "+faststart",
        outputPath
      ]
    };
  }
};
var withVideoPlaybackSource = createMediaRenditionCache(videoPlaybackRecipe);
