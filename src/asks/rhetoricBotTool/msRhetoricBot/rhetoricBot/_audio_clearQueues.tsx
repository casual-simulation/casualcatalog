// used to clear the audio and text queues when a user interupts the hume ai audio chat
thisBot.masks.audioQueue && thisBot.masks.audioQueue.length > 0 ? thisBot.masks.audioQueue.length = 1 : null;
thisBot.masks.textQueue && thisBot.masks.textQueue.length > 0 ? thisBot.masks.textQueue.length = 1 : null;

os.cancelSound(thisBot.masks.activeSound);

thisBot.masks.activeSound = null;