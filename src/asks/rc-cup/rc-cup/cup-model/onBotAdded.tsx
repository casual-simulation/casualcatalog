const cupURL = links.learn.abBuildCasualCatalogURL('/asks/rc-cup-assets/cup.glb');

if (masks.formAddress !== cupURL) {
    setTagMask(thisBot, 'formAddress', cupURL, 'shared');
}