const { data } = that;

delete data.tags.placeLabel;
delete data.tags.placeLabelColor;
delete data.tags.placeLabelFloatingBackgroundColor;
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