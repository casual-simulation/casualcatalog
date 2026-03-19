const data = JSON.parse(that);

if (!data || !data.bot) {
    return;
}

whisper(getBot(byID(data.bot)), "onClick");