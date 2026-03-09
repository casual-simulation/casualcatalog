if (tags.checkComplete){return};

const auth = await os.requestAuthBotInBackground();

if (!auth){return};

const recordCheck = await os.getData(auth.id, "ai_permit");

if (recordCheck.success)
{
    masks.checkComplete = true;
}
else
{
    auth.tags.privacyFeatures.allowAI = false;
}