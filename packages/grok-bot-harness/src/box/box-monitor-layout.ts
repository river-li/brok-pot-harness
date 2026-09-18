var SAND_MONITOR_WIDTH = 1280;
var SAND_MONITOR_HEIGHT = 800;
function displaySpaceSentence({
  width = SAND_MONITOR_WIDTH,
  height = SAND_MONITOR_HEIGHT
} = {}) {
  return `Display is ${width}\xD7${height}. Computer click/move/scroll x,y are pixels in that space (origin top-left); never emit coordinates outside 0..${width - 1} \xD7 0..${height - 1}.`;
}
