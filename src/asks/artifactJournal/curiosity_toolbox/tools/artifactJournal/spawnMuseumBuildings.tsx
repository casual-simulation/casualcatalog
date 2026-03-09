//carc
if (!getBot("system", "ab.location.carc")){
    let carcBot = {};
    carcBot.home = true;
    carcBot.homeX = "-85.66334364993787";
    carcBot.homeY = "42.96178338030629";
    carcBot.homeZ = -45;
    carcBot.scale = 12;
    carcBot.rotBot = true;
    carcBot.museumBot = true;
    carcBot.form = "mesh";
    carcBot.formSubtype = "gltf";
    carcBot.formAddress = "https://publicos-link-filesbucket-404655125928.s3.amazonaws.com/ab-1/d26949a626917c66ff840dafa347d83137a4b6f4a4bda3b16c1e0bb3cffa3454.xml";
    carcBot.system = "ab.location.carcGLB";
    carcBot.remember = getLink(thisBot);
    carcBot.draggable = false;
    carcBot.cursor = 'pointer';
    // carcBot.onClick = `@links.remember.showCarcMenu();`;
    carcBot.placeLabel = "Community Archives and Research Center";
    carcBot.homePlace = true;

    await create(carcBot);
};

//museum
let museumBot = getBot("system", "ab.location.grpm");
if (!museumBot)
{
    museumBot = {};
    museumBot.home = true;
    museumBot.homeX = "-85.67653839738344";
    museumBot.homeY = "42.965655895118815";
    museumBot.homeZ = -45;
    museumBot.scale = 12;
    museumBot.rotBot = true;
    museumBot.museumBot = true;
    museumBot.form = "mesh";
    museumBot.formSubtype = "gltf";
    museumBot.formAddress = "https://publicos-link-filesbucket-404655125928.s3.amazonaws.com/ab-1/e044d294770aa5ab09128b7a659b5a207c5afcfab7d409e3bbcd7730327db4fd.xml";
    museumBot.system = "ab.location.museumGLB";
    museumBot.remember = getLink(thisBot);
    museumBot.draggable = false;
    museumBot.cursor = 'pointer';
    // museumBot.onClick = `@  
    //     links.remember.showMuseumMenu();`;
    museumBot.placeLabel = "Grand Rapids Public Museum";
    museumBot.homePlace = true;

    await create(museumBot);
}

