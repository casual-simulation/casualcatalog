const { payAmount, sourceId } = that;

if (sourceId === thisBot.id) {
    ab.cue({ bot: thisBot, text: `🪙-${payAmount}`, wrapMode: 'none', fontSize: 2, color: '#ef4444' });
    whisper(abXPE.links.gui, 'spawnCoins', { targetBot: thisBot, count: payAmount });
}