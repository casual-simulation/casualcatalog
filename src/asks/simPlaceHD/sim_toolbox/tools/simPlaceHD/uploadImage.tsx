const files = await os.showUploadFiles();

if (!files) {
    return;
}

const image = files[0];
if (image.mimeType != 'image/png' && image.mimeType != 'image/jpeg') {
    os.toast("uploaded image must be a png or jpeg");
    return;
} else {
    await thisBot.createSkybox({prompt: image, usingImage: true, isUpload: true});
}