const { useEffect, useState, useCallback } = os.appHooks;

let message = that;

const App = () => {
    const [closing, setClosing] = useState(false);

    const onCloseClick = useCallback(() => {
        setClosing(true);
    }, []);

    useEffect(() => {
        if (closing) {
            const timer = setTimeout(() => {
                thisBot.unmount();
            }, 300); // match exit animation duration
            return () => clearTimeout(timer);
        }
    }, [closing]);

    return (
        <>
            <style>{tags['style.css']}</style>
            <div className='messageContainer' onClick={onCloseClick}>
                <div className={`messageBox ${closing ? 'slideOut' : 'slideIn'}`}>
                    <span>{`${message}`}</span>
                </div>
            </div>
        </>
    );
};

return App;
