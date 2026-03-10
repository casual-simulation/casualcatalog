if (tags.biosSetting == 'free') {
    const now = DateTime.now().toMillis();
    const expiration = (tags.expirationTime - now) / (1000 * 60 * 60);
    const expHr = Math.trunc(expiration);
    const expMin = String(Math.trunc((expiration % 1) * 60)).padStart(2, '0');

    if (expiration > 0 && !tags.tippedRecently) {
        
        os.tip(`temporary (expires in ${expHr}:${expMin})`);
        setTagMask(thisBot, "tippedRecently", true);
        setTimeout(() => {
            setTagMask(thisBot, "tippedRecently", false);
        }, 2000);
    }
    
    if (expiration <= 0 && tags.label != "expired") {
        thisBot.expireInstBot();
    }
}
