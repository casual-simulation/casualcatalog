const files = await os.showUploadFiles();

thisBot.vars.filesToUpload = [];

const auxFiles = files.filter((file) => {
    if (file.name.endsWith('.aux')) {
        const basename = file.name.slice(0, -4);

        thisBot.vars.filesToUpload.push({
            name: basename,
            file: file,
            success: false,
        });

        return true;
    }

    return false;
});

if (thisBot.vars.filesToUpload.length > 0) {
    for (const fileToUpload of thisBot.vars.filesToUpload) {
        try {
            // Go through ab input's onFileUpload so we get all the benefits of moving aux file data through the abCreateBots process.
            await ab.links.input.onFileUpload({ file: fileToUpload.file });
        } catch (e) {
            ab.links.utils.abLog({ message: `Somehing went wrong uploading ${fileToUpload.name}. Error: ${ab.links.utils.getErrorMessage(e)}`, logType: 'error'});
        }
    }
}

await os.sleep(250);

const uploadedFilenames = thisBot.vars.filesToUpload.map((file) => {
    if (file.success) {
        return file.name;
    }
}).filter(n => n != null);

if (uploadedFilenames.length > 0) {
    ab.links.utils.abLogAndToast(`Imported ${uploadedFilenames.length} aux ${uploadedFilenames.length > 1 ? 'files' : 'file'}: ${uploadedFilenames.join(', ')}`);
}

if (tags.destroyAfterUse && uploadedFilenames.length > 0) {
    destroy(thisBot);
}