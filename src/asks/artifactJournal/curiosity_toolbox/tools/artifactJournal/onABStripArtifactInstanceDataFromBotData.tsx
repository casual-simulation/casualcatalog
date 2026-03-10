const { data } = that;

delete data.tags.journalURL;

// [Ryan] These shouldn't be hardcode but i dont understand whats going on with dimensionData.
delete data.tags.dimension;
delete data.tags.home;
delete data.tags.homeX;
delete data.tags.homeY;
delete data.tags.homeZ;
delete data.tags.homeRotationX;
delete data.tags.homeRotationY;
delete data.tags.homeRotationZ;

delete data.tags.artifactData;
delete data.tags.artifactLocationData;
delete data.tags.collectableAmounts;
delete data.tags.collectableIDs;
delete data.tags.collectionNames;
delete data.tags.collectionsInfo;
delete data.tags.discoverableData;
delete data.tags.landmarkData;
delete data.tags.userData;