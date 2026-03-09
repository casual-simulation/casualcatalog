const shard: ABArtifactShard = {
    data: {
        label: tags.label,
        dimensionData: {
            dimension: ab.links.remember.tags.abActiveDimension,
            [ab.links.remember.tags.abActiveDimension]: tags[ab.links.remember.tags.abActiveDimension],
            [ab.links.remember.tags.abActiveDimension + 'X']: tags[ab.links.remember.tags.abActiveDimension + 'X'],
            [ab.links.remember.tags.abActiveDimension + 'Y']: tags[ab.links.remember.tags.abActiveDimension + 'Y'],
            [ab.links.remember.tags.abActiveDimension + 'Z']: tags[ab.links.remember.tags.abActiveDimension + 'Z'],
            [ab.links.remember.tags.abActiveDimension + 'RotationX']: tags[ab.links.remember.tags.abActiveDimension + 'RotationX'],
            [ab.links.remember.tags.abActiveDimension + 'RotationY']: tags[ab.links.remember.tags.abActiveDimension + 'RotationY'],
            [ab.links.remember.tags.abActiveDimension + 'RotationZ']: tags[ab.links.remember.tags.abActiveDimension + 'RotationZ'],
        },
        color: tags.color,
        labelFloatingBackgroundColor: tags.labelFloatingBackgroundColor,
        labelColor: tags.labelColor,
        simID: tags.simID,
        actionIcon: tags.actionIcon,
        actionStory: tags.actionStory,
        actionTriggers: tags.actionTriggers,
        actionTriggerFilter: tags.actionTriggerFilter,
        startingAction: tags.startingAction,
        roleTags: tags.roleTags,
        groupTags: tags.groupTags
    },
    dependencies: [
        {
            askID: 'simAction'
        }
    ]
}

return shard;