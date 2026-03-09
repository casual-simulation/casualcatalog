const { useEffect, useState, useMemo, useRef } = os.appHooks
const TopBar = thisBot.TopBar();
const Message = thisBot.Message();

const App = () => {
    const [pointerDownPos, setPointerDownPos] = useState({x: -1, y: -1});
    const [consoleLog, setConsoleLog] = useState([]);
    const [showChat, setShowChat] = useState(tags.showChatInput);
    const [userInput, setUserInput] = useState('');
    const [showAll, setShowAll] = useState(false);
    const inputRef = useRef();

    const updateLog = () => {
        if (!thisBot.vars.messageBotIds) {
            return;
        }
        const bots = thisBot.vars.messageBotIds;
        const messageLogArr = [];

        for (const botID of bots) {
            const messageBot = getBot("id", botID);
            if (messageBot) {
                messageLogArr.push({
                    message: messageBot.tags.message,
                    timestamp: messageBot.tags.timestamp,
                    name: messageBot.tags.name
                })
            }
        }

        messageLogArr.sort( (a, b) => new Date(a.timestamp) < new Date(b.timestamp) ? 1 : -1 );

        setConsoleLog(messageLogArr);
    }

    useEffect(() => {
        thisBot.vars.updateLog = updateLog;
        thisBot.vars.setShowAll = setShowAll;

        updateLog();

        return (() => {
            thisBot.vars.updateLog = null;
            thisBot.vars.setShowAll = null;
        });
    }, []);

    useEffect(() => {
        if (inputRef.current) inputRef.current.focus();
    }, [showChat]);

    const handlePointerDown = (e) => {
        setPointerDownPos({
            x: e.clientX,
            y: e.clientY,
        })
    }

    const handlePointerUp = (e) => {
        const diffX = Math.abs(e.clientX - pointerDownPos.x);
        const diffY = Math.abs(e.clientY - pointerDownPos.y);

        if (diffX < 5 && diffY < 5) {
            setShowAll(s => !s);
        }

        setPointerDownPos({x: -1, y: -1});
    }

    const handleSubmit = () => {
        if (userInput) {
            whisper(getBot('system', 'ab.action.ask'), 'abCoreMenuAction', userInput)
            setUserInput('');
            console.log("inputRef:", inputRef.current);
            if (inputRef.current) inputRef.current.value = '';
        }
    }

    return (<>
        <style>{tags['App.css']}</style>

        <div
            id="ab-console"
            className="ab-console"
            onPointerEnter={(e) => {
                gridPortalBot.masks.portalZoomable = false;
            }}
            onPointerLeave={(e) => {
                if (e.target.id == "ab-console"){
                    gridPortalBot.masks.portalZoomable = true; 
                }
            }}
        >
            {tags.showTopBar && <TopBar />}

            <div
                className="ab-console-log"
                onPointerDown={handlePointerDown}
                onPointerUp={handlePointerUp}
            >
                {/* Message history */ Array.isArray(consoleLog)
                ? showAll
                    ? consoleLog.map((m, i) => {
                        if (!m || !m.timestamp || !m.message) { return }
                        return (
                            <Message
                                timestamp={m.timestamp}
                                message={m.message}
                                name={m.name}
                                key={`message-${i}`}
                            />
                        )})
                    : <Message
                        timestamp={consoleLog[0]?.timestamp}
                        message={consoleLog[0]?.message}
                        name={consoleLog[0]?.name}
                    />
                : <></>}

            </div>

                {showChat &&
                <div
                    className="ab-console-input-container"
                >
                    <input
                        placeholder="ask ab-1"
                        onChange={e => setUserInput(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') handleSubmit() }}
                        ref={inputRef}
                    />
                    <button
                        className="ab-console-btn console-send-btn md-icon md-icon-font"
                        onClick={handleSubmit}
                        style={{
                            height: '40px',
                            width: '48px',
                        }}
                    >send</button>
                </div>}
        </div>
    </>)
}

return App
