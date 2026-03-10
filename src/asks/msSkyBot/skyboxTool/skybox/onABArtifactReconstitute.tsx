const { data } = that;

if (data) {
    if(data.passedEggParameters != null){
        thisBot.onEggHatch({ eggParameters: data.passedEggParameters });
        links.toggle.onEggHatch({ eggParameters: data.passedEggParameters });
    }

    if (links.toggle.tags.formAddress !== data.skyboxImage) {
        setTagMask(links.toggle, 'formAddress', data.skyboxImage, 'shared');
    }
    if (thisBot.tags.formAddress !== data.skyboxImage) {
        setTagMask(thisBot, 'formAddress', data.skyboxImage, 'shared');
    }
}