//logic for hatching of an ab
shout('ovoMenuReset');

//data in regards to what ab is going to be hatched
const ovo = that;

//hatch specific variables
let initialBoot = ovo.tags.initialBoot;
let targetVersion = ovo.tags.stableVersion ?? ovo.tags.targetVersion;

if ((configBot.tags.abVersion || configBot.tags.patternVersion) && (ovo.tags.abID == configBot.tags.pattern || ovo.tags.abID == configBot.tags.ab))
{
    targetVersion = configBot.tags.abVersion ?? configBot.tags.patternVersion;
}

//targeted versions
if (configBot.tags.version && (ovo.tags.abID == configBot.tags.pattern || ovo.tags.abID == configBot.tags.ab || !isNaN(configBot.tags.version)))
{
    if (configBot.tags.version == "feedback")
    {
        targetVersion = ovo.tags.feedbackVersion;
    }
    else if (configBot.tags.version == "current")
    {
        targetVersion = ovo.tags.eggVersionHistory.length;
    }
    else if (!isNaN(configBot.tags.version))
    {
        targetVersion = configBot.tags.version
    }

    configBot.tags.version = null;
}

if (isNaN(targetVersion))
{
    targetVersion = ovo.tags.eggVersionHistory.length;
}

let versionArray = ovo.tags.eggVersionHistory;
let fileURL = versionArray[targetVersion - 1];
let key = ovo.tags.key ? ovo.tags.key : configBot.tags.key;
let fileGet;

//actual file retrieval
try
{
    fileGet = await os.getFile(fileURL);
}
catch (e)
{
    console.error(e);
    links.utils.abLogAndToast('no file found');

    return;
}

//handling for encrypted ab file
if (crypto.isEncrypted(fileGet))
{
    if (!key)
    {
        key = await os.showInput('', {
            type: 'secret',
            title: 'Enter key'
        });
    }

    fileGet = crypto.decrypt(key, fileGet);

    if (fileGet == null) {
        links.utils.abLogAndToast('incorrect key');
        return;
    }
   
    fileGet = JSON.parse(fileGet);
    fileGet = fileGet.state;
}
else
{
    fileGet = fileGet.state;
}

//clean up
destroy(ovo);

//toast if not on stable
if(ovo.tags.stableVersion != targetVersion && !configBot.tags.abSilent)
{
    if (ovo.tags.feedbackVersion == targetVersion)
    {
        os.toast("load feedback version of " + ovo.tags.abID);
    }
    else
    {
        os.toast("load version " + targetVersion + " of " + ovo.tags.eggVersionHistory.length + " of " + ovo.tags.abID);
    }
}

//generate bots based on the file retrieved *HERE*
const newBots = await links.create.abCreateBots({
    bots: fileGet,
    origin: ovo.tags.abID,
    studio: ovo.tags.studio,
    version: targetVersion,
    initialBoot: initialBoot,
    eggParameters: ovo.tags.eggParameters,
    onPreprocessBeforeCreate: ovo.vars.onPreprocessBeforeCreate,
    sourceEvent: ovo.tags.sourceEvent,
});

return newBots;