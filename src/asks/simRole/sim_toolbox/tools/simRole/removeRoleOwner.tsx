if (!tags.roleOwner) {
    tags.roleOwner = [];
}

if (tags.roleOwner.includes(getID(configBot))) {
    tags.roleOwner.splice(tags.roleOwner.indexOf(getID(configBot)), 1);
}