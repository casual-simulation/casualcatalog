let locationBot = getBot(byTag("name", "locationRequest"));
if (that)
{
    locationBot.retryLocAccess()
}
else
{
    locationBot.stopLocationPulling()
}