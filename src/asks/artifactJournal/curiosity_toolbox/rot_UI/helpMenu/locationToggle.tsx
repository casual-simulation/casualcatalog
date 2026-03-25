let journal = getBot(byTag("artifactJournal", true));
if (that == true)
{
    journal.toggleLocationPull(true);
}
else
{
    journal.toggleLocationPull(false);
}