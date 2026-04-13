const { useState, useEffect, useCallback, useRef } = os.appHooks;

const CreditDisplay = thisBot.CreditDisplay();

const App = () => {
    const [userCredits, setUserCredits] = useState();
    const [userCreditsIcon, setUserCreditsIcon] = useState();
    const userCreditDisplayRef = useRef(null);

    const [studioCredits, setStudioCredits] = useState();
    const [studioCreditsIcon, setStudioCreditsIcon] = useState();
    const [studioCreditsBackgroundColor, setStudioCreditsBackgroundColor] = useState();
    const [studioName, setStudioName] = useState();
    const studioCreditDisplayRef = useRef(null);

    // on mount
    useEffect(async () => {
        const spawnCoins = async (listenerThat) => {
            const { targetX, targetY, targetBot, count } = listenerThat;

            const startX = gridPortalBot.tags.pixelWidth - 100;
            const startY = 50;

            if (userCreditDisplayRef.current && count) {
                let computedTargetX;
                let computedTargetY;

                if (targetBot) {
                    // compute target position using given bot.
                    let portal;
                    let dimension;

                    if (configBot.tags.mapPortal && targetBot.tags[configBot.tags.mapPortal] === true) {
                        portal = 'map';
                        dimension = configBot.tags.mapPortal;
                    } else if (configBot.tags.gridPortal && targetBot.tags[configBot.tags.gridPortal] === true) {
                        portal = 'grid';
                        dimension = configBot.tags.gridPortal;
                    }

                    if (portal) {
                        const botPosition = getBotPosition(targetBot, dimension);
                        const botScreenCoords = await os.calculateScreenCoordinatesFromPosition(portal, botPosition);

                        computedTargetX = botScreenCoords.x;
                        computedTargetY = botScreenCoords.y;
                    }
                }

                userCreditDisplayRef.current.spawnCoins(
                    Math.min(count, 10),
                    startX,
                    startY,
                    computedTargetX ?? targetX,
                    computedTargetY ?? targetY
                );
            }
        }

        os.addBotListener(thisBot, 'spawnCoins', spawnCoins);
        os.addBotListener(abXPE, 'onABXPEAvailableCreditsChanged', onCreditsChanged);

        if (tags.userCreditIcon) {
            setUserCreditsIcon(ab.abBuildCasualCatalogURL(tags.userCreditIcon));
        }

        return () => {
            os.removeBotListener(thisBot, 'spawnCoins', spawnCoins);
            os.removeBotListener(abXPE, 'onABXPEAvailableCreditsChanged', onCreditsChanged);
        };
    }, []);

    const onCreditsChanged = useCallback(async () => {
        const data = abXPE.tags.availableCredits ?? {};

        // Guards against playing the purchase sound more than once per refresh,
        // even if both user and studio credits decreased simultaneously.
        let purchaseSoundPlayed = false;
        const playPurchaseSoundOnce = () => {
            if (!purchaseSoundPlayed && ab.links.utils.in3dPortal()) {
                purchaseSoundPlayed = true;
                ab.links.sound.abPlaySound({ value: 'ab/audio/purchase.mp3' });
            }
        };

        if (data.userCreditsPrev !== null && 
            data.userCredits < data.userCreditsPrev &&
            (data.userCreditsPrev - data.userCredit) >= tags.purchaseSoundMinSpend
        ) {
            playPurchaseSoundOnce();
        }
        
        if (data.studioCreditsPrev !== null &&
            data.studioCredits !== null && 
            data.studioCredits < data.studioCreditsPrev &&
            (data.studioCreditsPrev - data.studioCredits) >= tags.purchaseSoundMinSpend
        ) {
            playPurchaseSoundOnce();
        }

        setUserCredits(data.userCredits);
        setStudioCredits(data.studioCredits ?? null);

        const studioConfig = abXPE.masks.studioConfig;
        if (studioConfig) {
            setStudioName(studioConfig.displayName);
            setStudioCreditsIcon(studioConfig.creditIconUrl ?? null);
            setStudioCreditsBackgroundColor(studioConfig.creditBackgroundColor ?? null);
        }
    }, []);

    const onUserCreditDisplayClick = useCallback(async () => {
        const endpoint = await os.getRecordsEndpoint();
        os.openURL(endpoint);
    }, []);

    const onStudioCreditDisplayClick = useCallback(async () => {
        const endpoint = await os.getRecordsEndpoint();
        const url = new URL(`/studios/${abXPE.tags.availableCredits?.studioId}/${studioName}`, endpoint);
        os.openURL(url.toString());
    }, [studioName])

    return (
        <>
            <style>{tags['style.css']}</style>
            <div className='ab-xpe-gui'>
                <div className='top-right'>
                    {studioCredits != null &&
                        <CreditDisplay
                            name={`${studioName} Credits`}
                            icon={studioCreditsIcon}
                            backgroundColor={studioCreditsBackgroundColor}
                            amount={studioCredits}
                            animate={true}
                            onClick={onStudioCreditDisplayClick}
                            ref={studioCreditDisplayRef}
                        />
                    }
                    {userCredits != null &&
                        <CreditDisplay
                            name='Your Credits'
                            icon={userCreditsIcon}
                            backgroundColor={null}
                            amount={userCredits}
                            animate={true}
                            onClick={onUserCreditDisplayClick}
                            ref={userCreditDisplayRef}
                        />
                    }
                </div>
            </div>
        </>
    )
}

return App;
