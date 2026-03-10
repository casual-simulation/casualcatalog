const bot = that;

const message = bot.tags.message;

os.tip("thinking...");

if (message && message.toLowerCase()?.includes("hey finny")) {
    let aiMessage = message.substring(message.toLowerCase()?.indexOf("hey finny") + 9, message.length);
    aiMessage[0] == "," ? aiMessage = aiMessage.substring(1).trim() : aiMessage.trim();

    const artifactData = [];
    const artifactBots = getBots("geoArtifact");
    for (const artbot in artifactBots) {
        if (artifactBots[artbot]?.tags.artifactLocked) {
            const artdata = {
                title: artifactBots[artbot]?.tags.artifactTitle,
                story: artifactBots[artbot]?.tags.artifactDescription,
                location: artifactBots[artbot]?.tags.longitude || "unknown" + ", " + artifactBots[artbot]?.tags.latitude || "unknown"
            }

            artifactData.push(artdata);
        }
    }

    const response = await ai.chat(
        [{
            role: "system",
            content: "You are a helpful ai for the Grand Rapids Public Museum. You must take a request, if necessary look at the provided museum artifacts, and respond to the request."
        },
        {
            role: "system",
            content: "Here are your museum artifacts: " + JSON.stringify(artifactData)
        },
        {
            role: "user",
            content: aiMessage
        }
        ]
    )

    ab.log({name: "Finny", message: response.content});
}