if (!tags.activated) {
    if (stepManager.tags.sequence == 'intro' && stepManager.tags.step == 1) {
        shout('executeDialogue', {sequence: 'intro', step: 1, dialogueIndex: 4})
        return
    }
}

shout('nextStep')