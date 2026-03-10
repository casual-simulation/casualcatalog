os.toast("checking for permit");

if (!authBot) {
    await os.requestAuthBot();
}

if (!authBot){
    os.toast("could not get authBot");
    return;
};

const recordCheck = await os.getData(authBot.id, "ai_permit");

if (recordCheck.success)
{
    os.toast("ai permit already exists");
}
else
{
    os.toast("generating permit", 5);

    const date = DateTime.now().toMillis();
    const recordData = {aiPermit: true, permitID: configBot.tags.staticInst, time: date};
    let recordedPermit = await os.recordData(authBot.id, "ai_permit", recordData);

    if (!recordedPermit.success) {
        await os.grantInstAdminPermission(authBot.id);
        recordedPermit = await os.recordData(authBot.id, "ai_permit", recordData);
    }

    if (recordedPermit.success)
    {
        os.toast("ai permit created");
    }
    else
    {
        os.toast("ai permit failed, please try again");
    }

    return recordedPermit;
}