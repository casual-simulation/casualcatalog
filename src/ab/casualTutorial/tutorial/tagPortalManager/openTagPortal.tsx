var { id, tag, size, space } = that 
if (!size) size = 'small'

configBot.tags.tagPortalSpace = space
configBot.tags.tagPortal = `${id}.${tag}`

// Helper Function
const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

// Make button to close the tag portal
tagPortalBot.tags.tagPortalShowButton = true
tagPortalBot.tags.onClick = `@
    configBot.tags.tagPortal = null`
tagPortalBot.tags.tagPortalButtonIcon = "done"

var portalStyle = tags[`${size}PortalStyle`]

// Get size of window
const windowWidth = gridPortalBot.tags.pixelWidth
const windowHeight = gridPortalBot.tags.pixelHeight

// Determine size of tag portal
let tagPortalHeight
let tagPortalWidth
switch (size) {
    case 'large':
    tagPortalHeight = 360
        tagPortalWidth = clamp(windowWidth * 0.4, 500, 1000)
        if (tagPortalWidth > windowWidth * 0.9) tagPortalWidth = windowWidth - 10
        break

    default:
        tagPortalHeight = 210
        tagPortalWidth = clamp(windowWidth * 0.2, 350, 600)
}

// Keep from going off top or bottom
var top = clamp(gridPortalBot.tags.pointerPixelY - tagPortalHeight, 5, windowHeight - tagPortalHeight - 5)
// Keep from going off left or right
var left = clamp(
    gridPortalBot.tags.pointerPixelX - (tagPortalWidth / 2), // Number
    5, // Min
    windowWidth - tagPortalWidth - 5, // Max
)

// Update style object
portalStyle.top  = `${ top }px`
portalStyle.left = `${ left }px`

// Update tag portal style
tagPortalBot.tags.tagPortalStyle = `🧬${JSON.stringify(portalStyle)}`
