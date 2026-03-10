let gigID = getFormattedJSON({
    "Gig": configBot.tags.gig
});

let zapierPush = await web.hook({
    "method": "POST",
    "Content-Type": "application/json",
    "url": "https://hooks.zapier.com/hooks/catch/13116309/bqj2vpu/",
    "data": gigID
});

if (zapierPush.status == "200")
{
    os.toast("succesfully submitted");
}
else
{
    os.toast("submission failed, please try again");
}