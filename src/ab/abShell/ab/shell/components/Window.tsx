const Window = ({
    id,
    disableShadow,
    children,
}) => {

    let windowClassName = 'ab-app-window';

    if (disableShadow) {
        windowClassName += ' no-shadow';
    }

    return (
        <div id={id} className={windowClassName}>
            {children}
        </div>
    )
}

return Window;