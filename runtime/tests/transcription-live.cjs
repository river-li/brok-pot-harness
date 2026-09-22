/* Run on the Mac after create-speech-fixtures.py and local service startup. */
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const {
  createDesktopTranscribeService,
} = require("../../dist/local/transcription.js");

(async () => {
  const root = path.resolve(__dirname, "../..");
  const token = fs
    .readFileSync(path.join(root, ".runtime/gateway-token"), "utf8")
    .trim();
  const fixtures = JSON.parse(
    fs.readFileSync(
      path.join(root, ".runtime/tests/speech/manifest.json"),
      "utf8",
    ),
  );
  const transcribe = createDesktopTranscribeService({ token });
  for (const sample of fixtures) {
    const result = await transcribe({
      audio: fs.readFileSync(sample.path),
      mimeType: "audio/wav",
      language: sample.language === "en" ? "en-US" : "zh-CN",
    });
    const normalized = result.text.toLowerCase().replace(/[\p{P}\s]/gu, "");
    if (sample.language === "en") {
      assert.ok(
        normalized.includes("localvoicetranscriptiontest"),
        "English speech must be recognized",
      );
      assert.ok(
        normalized.includes("projectfolder"),
        "The full English recording must be recognized",
      );
    } else {
      assert.ok(
        /语音测试|語音測試/.test(normalized),
        "Chinese speech must be recognized",
      );
      assert.ok(
        /天气很好|天氣很好/.test(normalized),
        "The full Chinese recording must be recognized",
      );
    }
    console.log(
      JSON.stringify({
        language: sample.language,
        text: result.text,
        transcriptionTimeMs: result.transcriptionTimeMs,
      }),
    );
  }
  console.log(
    "PASS desktop adapter → authenticated original gateway → local CPU Whisper: English and Chinese speech.",
  );
})().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
