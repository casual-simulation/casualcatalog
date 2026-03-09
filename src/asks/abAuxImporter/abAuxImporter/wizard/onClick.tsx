shout("abMenuRefresh");
shout('abAuxImporterMenuReset');

thisBot.animateSpin();

configBot.tags.menuPortal = "abAuxImporterMenu";

ab.links.menu.abCreateMenuButton({
    label: 'import .aux from file(s)',
    formAddress: 'upload_file',
    manager: getLink(thisBot),
    abAuxImporterMenu: true,
    abAuxImporterMenuReset: ListenerString(() => {
        destroy(thisBot);
    }),
    onClick: ListenerString(async () => {
        links.manager.onUploadFileClick();
        shout('abAuxImporterMenuReset');
    }),
})