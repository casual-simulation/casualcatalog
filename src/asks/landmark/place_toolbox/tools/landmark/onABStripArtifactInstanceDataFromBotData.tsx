const { data } = that;

delete data.tags.label;

delete data.tags[data.tags.dimension + "X"];
delete data.tags[data.tags.dimension + "Y"];
delete data.tags[data.tags.dimension + "Z"];
delete data.tags[data.tags.dimension + "RotationX"];
delete data.tags[data.tags.dimension + "RotationY"];
delete data.tags[data.tags.dimension + "RotationZ"];
delete data.tags[data.tags.dimension];
delete data.tags.dimension;

delete data.tags.landmarkName;
delete data.tags.landmarkLink;
delete data.tags.landmarkLocked;
delete data.tags.landmarkID;
delete data.tags.landmarkImg;
delete data.tags.landmarkDesc;
delete data.tags.discovered;