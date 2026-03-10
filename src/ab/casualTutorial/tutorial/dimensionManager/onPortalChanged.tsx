// Stylize the gridPortal based on the dimension
if (that.portal == 'gridPortal') {
    shout('hideSpeechBubble')
    switch (that.dimension) {
        case 'outerSpace':
            gridPortalBot.tags.portalCameraType = 'perspective'
            gridPortalBot.tags.portalColor = '#1f0c40'
            gridPortalBot.tags.portalGridScale = 0.4
            break
        case 'pink':
            gridPortalBot.tags.portalColor = '#98154b'
            os.sleep(250).then(() => {
                shout('executeDialogue', {sequence: 'portals', step: 3, dialogueIndex: 3})
            })
            break
        case 'ab1':
            gridPortalBot.tags.portalColor = '#212529'
            os.sleep(250).then(() => {
                shout('executeDialogue', {sequence: 'portals', step: 3, dialogueIndex: 5})
            })
            break
        // Reset portal styling
        case 'shuffle':
            os.sleep(250).then(() => {
                shout('executeDialogue', {sequence: 'portals', step: 3, dialogueIndex: 2})
            })
            break
        default:
            os.sleep(100).then(() => shout('ab1Reset'))
            gridPortalBot.tags.portalCameraType = 'orthographic'
            gridPortalBot.tags.portalColor = '#263238'
            gridPortalBot.tags.portalGridScale = 0.2
    }

    if (that.portal == 'gridPortal' && os.getCurrentDimension() !== 'home') {
        if (stepManager.tags.sequence == 'portals' && stepManager.tags.step == 2) return
        thisBot.showGoHome()
    } else {
        thisBot.hideGoHome()
    }
}

if (that.portal == 'mapPortal') {
    if (that.dimension) {
        thisBot.showGoHome()
    }
}