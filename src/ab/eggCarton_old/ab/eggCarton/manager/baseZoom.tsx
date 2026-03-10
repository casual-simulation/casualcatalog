console.log("ZOOM");

await os.focusOn(links.museumBot, {
    duration: 3,
    rotation: {
        x: Math.PI / 3,
        y: Math.PI / 4
    },
    zoom: 3000
}).catch(e => {thisBot.baseZoom();});

//return true;