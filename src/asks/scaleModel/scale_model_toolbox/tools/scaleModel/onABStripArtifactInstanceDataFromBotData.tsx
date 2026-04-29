const { data } = that;

delete data.tags.label;
delete data.tags.labelColor;
delete data.tags.labelFloatingBackgroundColor;
delete data.tags.color;
delete data.tags[data.tags.dimension + "X"];
delete data.tags[data.tags.dimension + "Y"];
delete data.tags[data.tags.dimension + "Z"];
delete data.tags[data.tags.dimension + "RotationX"];
delete data.tags[data.tags.dimension + "RotationY"];
delete data.tags[data.tags.dimension + "RotationZ"];
delete data.tags[data.tags.dimension];
delete data.tags.dimension;
delete data.tags.statsButton;
delete data.tags.scaleX;
delete data.tags.scaleY;
delete data.tags.scaleZ;
delete data.tags.modelLocked;
delete data.tags.currentValues;
delete data.tags.formAddress;
delete data.tags.form;
delete data.tags.formSubtype;
delete data.tags.modelName;
delete data.tags.abConfiguratorGroup;

const attrs = {...data.tags.modelAttributes};
for (const attr in attrs) {
    delete data.tags[attr];
}

delete data.tags.modelAttributes;

const states = {...data.tags.modelStates};
for (const state in states) {
    delete data.tags[state];
}

delete data.tags.modelStates;

const listeners = {...data.tags.modelListeners};
for (const listener in listeners) {
    delete data.tags[listener];
}

delete data.tags.modelListeners;