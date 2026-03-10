const TextLink = ({
    onClick,
    children,
}) => {
    return (
        <span 
            className='ab-app-text-link bold' 
            onClick={onClick}
            style={{
                // '--ab-app-text-link-color': links.personality.tags.abBaseColor,
                // '--ab-app-text-link-hover-color': links.personality.tags.abBlueprintColor
            }}
        >{children}</span>
    )
}

return TextLink;