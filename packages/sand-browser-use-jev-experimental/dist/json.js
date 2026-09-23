function isJsonObject2(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function extractJsonObject(text2) {
  const unfenced = text2.replace(/```(?:json)?/gu, "").trim();
  const start = unfenced.indexOf("{");
  if (start === -1) {
    throw new Error(`llm: no JSON object in reply: ${text2.slice(0, 200)}`);
  }
  const candidates = [unfenced.lastIndexOf("}")];
  for (let index = start; index < unfenced.length; index += 1) {
    if (unfenced[index] === "}") {
      candidates.push(index);
    }
  }
  for (const end of candidates) {
    if (end < start) {
      continue;
    }
    let parsed2;
    try {
      parsed2 = JSON.parse(unfenced.slice(start, end + 1));
    } catch {
      continue;
    }
    if (isJsonObject2(parsed2)) {
      return parsed2;
    }
    throw new Error(`llm: no JSON object in reply: ${text2.slice(0, 200)}`);
  }
  throw new Error(`llm: unparseable JSON in reply: ${text2.slice(0, 200)}`);
}
