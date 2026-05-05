const { data } = that;

delete data.tags.label;
delete data.tags.labelColor;
delete data.tags.labelFloatingBackgroundColor;
delete data.tags.color;

delete data.tags[data.tags.dimension];
delete data.tags[data.tags.dimension + 'X'];
delete data.tags[data.tags.dimension + 'Y'];
delete data.tags[data.tags.dimension + 'Z'];
delete data.tags[data.tags.dimension + 'RotationX'];
delete data.tags[data.tags.dimension + 'RotationY'];
delete data.tags[data.tags.dimension + 'RotationZ'];
delete data.tags.dimension;
delete data.tags.studioId;
delete data.tags.prevBotID;
delete data.tags.respawnPoint;
delete data.tags.toolbox_array;
delete data.tags.formAddress;
delete data.tags.strokeFormAddress;
delete data.tags.strokeColor;
delete data.tags.armMeshPath;
delete data.tags.armColor;
delete data.tags.strokeBot;