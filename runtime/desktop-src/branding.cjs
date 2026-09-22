// Apply the project icon to development Electron as well as the packaged app.
const {app, nativeImage} = require('electron');
const path = require('node:path');
app.whenReady().then(() => {
  const icon = nativeImage.createFromPath(path.join(__dirname, 'branding/icon.png'));
  if (!icon.isEmpty() && app.dock) app.dock.setIcon(icon);
});
