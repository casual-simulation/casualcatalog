const aiChatOptions: AIChatOptions = {
    preferredModel: ab.links.personality.tags.abPreferredAIModel
}
const recipes = getBots("storyRecipe", true);
if (that.bot == thisBot && that.to.bot) {
    let foundRecipe = false;
    for (let i = 0; i < recipes.length; ++i) {
        if (tags.storyElementType?.includes(recipes[i].tags.dropped) && that.to.bot?.tags.storyElementType?.includes(recipes[i].tags.droppedOn)) {
            foundRecipe = true;
            newElement(recipes[i].tags.result);
            return;
        }
        if (foundRecipe == false && recipes[i].tags.fuzzy) {
            //ask ai if it should count or not
            configBot.tags.menuPortal = "storyElementLoading";
            let loadingBar1 = ab.links.menu.abCreateMenuBusyIndicator({
                label: "checking fuzzy recipe",
                storyElementLoading: true
            });

            let responseA =  await ai.chat([
                {
                    role: "system",
                    content: tags.categorizationPrompt
                },
                {
                    role: 'assistant',
                    content: [
                        { text: 'hello world'}
                    ]},
                {
                    role: "user",
                    content: "descriptor: " + formDescriptor(thisBot) + " categorization: " + recipes[i].tags.dropped
                }
            ], aiChatOptions)

            if (responseA && responseA.content != 'true') {
                continue;
            }

            let responseB =  await ai.chat([
                {
                    role: "system",
                    content: tags.categorizationPrompt
                },
                {
                    role: 'assistant',
                    content: [
                        { text: 'hello world'}
                    ]},
                {
                    role: "user",
                    content: "descriptor: " + formDescriptor(that.to.bot) + " categorization: " + recipes[i].tags.droppedOn
                }
            ], aiChatOptions)

            if (responseB && responseB.content != 'true') {
                continue;
            }

            destroy(loadingBar1);
            if (responseA.content == 'true' && responseB.content == 'true') {
                foundRecipe = true;
                newElement(recipes[i].tags.result);
                return;
            }
        }
    }

    if (foundRecipe == false) {
        //ask ai what would happen
        configBot.tags.menuPortal = "storyElementLoading";
        let loadingBar2 = ab.links.menu.abCreateMenuBusyIndicator({
            label: "crafting new element",
            storyElementLoading: true
        });

        let response = await ai.chat([
            {
                role: "system",
                content: tags.newElemPrompt
            },
            {
                role: 'assistant',
                content: [
                    { text: 'hello world'}
                ]},
            {
                role: "user",
                content: JSON.stringify(tags.storyElementType) + " + " + JSON.stringify(that.to.bot.tags.storyElementType)
            }
        ], aiChatOptions)

        destroy(loadingBar2);

        if (response) {
            newElement(response.content);
            return;
        }
    }
}

function newElement (prompt: string) {
    const abArtifactShard = {
        data: {
            eggParameters: {
                toolboxBot: null,
                storyParameters: {
                    prompt: prompt
                },
                gridInformation: {
                    dimension: tags.dimension,
                    position: {
                        x: tags[tags.dimension + 'X'],
                        y: tags[tags.dimension + 'Y']
                    }
                }
            }
        },
        dependencies: [
            {
                askID: "storyElement"
            }
        ]
    };
    ab.links.artifact.abCreateArtifactPromiseBot({
        abArtifactName: "storyElement",
        abArtifactInstanceID: uuid(),
        abArtifactShard,
    });

    destroy(that.to.bot);
    destroy(thisBot); 
}

function formDescriptor (bot: Object) {
    const json = {
        name: bot.tags.label,
        description: bot.tags.elementPrompt,
        categorization: bot.tags.storyElementType
    }

    return JSON.stringify(json);
}