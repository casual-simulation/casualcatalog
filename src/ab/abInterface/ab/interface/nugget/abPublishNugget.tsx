//shout("abPublishNugget", {nug: "nugName", data: data});  ADD EGG ID EVENTUALLY
let testNugget = that.data;
let formattedNugget = {id: that.nug, nugget: testNugget};
let testNuggetName = that.nug;
let formattedNuggetAB = "nug_"+testNuggetName;

masks.nuggetToPublish = formattedNuggetAB;

links.store.abPublishAB({ab: formattedNuggetAB, target: formattedNugget, sourceEvent: 'publish_nugget'});