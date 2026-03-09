thisBot.masks.audioQueue && thisBot.masks.audioQueue.length > 0 ? thisBot.masks.audioQueue.length = 1 : null;
thisBot.masks.textQueue && thisBot.masks.textQueue.length > 0 ? thisBot.masks.textQueue.length = 1 : null;

os.cancelSound(thisBot.masks.activeSound);

const notifBots = getBots("abVoiceNotificationBot", true);
destroy(notifBots);

thisBot.masks.activeSound = null;