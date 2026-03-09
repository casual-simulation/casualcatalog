shout("abMenuReset");

let gigID = configBot.tags.gig;
let ab = configBot.tags.ab || configBot.tags.autoLoad || configBot.tags.auxCode;
let expectedFormat = "collab_";
let abFormatCheck = ab.includes(expectedFormat);

if (!abFormatCheck)
{
    os.toast("ab not properly formatted");

    return;
}

if (gigID && ab)
{
    let gigKey = ab.substring(7);
    configBot.tags.manualPublish = true;

    shout("abPublishAB", {ab: ab, key: gigKey});
}