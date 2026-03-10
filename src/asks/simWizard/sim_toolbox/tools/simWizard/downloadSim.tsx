const simItems = getBots("simID");

let csvString = `""csv
type,configuration`

for (let i = 0; i < simItems.length; ++i) {
    let newLine;
    //SIM PLACE
    if (simItems[i].tags.simPlace == true) {
        if (simItems[i].tags.label == 'home') {
            continue;
        }
        newLine = `\nSIM_PLACE,"{""prompt"": ""${simItems[i].tags.placePrompt ?? 'none'}"", ""name"": ""${simItems[i].tags.label}"", ""simID"": ""${simItems[i].tags.simID}"", ""location"": {""x"": ${simItems[i].tags[simItems[i].tags.dimension + 'X']}, ""y"": ${simItems[i].tags[simItems[i].tags.dimension + 'Y']}}}"`;
    } 
    //SIM ROLE
    else if (simItems[i].tags.simRole == true) {
        let attString = ``;
        for (const att in simItems[i].tags.simAttributes) {
            attString += `""${att}"": ${simItems[i].tags.simAttributes[att]},`
        }
        attString = attString.slice(0, -1);
        newLine = `\nSIM_ROLE,"{""name"": ""${simItems[i].tags.label}"", ""attributes"": {${attString}}, ""numUsers"": ${simItems[i].tags.numUsers}, ""place"": ""${simItems[i].tags.defaultPlace}"", ""location"": {""x"": ${simItems[i].tags[simItems[i].tags.dimension + 'X']}, ""y"": ${simItems[i].tags[simItems[i].tags.dimension + 'Y']}}}"`;
    }
    //SIM PROP
    else if (simItems[i].tags.simProp == true) {
        let attString = ``;
        for (const att in simItems[i].tags.simAttributesStartingValues) {
            attString += `""${att}"": ${simItems[i].tags.simAttributesStartingValues[att]},`
        }
        attString = attString.slice(0, -1);
        newLine = `\nSIM_PROP,"{""name"": ""${simItems[i].tags.label}"", ""trackedAttribute"": ""${simItems[i].tags.trackedStat}"", ""lowestValue"": ${simItems[i].tags.trackedStatStartingValue}, ""highestValue"": ${simItems[i].tags.trackedStatEndingValue}, ""attributes"": {${attString}}, ""place"": ""${simItems[i].tags.dimension}"", ""simID"": ""${simItems[i].tags.simID}"", ""location"": {""x"": ${simItems[i].tags[simItems[i].tags.dimension + 'X']}, ""y"":  ${simItems[i].tags[simItems[i].tags.dimension + 'Y']}}}"`;
    } 
    //SIM PLAYER
    else if (simItems[i].tags.simPlayer == true) {
        newLine = `\nSIM_PLAYER,"{""location"": {""x"": ${simItems[i].tags[simItems[i].tags.dimension + 'X']}, ""y"": ${simItems[i].tags[simItems[i].tags.dimension + 'Y']}}}"`;
    } 
    //SIM PROP ACTION
    else if (simItems[i].tags.simPropAction == true) {
        let triggers = ``;
        let triggerFilter = ``;
        let hideTriggers = ``;
        let completionTriggers = ``;
        let roles = ``;
        let groups = ``;

        for (let a = 0; a < simItems[i].tags.actionTriggers?.length; ++a) {
            triggers += `""${simItems[i].tags.actionTriggers[a]}"", `;
        }
        triggers = triggers.slice(0, -2);
        
        for (let b = 0; b < simItems[i].tags.actionTriggerFilter?.length; ++b) {
            triggerFilter += `""${simItems[i].tags.actionTriggerFilter[b]}"", `;
        }
        triggerFilter = triggerFilter.slice(0, -2);

        for (let c = 0; c < simItems[i].tags.hideTriggers?.length; ++c) {
            hideTriggers += `""${simItems[i].tags.hideTriggers[c]}"", `;
        }
        hideTriggers = hideTriggers.slice(0, -2);

        for (let d = 0; d < simItems[i].tags.completionTriggers?.length; ++d) {
            completionTriggers += `""${simItems[i].tags.completionTriggers[d]}"", `;
        }
        completionTriggers = completionTriggers.slice(0, -2);

        for (let e = 0; e < simItems[i].tags.roleTags?.length; ++e) {
            roles += `""${simItems[i].tags.roleTags[e]}"", `;
        }
        roles = roles.slice(0, -2);

        for (let f = 0; f < simItems[i].tags.groupTags?.length; ++f) {
            groups += `""${simItems[i].tags.groupTags[f]}"", `;
        }
        groups = groups.slice(0, -2);

        newLine = `\nSIM_PROP_ACTION,"{""label"": ""${simItems[i].tags.label}"", ""simID"": ""${simItems[i].tags.simID}"", ""triggers"": [${triggers}], ""triggerFilter"": [${triggerFilter}], ""hideTriggers"": [${hideTriggers}], ""completionTriggers"": [${completionTriggers}], ""roles"": [${roles}], ""startingAction"": ${simItems[i].tags.startingAction ?? false}, ""groups"": [${groups}], ""location"": {""x"": ${simItems[i].tags[simItems[i].tags.dimension + 'X']}, ""y"":  ${simItems[i].tags[simItems[i].tags.dimension + 'Y']}}}"`;
    } 
    //SIM SMART REACTION
    else if (simItems[i].tags.simSmartReaction == true) {
        let triggers = ``;
        let triggerFilter = ``;

        for (let a = 0; a < simItems[i].tags.actionTriggers?.length; ++a) {
            triggers += `""${simItems[i].tags.actionTriggers[a]}"", `;
        }
        triggers = triggers.slice(0, -2);

        for (let b = 0; b < simItems[i].tags.actionTriggerFilter?.length; ++b) {
            triggerFilter += `""${simItems[i].tags.actionTriggerFilter[b]}"", `;
        }
        triggerFilter = triggerFilter.slice(0, -2);

        newLine = `\nSIM_SMART_REACTION,"{""label"": ""${simItems[i].tags.label}"", ""simID"": ""${simItems[i].tags.simID}"", ""triggers"": [${triggers}], ""triggerFilter"": [${triggerFilter}], ""location"": {""x"": ${simItems[i].tags[simItems[i].tags.dimension + 'X']}, ""y"":  ${simItems[i].tags[simItems[i].tags.dimension + 'Y']}}, ""useQueue"": ${simItems[i].tags.checkQueue}, ""orderMatters"": ${simItems[i].tags.orderMatters}, ""sequentialMatters"": ${simItems[i].tags.sequentialMatters}}"`;
    } 
    //SIM PROP REACTION
    else if (simItems[i].tags.simPropReaction == true) {
        let triggers = ``;
        let roles = ``;

        for (let a = 0; a < simItems[i].tags.actionTriggers?.length; ++a) {
            triggers += `""${simItems[i].tags.actionTriggers[a]}"", `;
        }
        triggers = triggers.slice(0, -2);

        for (let e = 0; e < simItems[i].tags.roleTags?.length; ++e) {
            roles += `""${simItems[i].tags.roleTags[e]}"", `;
        }
        roles = roles.slice(0, -2);

        newLine = `\nSIM_PROP_REACTION,"{""simID"": ""${simItems[i].tags.simID}"", ""reactionType"": ""${simItems[i].tags.propReactionType}"", ""roles"": [${roles}], ""props"": [${triggers}], ""location"": {""x"": ${simItems[i].tags[simItems[i].tags.dimension + 'X']}, ""y"":  ${simItems[i].tags[simItems[i].tags.dimension + 'Y']}}}"`;
    } 
    //SIM REACTION
    else if (simItems[i].tags.simReaction == true) {
        let roles = ``;
        let triggers = ``;
        let triggerFilter = ``;

        for (let a = 0; a < simItems[i].tags.actionTriggers?.length; ++a) {
            triggers += `""${simItems[i].tags.actionTriggers[a]}"", `;
        }
        triggers = triggers.slice(0, -2);

        for (let b = 0; b < simItems[i].tags.actionTriggerFilter?.length; ++b) {
            triggerFilter += `""${simItems[i].tags.actionTriggerFilter[b]}"", `;
        }
        triggerFilter = triggerFilter.slice(0, -2);

        for (let e = 0; e < simItems[i].tags.roleTags?.length; ++e) {
            roles += `""${simItems[i].tags.roleTags[e]}"", `;
        }
        roles = roles.slice(0, -2);

        newLine = `\nSIM_REACTION,"{""label"": ""${simItems[i].tags.label}"", ""affectedAttribute"": ""${simItems[i].tags.reactionAttribute}"", ""effect"": ""${simItems[i].tags.reactionEffect}"", ""value"": ${simItems[i].tags.reactionValue}, ""roles"": [${roles}], ""simID"": ""${simItems[i].tags.simID}"", ""triggers"": [${triggers}], ""triggerFilter"": [${triggerFilter}], ""location"": {""x"": ${simItems[i].tags[simItems[i].tags.dimension + 'X']}, ""y"":  ${simItems[i].tags[simItems[i].tags.dimension + 'Y']}}}"`;
    }
    //SIM ACTION
    else if (simItems[i].tags.simAction == true) {
        let triggers = ``;
        let triggerFilter = ``;
        let roles = ``;
        let groups = ``;

        for (let a = 0; a < simItems[i].tags.actionTriggers?.length; ++a) {
            triggers += `""${simItems[i].tags.actionTriggers[a]}"", `;
        }
        triggers = triggers.slice(0, -2);
        
        for (let b = 0; b < simItems[i].tags.actionTriggerFilter?.length; ++b) {
            triggerFilter += `""${simItems[i].tags.actionTriggerFilter[b]}"", `;
        }
        triggerFilter = triggerFilter.slice(0, -2);

        for (let e = 0; e < simItems[i].tags.roleTags?.length; ++e) {
            roles += `""${simItems[i].tags.roleTags[e]}"", `;
        }
        roles = roles.slice(0, -2);

        for (let f = 0; f < simItems[i].tags.groupTags?.length; ++f) {
            groups += `""${simItems[i].tags.groupTags[f]}"", `;
        }
        groups = groups.slice(0, -2);

        newLine = `\nSIM_ACTION,"{""label"": ""${simItems[i].tags.label}"", ""simID"": ""${simItems[i].tags.simID}"", ""triggers"": [${triggers}], ""triggerFilter"": [${triggerFilter}], ""roles"": [${roles}], ""startingAction"": ${simItems[i].tags.startingAction ?? false}, ""groups"": [${groups}], ""location"": {""x"": ${simItems[i].tags[simItems[i].tags.dimension + 'X']}, ""y"":  ${simItems[i].tags[simItems[i].tags.dimension + 'Y']}}}"`;
    }

    csvString += newLine;

}

csvString += `\n""`;

os.setClipboard(csvString);
os.toast("copied to clipboard");