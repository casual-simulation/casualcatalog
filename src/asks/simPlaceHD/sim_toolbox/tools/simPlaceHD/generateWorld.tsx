if (tags.isGenerating) {
    os.toast("Generation already in progress...");
    return;
}

const prompt = that.prompt;
if (!prompt) return;

tags.isGenerating = true;

configBot.tags.menuPortal = "storyPlaceLoading";
let loadingBar = await ab.links.menu.abCreateMenuBusyIndicator({
    label: "Sending to World Labs Marble API",
    storyPlaceLoading: true
});

try {
    const model = tags.model || "Marble 0.1-mini";
    const genResponse = await web.post(
        "https://api.worldlabs.ai/marble/v1/worlds:generate",
        {
            display_name: that.name,
            model: model,
            world_prompt: {
                type: "text",
                text_prompt: prompt
            }
        },
        {
            headers: {
                "Content-Type": "application/json",
                "WLT-Api-Key": tags.apiKey
            }
        }
    );

    if (!genResponse || !genResponse.data || !genResponse.data.operation_id) {
        os.toast("Failed to start generation. Check API key.");

        destroy(loadingBar);

        tags.isGenerating = false;
        return;
    }

    const operationId = genResponse.data.operation_id;

    destroy(loadingBar);
    configBot.tags.menuPortal = "storyPlaceLoading";
    loadingBar = await ab.links.menu.abCreateMenuBusyIndicator({
        label: "World generation started! Polling for completion",
        storyPlaceLoading: true
    });

    let done = false;
    let attempts = 0;
    const maxAttempts = 120;
    let worldData = null;

    while (!done && attempts < maxAttempts) {
        await os.sleep(5000);
        attempts++;

        const pollResponse = await web.get(
            "https://api.worldlabs.ai/marble/v1/operations/" + operationId,
            {
                headers: {
                    "WLT-Api-Key": tags.apiKey
                }
            }
        );

        if (pollResponse && pollResponse.data) {
            const op = pollResponse.data;
            if (op.done === true) {
                done = true;
                if (op.error) {
                    os.toast("Generation failed: " + (op.error.message || "Unknown error"));
                } else {
                    worldData = op.response;
                }
            }
        }
    }

    if (!done) {
        os.toast("Generation timed out after " + maxAttempts + " polls.");
        tags.isGenerating = false;

        destroy(loadingBar);
        return;
    }

    if (!worldData) {
        tags.isGenerating = false;
        destroy(loadingBar);
        return;
    }

    const resolution = tags.resolution || "100k";
    let spzUrl = null;

    if (worldData.assets && worldData.assets.splats && worldData.assets.splats.spz_urls) {
        spzUrl = worldData.assets.splats.spz_urls[resolution]
              || worldData.assets.splats.spz_urls["100k"]
              || worldData.assets.splats.spz_urls["500k"]
              || worldData.assets.splats.spz_urls["full_res"];
    }

    tags.lowRes = worldData.assets.splats.spz_urls["100k"];
    tags.medRes = worldData.assets.splats.spz_urls["500k"];
    tags.highRes = worldData.assets.splats.spz_urls["full_res"];

    if (!spzUrl) {
        os.toast("No splat URL found in response.");
        tags.isGenerating = false;
        destroy(loadingBar);
        return;
    }

    return spzUrl;

} catch (err) {
    os.toast("Error: " + (err.message || err));
    destroy(loadingBar);
} finally {
    tags.isGenerating = false;
    destroy(loadingBar);
}
