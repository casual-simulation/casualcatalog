const args = that;

const sameWindow = ABCommandsManager.parseArgFlag(args, '-w');

let systemTagName = null;

if (args && args.length > 0) {
    systemTagName = args.join(' ');
}

if (sameWindow) {
    // Open system portal in the current window.
    configBot.tags.systemPortal = true;
    configBot.tags.systemTagName = systemTagName;
} else {
    // Open system portal in a new tab.
    const url = new URL(configBot.tags.url);

    // Remove any portals that are set in the URL.
    let params = url.searchParams.keys();
    for (let param of params) {
        if (param.endsWith('Portal')) {
            url.searchParams.delete(param);
        }
    }

    // Turn on the system portal.
    url.searchParams.set('systemPortal', 'true');
    url.searchParams.delete('systemTagName');

    if (systemTagName) {
        url.searchParams.set('systemTagName', systemTagName);
    }

    os.openURL(url.href);
}
