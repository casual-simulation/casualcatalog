const { propertyValues } = that;

if ('studio' in propertyValues) {
    tags.studioSetting = propertyValues.studio;
}

if ('bios' in propertyValues) {
    tags.biosSetting = propertyValues.bios.value;
}

if ('label' in propertyValues) {
    tags.labelSetting = propertyValues.label;
    tags.label = propertyValues.label;
}

if ('pattern' in propertyValues) {
    tags.patternSetting = propertyValues.pattern;
}

if ('version' in propertyValues) {
    tags.versionSetting = propertyValues.version;
}

if ('inst' in propertyValues) {
    tags.instSetting = propertyValues.inst;
}

if ('channel' in propertyValues) {
    tags.channelSetting = propertyValues.channel;
}

if ('comId' in propertyValues) {
    tags.comIdSetting = propertyValues.comId;
}

if ('urlVariables' in propertyValues) {
    tags.urlVariables = propertyValues.urlVariables;
}

if ('abAwake' in propertyValues) {
    tags.abAwakeSetting = propertyValues.abAwake;
}

thisBot.createURL();