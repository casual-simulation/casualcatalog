let skyPainter = getBot("name", "psSkyPainter");

if (skyPainter == null) 
{
    thisBot.createImportPrompt();
}
else if (tags.formAddress == 0 || tags.formAddress == null) 
{
    skyPainter.makeInputMenu();
}
else 
{ 
    thisBot.generateSkybox(); 
}