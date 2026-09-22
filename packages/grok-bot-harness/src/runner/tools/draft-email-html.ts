init_dist3();
var BARE_URL = /https?:\/\/[^\s<>"]+/g;
var TRAILING_PROSE_PUNCTUATION = /[.,;:!?]$/;
function emailDraftHtmlBody(body) {
  const text2 = body.replace(/\r\n?/g, "\n");
  let html = "";
  let cursor = 0;
  for (const match2 of text2.matchAll(BARE_URL)) {
    const url2 = withoutTrailingProsePunctuation(match2[0]);
    const escapedUrl = escapeHtml(url2);
    html += `${proseHtml(text2.slice(cursor, match2.index))}<a href="${escapedUrl}">${escapedUrl}</a>`;
    cursor = match2.index + url2.length;
  }
  return `<div dir="auto">${html}${proseHtml(text2.slice(cursor))}</div>`;
}
function proseHtml(text2) {
  return escapeHtml(text2).replace(/\n/g, "<br>");
}
function withoutTrailingProsePunctuation(candidate) {
  let url2 = candidate;
  while (TRAILING_PROSE_PUNCTUATION.test(url2) || closesUnopenedParenthesis(url2)) {
    url2 = url2.slice(0, -1);
  }
  return url2;
}
function closesUnopenedParenthesis(url2) {
  return url2.endsWith(")") && url2.split("(").length < url2.split(")").length;
}
