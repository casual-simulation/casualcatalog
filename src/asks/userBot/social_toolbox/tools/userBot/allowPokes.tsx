const notifications = await os.listNotifications(authBot?.id);
if (notifications.success && notifications.items && !notifications.items.includes("pokeNotifications")) {
    await os.recordNotification(authBot?.id, {
        address: 'pokeNotifications',
        description: 'my poke notifications',
        markers: ['publicRead']
    });
}

await os.subscribeToNotification(authBot.id, "pokeNotifications");
tags.pokeNotifsAllowed = true;