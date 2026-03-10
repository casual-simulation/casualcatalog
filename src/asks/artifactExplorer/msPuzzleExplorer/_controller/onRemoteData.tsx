let event = that.name;
let data = that.that;

console.log("Remote Data:", that);

switch (event) {
    case "showToast":
        os.toast(data.message);
        break;
    case "playSound":
        os.playSound(tags.sounds[data.message]);
        break;
    case "showMessage":
        // thisBot.mount({ message: data.message });
        // thisBot.mount({ message: "bcdkbfkbbdjkfnfcvkljdanvo;jdas" });
        let messageBot = getBot(byTag("system", "gameMessage.levelComplete"));
        if (messageBot?.tags?.label != data.message) {
            let offset = await thisBot.getOffset();
            create({
                space: "tempLocal",
                home: true,
                homeX: 0.5 + offset.x,
                homeY: 0.5 + offset.y,
                homeZ: 3,
                orientationMode: "billboard",
                label: data.message,
                labelFontSize: 3,
                onClick: `@ destroy(thisBot)`,
                system: "gameMessage.levelComplete",
                scale: 8,
                scaleY: 0.5,
                scaleZ: 0.01,
            });
        }

        break;
    case "showEmbed":
        console.log("embed test", data);

        let embedBots = getBots(byTag("system", "gameElement.embedSite"));
        if(embedBots.length < 1){
            let offset = await thisBot.getOffset();
            create({
                space: "tempLocal",
                home: true,
                homeX: 0.5 + offset.x,
                homeY: 0.5 + offset.y,
                homeZ: 3,
                orientationMode: "billboard",
                // label: data.message,
                // labelFontSize: 3,
                // onClick: `@ destroy(thisBot)`,
                system: "gameElement.embedSite",
                scale: 7,
                // scaleY: 0.5,
                scaleZ: 0.01,
                form: "iframe",
                formSubtype: "html",
                formAddress: thisBot.getEmbedHtml(data.message),
                removeEmbed: `@ destroy(thisBot);`
            });
        }
        break;
}