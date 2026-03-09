const css = compileCSS([ thisBot ])
const { useState, useCallback } = os.appHooks;

const EnterXRButton = ({ mode, onClick }) => {
    if (mode !== 'vr' && mode !== 'ar') {
        console.warn(`[EnterXRButton] Unknown mode ${mode}, defaulting to vr`);
        mode = 'vr';
    }

    return (
        <button className='enter-xr-button' onClick={onClick}>Enter {mode.toUpperCase()}</button>
    )
}

const App = () => {
    const onEnterVRClick = () => {
        os.enableVR();
    }

    const onEnterARClick = () => {
        os.enableAR();
    }

    let supportsAR = os.device().supportsAR;
    let supportsVR = os.device().supportsVR;

    return (
        <>  
            <style>{css}</style>
            <div className='enter-xr-buttons'>
                { supportsAR &&
                    <EnterXRButton mode='ar' onClick={onEnterARClick}/>
                }
                { supportsVR && 
                    <EnterXRButton mode='vr' onClick={onEnterVRClick}/>
                }
            </div>
            
        </>
    )
}

return App;