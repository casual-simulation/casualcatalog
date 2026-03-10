globalThis.helper = thisBot

gridPortalBot.tags.portalZoomableMin = 5
gridPortalBot.tags.portalZoomableMax = 40

// Wait for ab1 to show up and reset him
os.sleep(1000).then(() => {
    shout('ab1Reset')
})

await os.registerApp("hideIframe", thisBot);
os.compileApp("hideIframe", <style>{tags["hideIframe.css"]}</style>)
// Would like to do this, but it gets thrown off by os.focusOn()
// gridPortalBot.tags.portalPannableMin = '➡️-5,-5'
// gridPortalBot.tags.portalPannableMax = '➡️5,5'