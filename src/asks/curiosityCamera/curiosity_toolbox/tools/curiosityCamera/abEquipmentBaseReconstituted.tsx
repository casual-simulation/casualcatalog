const avatarBot = getBot(byTag("mapAvatar", true), byTag("ownerID", authBot?.id));
if (avatarBot) {
    tags.abEquipmentFor = getID(avatarBot);
}