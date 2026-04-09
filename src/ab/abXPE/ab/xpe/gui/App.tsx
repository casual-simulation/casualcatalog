const { useState, useEffect, useCallback, useRef } = os.appHooks;

const CreditDisplay = thisBot.CreditDisplay();
        
const App = () => {
    const [credits, setCredits] = useState();
    const [icon, setIcon] = useState();
    const creditDisplayRef = useRef(null);

    // on mount
    useEffect(() => {
        const onABXPEPaidOut = async (listenerThat) => {
            const { payAmount, curCredits } = listenerThat;

            setCredits(curCredits);
            ab.links.sound.abPlaySound({ value: 'ab/audio/purchase.mp3' });
        }

        const spawnCoins = async (listenerThat) => {
            const { targetX, targetY, targetBot, count } = listenerThat;

            const startX = gridPortalBot.tags.pixelWidth - 100;
            const startY = 50;

            if (creditDisplayRef.current && count) {
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

                    console.log(`portal: ${portal}, dimension: ${dimension}`);

                    if (portal) {
                        const botPosition = getBotPosition(targetBot, dimension);
                        const botScreenCoords = await os.calculateScreenCoordinatesFromPosition(portal, botPosition);

                        computedTargetX = botScreenCoords.x;
                        computedTargetY = botScreenCoords.y;
                    }
                }

                creditDisplayRef.current.spawnCoins(
                    Math.min(count, 10),
                    startX,
                    startY,
                    computedTargetX ?? targetX,
                    computedTargetY ?? targetY
                );
            }
        }

        const refreshCredits = async (listenerThat) => {
            // TODO: get the current available credits (abXPE.getAvailableCredits()) and then update the display.
        }

        os.addBotListener(thisBot, 'onABXPEPaidOut', onABXPEPaidOut);
        os.addBotListener(thisBot, 'spawnCoins', spawnCoins);
        os.addBotListener(thisBot, 'refreshCredits', refreshCredits);

        // Grab current credits amount.
        abXPE.getAvailableCredits().then((curCredits) => {
            setCredits(curCredits);
        })
        
        // Load icon
        if (tags.creditIcon) {
            const iconURL = ab.abBuildCasualCatalogURL(tags.creditIcon);
            setIcon(iconURL);
        }

        return () => {
            os.removeBotListener(thisBot, 'onABXPEPaidOut', onABXPEPaidOut);
            os.removeBotListener(thisBot, 'spawnCoins', spawnCoins);
            os.removeBotListener(thisBot, 'refreshCredits', refreshCredits);
        };
    }, []);

    const onCreditDisplayClick = useCallback(async () => {
        const endpoint = await os.getRecordsEndpoint();
        os.openURL(endpoint);
    }, []);

    return (
        <>
            <style>{tags['style.css']}</style>
            <div className='ab-xpe-gui'>
                <div className='top-right'>
                    {credits != null && 
                        <CreditDisplay icon={icon} amount={credits} animate={true} onClick={onCreditDisplayClick} ref={creditDisplayRef} />
                    }
                </div>
            </div>
        </>
    )
}

return App;
