function cookieOriginApprovalItemsFromOrigins(origins) {
  const items = [];
  const seen = /* @__PURE__ */ new Set();
  for (const entry of origins) {
    const origin = parseCookieOrigin(entry.origin);
    if (origin === null) continue;
    const profileId = parseChromeProfileId(entry.profileId ?? "Default");
    if (profileId === null) continue;
    const key = cookieOriginGrantKey({ profileId, origin });
    if (seen.has(key)) continue;
    seen.add(key);
    items.push({ profileId, profileDisplayName: "", origin });
  }
  return items;
}
