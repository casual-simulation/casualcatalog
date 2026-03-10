configBot.tags.publishScan = null;

let scannedURL;

try 
{
    scannedURL = new URL(that);
}
catch (e) 
{
    shout("abPublishAB", {ab: that, sourceEvent: 'qr_publish'});

    thisBot.abPublishAB({ab: that});

    return;
}