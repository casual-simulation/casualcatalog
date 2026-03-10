if (configBot.tags.staticInst) {
    tags.roleOwner = [];
    return;
}

const remotes = await os.remotes();
if (tags.roleOwner && tags.roleOwner.length != 0) {
    const tempRoleOwner = [...tags.roleOwner];
    for (let i = 0; i < tempRoleOwner.length; ++i) {
        if (!remotes || !remotes.includes(tempRoleOwner[i])) {
            tags.roleOwner.splice(tags.roleOwner.indexOf(tempRoleOwner[i]), 1);
        }
    }
}