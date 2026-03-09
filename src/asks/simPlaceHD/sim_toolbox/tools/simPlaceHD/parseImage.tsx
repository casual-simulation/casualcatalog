const photo = await os.capturePhoto();
if (!photo) {
    return;
}

await thisBot.createSkybox({prompt: photo, usingImage: true});