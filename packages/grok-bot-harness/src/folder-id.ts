function isSafeFolderId(id) {
  return typeof id === "string" && id.length > 0 && !id.includes("/") && !id.includes("\\") && !id.includes("\0") && id !== "." && id !== "..";
}
