const shutterUrl = links.learn.abBuildCasualCatalogURL(`/asks/teleXR-assets/camera-shutter.mp3`);
masks.shutterUrl = shutterUrl;

const beepUrl = links.learn.abBuildCasualCatalogURL(`/asks/teleXR-assets/beep.mp3`);
masks.beepUrl = beepUrl;

os.bufferSound(shutterUrl);
os.bufferSound(beepUrl);