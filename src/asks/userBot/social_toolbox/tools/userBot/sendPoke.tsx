await os.sendNotification(tags.userID, 'pokeNotifications', {
    user: authBot?.id,
    name: authBot?.name,
    timestamp: new Date.now()
});