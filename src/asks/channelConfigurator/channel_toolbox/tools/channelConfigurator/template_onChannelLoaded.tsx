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

//Put code here that determines the conditions in which a pattern gets loaded
if (tags.defaultPattern) {
    newURL.searchParams.append("pattern", tags.defaultPattern);
}

if (tags.defaultPatternStudio) {
    newURL.searchParams.append("studio", tags.defaultPatternStudio);
}

os.goToURL(newURL.href);