if (!tags.roleOwner) {
    tags.roleOwner = [];
}

if (!tags.roleOwner.includes(getID(configBot))) {
    tags.roleOwner.push(getID(configBot));
}