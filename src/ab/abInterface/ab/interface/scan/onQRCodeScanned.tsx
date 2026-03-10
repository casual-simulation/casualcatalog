if (!builderVersion)
{
    return;
}

ab.log(abPersonality.tags.abBuilderIdentity + ": scanned " + that);

let requestingAI = false;
if (configBot.tags.requestingAI) {
    configBot.tags.requestingAI = null;
    requestingAI = true;
}

if (configBot.tags.publishScan)
{
    os.closeQRCodeScanner();

    links.store.abQRPublish(that);
}
else if (configBot.tags.practicePermitScan)
{
    let scannedURL;

    configBot.tags.practicePermitScan = null;

    os.closeQRCodeScanner();

    try
    {
        scannedURL = new URL(that);
    }
    catch (e)
    {
        os.toast("not a recognized practice permit");

        console.log(e);

        return;
    }

    let phCheck = scannedURL.searchParams.has("ph");
    let instCheck = scannedURL.searchParams.has("inst");
    let abCheck = scannedURL.searchParams.has("ab");
    let cwCheck = scannedURL.searchParams.has("cw");

    if (phCheck && instCheck && abCheck && cwCheck)
    {
        os.goToURL(that);
    }
    else
    {
        os.toast("not a recognized practice permit");
    }

    shout("abMenuRefresh");
}
else if (configBot.tags.abScan)
{
    shout("abMenuRefresh");

    configBot.tags.abScan = null;
    
    os.closeQRCodeScanner();

    let scannedURL;

    try 
    {
        scannedURL = new URL(that);
    }
    catch (e) 
    {
        links.search.onLookupABEggs({abID: that});

        return;
    }

    if(scannedURL.searchParams.get("ask") == "eggCarton")
    {
        if (requestingAI) {
            scannedURL.searchParams.append("requestingAI", true);
        }
        
        os.goToURL(scannedURL.href);
    }
    else
    {
        scannedURL.searchParams.forEach((value, key) => {
            let newTag = key;
            let newValue = value;

            configBot.tags[newTag] = newValue;
        });

        if (configBot.tags.ask) {
            links.search.onLookupABEggs({abID: configBot.tags.ask});
        } else if (configBot.tags.pattern) {
            links.search.onLookupABEggs({abID: configBot.tags.pattern});
        }
        
    }
}