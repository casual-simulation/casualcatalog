let discoverablesArr = await thisBot.findClosestObj();
console.log("open camera")
console.log(discoverablesArr)
let img = await os.capturePhoto({
    cameraType: "rear"
})
tags.takenPhoto=true;
console.log("image")
console.log(img);
let locationBot = getBot(byTag("name", "locationsPopup"));
locationBot.tags.response="Analyzing...";
locationBot.openApp();

let output = bytes.toBase64Url(await img.data.arrayBuffer())
console.log(output)
const blob = bytes.fromBase64Url(output);
const result = await os.recordFile("vRK2.bXlQdWJsaWNSZWNvcmQ=.N3NodjlpMzBURHJ2MU1GZ0hwNkw4Zz09.subjectfull", blob);
console.log(result.url)
const location = await os.getGeolocation();
if (location.success) {
    //console.log(`You are at (${location.latitude}, ${location.longitude})`);
}
else {
    console.log(location.errorMessage);
}

let x="45N"
let y="82E"
let arrayString= ""
for (var i = 0; i < discoverablesArr.length; i++) {
    arrayString+=("{ Name: "+ discoverablesArr[i].Name + ", Description: " + discoverablesArr[i].Description + ", Link: '" + discoverablesArr[i].GRPMUrl +"'} ")
}
//text: `Look at the descriptions and names of these objects "${arrayString}", which are listed in order of closest to furthest from my current location, and tell me the name of which object is likely in this image and include the link associated with it in the format of "This appears to be an " + objectName + ". You can find more info about it at " + link". If there are no likely matches, say "There are no matching objects"`
const response = await ai.chat({
        role: 'user',
        content: [
            {
                text: `Look at the descriptions and names of these objects "${arrayString}", which are listed in order of closest to furthest from my current location, and find which object is likely in this image and have the response be only the link associated with it with no other characters. If there are no likely matches, say "There are no matching objects"`
            },
            {
                base64: bytes.toBase64String(new Uint8Array(await img.data.arrayBuffer())),
                mimeType: img.data.type,
            }
        ]
    }, 
    {
        preferredModel: 'claude-sonnet-4-0'
});
tags.takenPhoto=false
console.log(response.content)
locationBot.closeApp();
locationBot.tags.response=response.content;
//thisBot.closeApp();
locationBot.openApp();