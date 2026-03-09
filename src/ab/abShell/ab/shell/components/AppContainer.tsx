const { useCallback, useState } = os.appHooks;

const AppContainer = ({
    id = uuid(),
    onBackgroundClick,
    children
}) => {
    const [appId, ] = useState(id);

    const onClick = useCallback((e) => {
        if (e.target.id === appId) {
            if (onBackgroundClick) {
                // Clicked on app background.
                onBackgroundClick();
            }
        }
    }, [appId]);

    return (
        <>
            <div id={appId} className='ab-app-bg' onClick={onClick} />
            <div>{children}</div>
        </>
    )
}

return AppContainer;