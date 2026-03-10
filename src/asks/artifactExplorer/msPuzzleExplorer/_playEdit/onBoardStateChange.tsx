if (that == "play") {
    tags.label = "Edit";
    tags.labelOpacity = 0;
    tags.form = "mesh";
    tags.formSubtype = "gltf";
    tags.formAddress = "https://brandplayer-prod-filesbucket-458964701190.s3.amazonaws.com/msPeKitIcon/e0d63fd42d9ae6bfe10fb06d557a157915071d91e0eaafab25dce173f14b3a24.bin";
    tags.color = null;
    tags.home = false;
    tags.homeX = -2;
    tags.homeY = -6.5;
    tags.scaleX = 1;
    tags.scaleY = 1;
    tags.scale = null;
    tags.scaleZ = null;
    tags.homeRotationX = -Math.PI / 2;
    tags.homeRotationZ = -Math.PI / 2;

    thisBot.createFiller();
    tags.currentPlayer = configBot.id;
    thisBot.createEditButtons();
}
else if (that == "edit") {
    tags.label = "Play";
    tags.labelOpacity = 0;
    tags.form = "sprite";
    tags.formSubtype = null;
    tags.formAddress = null;
    tags.color = "black";
    tags.home = true;
    tags.homeX = 3;
    tags.homeY = -6;
    tags.scale = 0.5;
    tags.scaleZ = 0.01;
    tags.homeRotationX = null;
    tags.homeRotationZ = null;

    shout("resetBoardCopies");
    // await os.sleep(100);
    shout("destroyMessage",{ ignoreTime: true, restartOnDestroy: false });
}