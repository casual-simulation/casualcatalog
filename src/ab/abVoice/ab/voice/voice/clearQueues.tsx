thisBot.masks.audioQueue && thisBot.masks.audioQueue.length > 0 ? thisBot.masks.audioQueue = [] : null;
thisBot.masks.textQueue && thisBot.masks.textQueue.length > 0 ? thisBot.masks.textQueue = [] : null;

os.cancelSound(thisBot.masks.activeSound);

const notifBots = getBots("abVoiceNotificationBot", true);
destroy(notifBots);

thisBot.masks.activeSound = null;