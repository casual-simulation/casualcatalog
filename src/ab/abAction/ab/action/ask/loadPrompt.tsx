await os.requestAuthBotInBackground();

if (authBot.tags.privacyFeatures.allowPublicData == false)
{
    os.toast("not authorized");

    return;
}

const promptName = "gpt_prompt_" + that;
const newPrompt = await os.getData(links.remember.tags.abRecordKey, promptName);

if (!newPrompt.success)
{
    os.toast("no prompt found by that name");
}
else
{
    tags.prompt_core = newPrompt.data;
}

if (configBot.tags.prompt_base == that)
{
    return;
}

thisBot.editPrompt();