if (tags.initialized){return};

masks.initialized = true;

await os.closeCircleWipe({duration: 0.1, color: "#01b0fe"});

mapPortalBot.tags.mapPortalBasemap='topo-vector';

configBot.tags.mapPortal = "home";

let targetLocation = await thisBot.createMuseum();

tags.museumBot = "🔗" + targetLocation.id;

await os.openCircleWipe({duration: 5, color: "#01b0fe"});

thisBot.baseZoom();

thisBot.createCARC();

let abBot = await thisBot.createAB();
let previousBot;
let hoiBotMod = {};

hoiBotMod.manager = getLink(thisBot);
hoiBotMod.onClick = `@ links.manager.hoiBot_onClick(tags.url);`;

for (let i = 0; i < tags.hoiBots.length; i++)
{
    let hoiBot = create(tags.hoiBots[i], hoiBotMod);

    hoiBot.tags.lineTo = previousBot;

    previousBot = hoiBot.id;
}

configBot.tags.menuPortal = "cartonMenu";

const welcomeMessage = `Welcome to your Practice Permit!

My name is ${abRemember.tags.abBuilderIdentity}, and I'm here to help you get started.

Click on me to get a guided tour, or feel free to explore on your own.`;

shout("showConsole");

ab.log(welcomeMessage);

thisBot.onEggMenuCreate();

shout("onChat", {message: ".sleep"});