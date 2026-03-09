const loadedSkills = new Set();

getBots((b) => {
    if (b.tags.abLoadedSkill != null) {
        loadedSkills.add(b.tags.abLoadedSkill);
    }
});

return Array.from(loadedSkills);