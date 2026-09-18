var SAND_VOICE_GREETINGS = [
  { id: "how-i-sound", text: "Hey, this is how I sound on a call." },
  { id: "how-its-going", text: "Hi, how is it going?" },
  { id: "good-to-meet-you", text: "Hey there, good to meet you." },
  { id: "what-are-we-on", text: "Hi, what are we working on today?" },
  { id: "ready-when-you-are", text: "Hey, ready when you are." }
];
var SAND_VOICE_PREVIEW_DEADLINE_MS = 2e4;
var [GREETING_AN_UNKNOWN_ID_FALLS_BACK_TO] = SAND_VOICE_GREETINGS;
function sandVoiceGreetingText(greetingId) {
  const greeting = SAND_VOICE_GREETINGS.find((entry) => entry.id === greetingId);
  return (greeting ?? GREETING_AN_UNKNOWN_ID_FALLS_BACK_TO).text;
}
