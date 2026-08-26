shout("abMenuRefresh");

const username = await ab.links.console.getUserName();

if (!ab.links.console.masks.open) {
    whisper(ab.links.console, "showConsole");
}
ab.log({ name: username, message: that});

let hasAsk = that.includes("<ask>");
let loadingBar;

if (hasAsk) {
    thisBot.handleAsk(that);
} else {
    configBot.tags.menuPortal = 'abMenu';
    loadingBar = ab.links.menu.abCreateMenuBusyIndicator({
        abMenu: true,
        label: 'thinking...',
    });
}

const aiPrompt = await thisBot.aiPrompt();

try {
    const history = tags.conversationHistory ? [...tags.conversationHistory] : [
        {
        role: "system",
        content: aiPrompt
    },{
        role: 'user',
        content: 'Hello World'
    },{
        role: "assistant",
        content: `{
        response: 'What would you like to do?',
            options: [
            'rest',
            'play',
            'work',
            'none of the above'
        ]}`
    }];

    history.push({
        role: 'user',
        content: that
    })

    const response = await ai.chat(history, {
        preferredModel: abPersonality.tags.abPreferredAIModel
    })

    if (response) {
        let res = response.content;
        let match = res.match(/```json\s*([\s\S]*?)\s*```/);
        let cleanStr = match ? match[1] : res;
        masks.menuData = JSON.parse(cleanStr);
        if (!hasAsk) {
            ab.links.menu.abOpenMenu("core");
        }
        
        history.push({
            role: 'assistant',
            content: cleanStr
        });
        masks.conversationHistory = history;

        if (!ab.links.console.masks.open) {
            whisper(ab.links.console, "showConsole");
        }
        ab.log({ name: abPersonality.tags.abBuilderIdentity, message: tags.menuData?.response});

    } else {
        os.toast("Error prompting ai");
        console.log("Error prompting ai", response);
    }

} catch (e) {
    os.toast("Error prompting ai");
    console.log("Error prompting ai: ", e);
}

destroy(loadingBar);