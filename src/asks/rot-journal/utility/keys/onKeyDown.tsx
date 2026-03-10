if (tags.readKeys == true && configBot.tags.menuPortal == null){
    if (configBot.tags.mapPortal == "map" || configBot.tags.gridPortal == "home"){
        // os.toast(that.keys);
        if (that.keys.includes("~")) os.downloadInst(); //Temporary way to download while ab1 bot is broken
        //Cheat to change journal unlocks

        /*
        //Full unlocks
        if (that.keys.includes("1")) shout("changeItemState", ["collection1", 0]);
        if (that.keys.includes("2")) shout("changeItemState", ["collection1", 1]);
        if (that.keys.includes("3")) shout("changeItemState", ["collection1", 2]);
        if (that.keys.includes("4")) shout("changeItemState", ["collection1", 3]);
        if (that.keys.includes("5")) shout("changeItemState", ["collection1", 4]);
        if (that.keys.includes("6")) shout("changeItemState", ["collection1", 5]);
        if (that.keys.includes("7")) shout("changeItemState", ["collection1", 6]);
        if (that.keys.includes("8")) shout("changeItemState", ["collection1", 7]);
        if (that.keys.includes("9")) shout("changeItemState", ["collection1", 8]);

        //Temp unlocks (for when GPS is off)
        if (that.keys.includes("!") || that.keys.includes("End")) shout("changeItemTempState", ["collection1", 0]);
        if (that.keys.includes("@") || that.keys.includes("ArrowDown")) shout("changeItemTempState", ["collection1", 1]);
        if (that.keys.includes("#") || that.keys.includes("PageDown")) shout("changeItemTempState", ["collection1", 2]);
        if (that.keys.includes("$") || that.keys.includes("ArrowLeft")) shout("changeItemTempState", ["collection1", 3]);
        if (that.keys.includes("%") || that.keys.includes("Clear")) shout("changeItemTempState", ["collection1", 4]);
        if (that.keys.includes("^") || that.keys.includes("ArrowRight")) shout("changeItemTempState", ["collection1", 5]);
        if (that.keys.includes("&") || that.keys.includes("Home")) shout("changeItemTempState", ["collection1", 6]);
        if (that.keys.includes("*") || that.keys.includes("ArrowUp")) shout("changeItemTempState", ["collection1", 7]);
        if (that.keys.includes("(") || that.keys.includes("PageUp")) shout("changeItemTempState", ["collection1", 8]);
        */

        //Full unlocks
        if (that.keys.includes("1")) shout("changeItemState", 1);
        if (that.keys.includes("2")) shout("changeItemState", 2);
        if (that.keys.includes("3")) shout("changeItemState", 3);
        if (that.keys.includes("4")) shout("changeItemState", 4);
        if (that.keys.includes("5")) shout("changeItemState", 5);
        if (that.keys.includes("6")) shout("changeItemState", 6);
        if (that.keys.includes("7")) shout("changeItemState", 7);
        if (that.keys.includes("8")) shout("changeItemState", 8);
        if (that.keys.includes("9")) shout("changeItemState", 9);
        if (that.keys.includes("0")) shout("changeItemState", 11);
        if (that.keys.includes("-") || that.keys.includes(".")) shout("changeItemState", 12);

        //Temp unlocks (for when GPS is off)
        if (that.keys.includes("!") || that.keys.includes("End")) shout("changeItemTempState", 1);
        if (that.keys.includes("@") || that.keys.includes("ArrowDown")) shout("changeItemTempState", 2);
        if (that.keys.includes("#") || that.keys.includes("PageDown")) shout("changeItemTempState", 3);
        if (that.keys.includes("$") || that.keys.includes("ArrowLeft")) shout("changeItemTempState", 4);
        if (that.keys.includes("%") || that.keys.includes("Clear")) shout("changeItemTempState", 5);
        if (that.keys.includes("^") || that.keys.includes("ArrowRight")) shout("changeItemTempState", 6);
        if (that.keys.includes("&") || that.keys.includes("Home")) shout("changeItemTempState", 7);
        if (that.keys.includes("*") || that.keys.includes("ArrowUp")) shout("changeItemTempState", 8);
        if (that.keys.includes("(") || that.keys.includes("PageUp")) shout("changeItemTempState", 9);
        if (that.keys.includes(")") || that.keys.includes("Insert")) shout("changeItemTempState", 11);
        if (that.keys.includes("_") || that.keys.includes("Delete")) shout("changeItemTempState", 12);


        //Test Landmark UI with Video and Interactive
        if (that.keys.includes("l")){
            shout("openLandmarkUI", ["First Landmark", 10, -25, "Landmark 1 Desc", null, "https://www.videoask.com/fw97d37ry", "https://www.videoask.com/fw97d37ry"]);
        }
        //Test Landmark UI with Image
        if (that.keys.includes("k")){
            shout("openLandmarkUI", ["Second Landmark", -22.045, 80.953, "Landmark 2 Desc", "https://www.grpmcollections.org/media/collectiveaccess/images/5/1/9/7352_ca_object_representations_media_51933_large.jpg", null, null]);
        }
        if (that.keys.includes("n")){
            os.toast("Silent Mode ON")
            configBot.tags.abSilentMode = true;
        }
        if (that.keys.includes("m")){
            configBot.tags.abSilentMode = false;
            os.toast("Silent Mode OFF")
        }
    }
}