//bios and inst handlers
const currentURL = new URL(configBot.tags.url);
const origin = currentURL.origin;

let newURL = new URL(origin);

if (configBot.tags.comId) {
    newURL.searchParams.append("comId", configBot.tags.comId);
}

newURL.searchParams.append("abStayAwake", true);

if (tags.bios == 'studio') {
    if (tags.instName) {
        newURL.searchParams.append("owner", tags.defaultPatternStudio ?? 'player');
        newURL.searchParams.append("inst", tags.instName);
        newURL.searchParams.append("gridPortal", 'home');
    } else {
        newURL.searchParams.append("bios", 'studio');
    }
} 
else if (tags.bios == 'local') {
    if (tags.instName) {
        newURL.searchParams.append("staticInst", tags.instName);
        newURL.searchParams.append("gridPortal", 'home');
    } else {
        newURL.searchParams.append("bios", 'local');
    }
} 
else if (tags.bios == 'free') {
    if (tags.instName) {
        newURL.searchParams.append("owner", 'public');
        newURL.searchParams.append("inst", tags.instName);
        newURL.searchParams.append("gridPortal", 'home'); 
    } else {
        newURL.searchParams.append("bios", 'free');
    }
}

if (configBot.tags.launcher) {
    newURL.searchParams.append("ask", configBot.tags.launcher);
} else {
    newURL.searchParams.append("ask", "launcher");
}

os.goToURL(newURL.href);