const { data } = that;

delete data.tags.label;
delete data.tags.labelColor;
delete data.tags.color;
delete data.tags[data.tags.dimension + "X"];
delete data.tags[data.tags.dimension + "Y"];
delete data.tags[data.tags.dimension + "Z"];
delete data.tags[data.tags.dimension + "RotationX"];
delete data.tags[data.tags.dimension + "RotationY"];
delete data.tags[data.tags.dimension + "RotationZ"];
delete data.tags[data.tags.dimension];
delete data.tags.dimension;
delete data.tags.simID;
delete data.tags.actionTriggers;
delete data.tags.lineTo;
delete data.tags.abConfiguratorGroup;