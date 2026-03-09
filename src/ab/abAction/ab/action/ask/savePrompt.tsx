await os.requestAuthBotInBackground();

if (authBot.tags.privacyFeatures.allowPublicData == false || authBot.tags.privacyFeatures.publishData == false)
{
    os.toast("not authorized");

    return;
}

const author = await os.requestAuthBot();
const promptName = "gpt_prompt_" + that;
const newPrompt = await os.recordData(links.remember.tags.abRecordKey, promptName, tags.prompt_core, {updatePolicy: [author.id]});

if (!newPrompt.success)
{
    os.toast("something went wrong, please try again");
}
else
{
    os.toast("prompt saved as " + that);
}

thisBot.editPrompt();