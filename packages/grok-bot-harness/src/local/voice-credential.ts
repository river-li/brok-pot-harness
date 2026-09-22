/** Desktop-main credential port for the local voice bridge. */
export async function mintLocalVoiceCredential() {
  const base = new URL(
    process.env.SAND_HOST_GATEWAY_URL || "http://127.0.0.1:1540",
  );
  if (
    !["http:", "https:"].includes(base.protocol) ||
    !["127.0.0.1", "localhost", "[::1]"].includes(base.hostname) ||
    base.username ||
    base.password ||
    base.search ||
    base.hash
  )
    throw new Error("Local voice requires a loopback host gateway.");
  const token = process.env.SAND_HOST_GATEWAY_TOKEN;
  if (!token) throw new Error("Local gateway credentials are missing.");
  try {
    const response = await fetch(new URL("/local/voice/credential", base), {
      method: "POST",
      redirect: "error",
      signal: AbortSignal.timeout(10000),
      headers: {
        authorization: `Bearer ${token}`,
        "content-type": "application/json",
      },
      body: "{}",
    });
    if (
      !response.ok ||
      !response.body ||
      Number(response.headers.get("content-length")) > 4096
    ) {
      await response.body?.cancel();
      throw new Error();
    }
    const reader = response.body.getReader();
    let body = "";
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        body += Buffer.from(value).toString("utf8");
        if (body.length > 4096) throw new Error();
      }
    } finally {
      await reader.cancel().catch(() => {});
      reader.releaseLock();
    }
    const value = JSON.parse(body);
    if (
      !/^[a-f0-9]{64}$/.test(value.clientSecret) ||
      value.model !== "grokbot-local-voice" ||
      !Number.isFinite(value.expiresAtUnixSeconds) ||
      value.expiresAtUnixSeconds * 1000 <= Date.now()
    )
      throw new Error();
    const websocket = new URL("/local/voice", base);
    websocket.protocol = base.protocol === "https:" ? "wss:" : "ws:";
    return {
      clientSecret: value.clientSecret,
      expiresAtUnixSeconds: value.expiresAtUnixSeconds,
      model: value.model,
      websocketUrl: websocket.href,
    };
  } catch {
    throw new Error(
      "The local voice bridge is unavailable. Check the host and speech service.",
    );
  }
}
