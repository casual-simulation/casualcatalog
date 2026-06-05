let journal = getBot(byTag("artifactJournal", true));
if (that == true)
{
    journal.links.homeworld?.toggleGPS(true);
}
else
{
   journal.links.homeworld?.toggleGPS(false);
}