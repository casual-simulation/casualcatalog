const { useState, useEffect } = os.appHooks;

// Viewer-specific functions
const getAttributes = thisBot.getAttributes()
const parseHtmlString = thisBot.parseHtmlString()


const RenderHtml = ({ content }) => {
    const splitTag = content.tag.split(' ')
    const tagObject = {tag: splitTag[0]}
    let attributes = getAttributes(content.tag)

    return (
        <tagObject.tag {...attributes}>
            {Array.isArray(content.children)
            ? content.children.map(child => {
                return typeof child == 'string' ? child: <RenderHtml content={child} />
            })
            : <></>}
        </tagObject.tag>
    )
}

const HelpViewer = ({ step, helpArray }) => {
    let parsedHelpString = {tag: 'p', children: ['Sorry, there is no help for this step.']}
    parsedHelpString = parseHtmlString(helpArray[step - 1])

    return (
        <div id="help-content">
            <RenderHtml content={parsedHelpString} />
        </div>
    )
}

return HelpViewer