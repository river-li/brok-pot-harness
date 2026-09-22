/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/grok-bot-harness/src/ports/credentials.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var SAND_CREDENTIAL_TURN_REFUSAL_PHRASE = {
  room: `this is a group-room turn, and the user's 1Password logins are only available in their own 1:1 chat on the main session. Nothing is wrong with the 1Password connection. If the sign-in is for your user, ask them to continue in your 1:1 chat (pass "to":"dm" on SendToUser to reach it) and use their logins from there; if it is for someone else in the room, they sign in themselves`,
  side_session: "this is a side session, and the user's 1Password logins are only available from the main session. Nothing is wrong with the 1Password connection. Ask the user to continue in the main session, or hand them the screen with request_box_help"
};

