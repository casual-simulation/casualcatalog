let soundCatalogue = tags.sounds;

for(const sound in soundCatalogue){
    console.log(`Buffering Sound ${sound}:`, soundCatalogue[sound])
    await os.bufferSound(soundCatalogue[sound]);
}