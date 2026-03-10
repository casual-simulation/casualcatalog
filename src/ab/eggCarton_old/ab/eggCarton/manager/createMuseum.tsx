let museumBot = getBot("system", "ab.eggCartonTemp.museumGLB");

if (museumBot)
{
    return museumBot;
}

museumBot = {};

museumBot.space = "tempLocal";
museumBot.pointable = false;
museumBot.home = true;
museumBot.homeX = tags.defaultX;
museumBot.homeY = tags.defaultY;
museumBot.homeZ = -45;
museumBot.scale = 12;
museumBot.form = "mesh";
museumBot.formSubtype = "gltf";
museumBot.formAddress = "https://publicos-link-filesbucket-404655125928.s3.amazonaws.com/ab-1/e044d294770aa5ab09128b7a659b5a207c5afcfab7d409e3bbcd7730327db4fd.xml";
museumBot.system = "ab.eggCartonTemp.museumGLB";

const museum = create(museumBot);

return museum;