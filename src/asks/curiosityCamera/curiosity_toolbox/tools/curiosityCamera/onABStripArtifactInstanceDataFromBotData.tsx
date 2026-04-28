const { data } = that;

// [Ryan] These shouldn't be hardcode but i dont understand whats going on with dimensionData.
delete data.tags.dimension;
delete data.tags.home;
delete data.tags.homeX;
delete data.tags.homeY;
delete data.tags.homeZ;
delete data.tags.homeRotationX;
delete data.tags.homeRotationY;
delete data.tags.homeRotationZ;
delete data.tags.discoverableURL;
delete data.tags.discoverableData;
delete data.tags.processingMode;
delete data.tags.confidenceCount;
delete data.tags.confidenceName;