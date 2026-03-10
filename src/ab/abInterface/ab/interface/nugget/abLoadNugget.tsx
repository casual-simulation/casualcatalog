let nuggetName = that.nuggetName;
let formattedNuggetAB = "nug_"+nuggetName;
let loadedNugget = await links.search.onLookupABEggs({abID: formattedNuggetAB, abVersion: that.version, returnType: "data"});

loadedNugget = loadedNugget.state[nuggetName].nugget;

return loadedNugget;