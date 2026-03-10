shout("resetBoardCopies");

// await os.sleep(50);

shout("onBoardStateChange", "edit");
shout("onBoardStateChange", "play");

await os.sleep(50);

shout("setCurrentPlayer", configBot.id);