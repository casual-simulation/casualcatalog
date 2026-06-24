const { propertyValues } = that;

if ('simID' in propertyValues) {
    tags.simID = propertyValues.simID;
}

if ('reactionType' in propertyValues) {
    tags.propReactionType = propertyValues.reactionType;
}

if ('props' in propertyValues) {
    tags.actionTriggers = propertyValues.props;
}

await os.sleep(0);
thisBot.resetLineTo();