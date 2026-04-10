const { useState, useEffect, useCallback, useRef } = os.appHooks;

const CreditDisplay = thisBot.CreditDisplay();
        
const App = () => {
    const [userCredits, setUserCredits] = useState();
    const [userCreditsIcon, setUserCreditsIcon] = useState();
    const userCreditDisplayRef = useRef(null);

    const [studioCredits, setStudioCredits] = useState();
    const [studioCreditsIcon, setStudioCreditsIcon] = useState();
    const [studioName, setStudioName] = useState();
    const studioCreditDisplayRef = useRef(null);

    // on mount
    useEffect(async () => {
        const onABXPEPaidOut = async (listenerThat) => {
            const { payAmount, curCredits } = listenerThat;

            setUserCredits(curCredits);
            ab.links.sound.abPlaySound({ value: 'ab/audio/purchase.mp3' });
        }

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

        os.addBotListener(thisBot, 'onABXPEPaidOut', onABXPEPaidOut);
        os.addBotListener(thisBot, 'spawnCoins', spawnCoins);

        // Grab current user credits.
        abXPE.getAvailableCredits({ userId: authBot.id }).then((curCredits) => {
            setUserCredits(curCredits);
        })
        
        // Load user credit icon.
        if (tags.userCreditIcon) {
            // const iconURL = ab.abBuildCasualCatalogURL(tags.userCreditIcon);
            // setUserCreditsIcon(iconURL);
        }

        // Load studio credits if we are in an inst that is owned by a studio.
        if (configBot.tags.owner &&
            configBot.tags.owner !== 'public' &&
            configBot.tags.owner !== 'player' &&
            configBot.tags.owner !== authBot.id
        ) {
            // Inst owner is likely a studio.
            if (!configBot.tags.user_studios) {
                await ab.abRefreshStudios();
            }
            
            if (configBot.tags.user_studios.success) {
                const userStudios = configBot.tags.user_studios.studios;
                const ownerStudio = userStudios.find(s => s.studioId === configBot.tags.owner);

                if (ownerStudio) {
                    setStudioName(ownerStudio.displayName ?? configBot.tags.owner);

                    // Grab current studio credits.
                    abXPE.getAvailableCredits({ studioId: configBot.tags.owner }).then((curCredits) => {
                        setStudioCredits(curCredits);
                    });

                    // TODO: Load studio credit icon.
                }
            }
        }



        return () => {
            os.removeBotListener(thisBot, 'onABXPEPaidOut', onABXPEPaidOut);
            os.removeBotListener(thisBot, 'spawnCoins', spawnCoins);
        };
    }, []);

    const onUserCreditDisplayClick = useCallback(async () => {
        const endpoint = await os.getRecordsEndpoint();
        os.openURL(endpoint);
    }, []);

    const onStudioCreditDisplayClick = useCallback(async () => {
        console.warn('TODO: open studio in auth portal.');
    }, [])

    return (
        <>
            <style>{tags['style.css']}</style>
            <div className='ab-xpe-gui'>
                <div className='top-right'>
                    {userCredits != null && 
                        <CreditDisplay name='Your Credits' icon={userCreditsIcon} amount={userCredits} animate={true} onClick={onUserCreditDisplayClick} ref={userCreditDisplayRef} />
                    }
                    {studioCredits != null &&
                        <CreditDisplay name={`${studioName} Credits`} icon={studioCreditsIcon} amount={studioCredits} animate={true} onClick={onStudioCreditDisplayClick} ref={studioCreditDisplayRef} />
                    }
                </div>
            </div>
        </>
    )
}

return App;
