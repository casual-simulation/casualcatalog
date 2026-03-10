const photo = await os.capturePhoto();
if (!photo)
{
    return;
}

thisBot.resetSkyboxMenu();
thisBot.makeLoadingMenu();

const response = await ai.chat({
        role: 'user',
        content: [
            {
                text: `Please generate a detail description of what in the captured image.
                
                RULES:
                1. Do not use any special characters or asteriks.
                2. Make a it a clear concise prompt.
                3. Please limit it to 150 words or less.
                4. Not following the above rules could hurt or break the experience.
                `
            },
            {
                base64: bytes.toBase64String(new Uint8Array(await photo.data.arrayBuffer())),
                mimeType: photo.data.type,
            }
        ]
    }, 
    {
        preferredModel: 'gpt-4o'
});

console.log("PROMPT: "+response.content);

thisBot.onCreateSkybox(response.content);
thisBot.resetSkyboxMenu();