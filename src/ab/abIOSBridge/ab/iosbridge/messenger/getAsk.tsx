if (tags.debug) os.log("Ask received from ios app: " + that);
let askBot = getBot("system", "ab.action.ask");
whisper(askBot, "abCoreMenuAction", that);