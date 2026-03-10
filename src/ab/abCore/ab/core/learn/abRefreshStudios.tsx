if (authBot) {
    const userStudios = await os.listUserStudios();
    configBot.tags.user_studios = userStudios;
} else {
    configBot.tags.user_studios = null;
}