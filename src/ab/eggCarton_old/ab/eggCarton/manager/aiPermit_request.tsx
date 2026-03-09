shout("cartonMenuReset");

os.toast("checking for permit");

const auth = await os.requestAuthBot();

if (!auth){return};

const recordCheck = await os.getData(auth.id, "ai_permit");

if (recordCheck.success)
{
    os.toast("ai permit already exists");
}
else
{
    os.toast("generating permit", 5);

    const date = DateTime.now().toMillis();
    const authorization = await os.grantInstAdminPermission(auth.id);
    const recordData = {aiPermit: true, permitID: configBot.tags.staticInst, time: date};
    const recordedPermit = await os.recordData(auth.id, "ai_permit", recordData);

    console.log("PERMIT RECORD", recordedPermit);

    if (recordedPermit.success)
    {
        os.toast("ai permit created");
    }
    else
    {
        os.toast("ai permit failed, please try again");
    }
}