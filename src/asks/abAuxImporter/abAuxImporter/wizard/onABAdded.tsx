if (thisBot.vars.filesToUpload) {
    if (that.sourceEvent === 'file_upload') {
        const entry = thisBot.vars.filesToUpload.find(e => e.name === that.ab);

        if (entry) {
            entry.success = true;
        }
    }
}