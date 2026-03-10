clearTagMasks(thisBot);
const journalBot = getBot("artifactJournal", true);
if (journalBot) {
    journalBot.collectArtifact(tags.artifactID);
}

tags.collected = true;
