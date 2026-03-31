const inXR = configBot.tags.arEnabled || configBot.tags.vrEnabled;

if (inXR) {
    thisBot.onCaptureClick();
    return;
}

const photo = await os.capturePhoto();
if (!photo)
{
    return;
}

thisBot.parsePhoto(photo);