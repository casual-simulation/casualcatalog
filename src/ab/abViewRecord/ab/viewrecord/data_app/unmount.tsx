await os.compileApp(tags.appId, <></>);
await os.unregisterApp(tags.appId);

thisBot.vars.onEscapeKeyPress = undefined;
masks.active = false;