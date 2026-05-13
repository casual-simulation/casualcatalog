const { useState, useMemo } = os.appHooks

const Message = ({ timestamp, message, name, avatar = 'account_circle', showName = true }) => {
    const [showTime, setShowTime] = useState(false);

    const timeText = useMemo(
        () => {
            if (!timestamp) { return }
            const date = new Date(timestamp);
            const isToday = new Date().toDateString() === date.toDateString();
            return date.toLocaleString(
                undefined,
                isToday
                    ? { timeStyle: 'medium' }
                    : { dateStyle: 'short', timeStyle: 'medium' }
            );
        },
        [timestamp]
    );

    const avatarElement = useMemo(() => {
        if (avatar.startsWith('http://') || avatar.startsWith('https://')) {
            return <img className="ab-console-message-avatar" src={avatar} />;
        }
        if (avatar.includes('/') || avatar.includes('.')) {
            return <img className="ab-console-message-avatar" src={ab.abBuildCasualCatalogURL(avatar)} />;
        }
        return <span className="ab-console-message-avatar md-icon md-icon-font">{avatar}</span>;
    }, [avatar]);

    if (!timestamp || !message) { return <></> }

    return (
        <div
            className={`ab-console-message-container${showName ? ' first' : ''}`}
            onPointerEnter={() => setShowTime(true)}
            onPointerLeave={() => setShowTime(false)}
        >
            <div className="ab-console-message-avatar-slot">
                {showName && avatarElement}
            </div>
            <div className="ab-console-message-body">
                {showName && <div className="ab-console-message-name">{name}</div>}
                <div className="ab-console-message">
                    <div className="ab-console-content">{message}</div>
                    <div className={`ab-console-spacer${showTime ? ' visible' : ''}`}>
                        {timeText}
                    </div>
                </div>
            </div>
        </div>
    )
}

return Message;
