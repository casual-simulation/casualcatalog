if (!tags.todoPlanId) return;

const shardBots: Bot[] = that.shardBots ?? [];
const isPlanSibling = shardBots.some(b => b.tags.abPatchTodoInstance && b.tags.todoPlanId === tags.todoPlanId && b.id !== thisBot.id);

if (isPlanSibling) {
    whisper(thisBot, 'refreshConnections');
}
