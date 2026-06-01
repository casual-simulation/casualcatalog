let journal = getBot(byTag("artifactJournal", true));
if (that == true)
{
    journal.useGPS(true);
}
else
{
    journal.useGPS(false);
}