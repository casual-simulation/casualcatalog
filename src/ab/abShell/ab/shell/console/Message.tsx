const { useState, useMemo, useEffect } = os.appHooks
const TopBar = thisBot.TopBar()

const Message = ({ timestamp, message, name }) => {
    const [showTime, setShowTime] = useState(false);
    const [userMessage, setUserMessage] = useState(false);

    useEffect(() => {
        if (authBot && authBot.tags.name) {
            if (authBot.tags.name == name) {
                setUserMessage(true);
                return;
            }
        } else {
            if (masks.preferredName) {
                if (masks.preferredName == name) {
                    setUserMessage(true);
                    return;
                } 
            }
        }

        if (name == "user" || name == "User") {
            setUserMessage(true);
        } else {
            setUserMessage(false);
        }

    }, [name])

    const timeText = useMemo(
        () => {
            if (!timestamp) { return }
            return new Date(timestamp).toLocaleString(
                   'en-us', {timeStyle: 'medium'})},
        [timestamp]
    );

    if (!timestamp || !message) { return <></> }

    return (
        <div
            className="ab-console-message-container"
            onPointerEnter={() => setShowTime(true)}
            onPointerLeave={() => setShowTime(false)}
        >
            <div
                style={userMessage && {textAlign: 'right'}}
            >
                {name}
            </div>
            <div className="ab-console-message" style={{
                flexDirection: userMessage
                               ? 'row'
                               : 'row-reverse'
            }}>
                <div className="ab-console-spacer"
                    style={{
                        textAlign: userMessage
                                   ? 'right'
                                   : 'left',
                        opacity: showTime ? 0.6 : 0
                    }}
                >
                    {timeText}
                </div>
                <div className="ab-console-content">{message}</div>
            </div>
        </div>
    )
}

return Message;