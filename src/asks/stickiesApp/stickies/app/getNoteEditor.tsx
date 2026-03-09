const { useState, useEffect, useCallback } = os.appHooks;
const NOTE_COLORS = [
    {color: "#D46582", labelColor: "#000000"}, // red
    {color: "#E99E5B", labelColor: "#000000"}, // orange
    {color: "#ECD163", labelColor: "#000000"}, // yellow
    {color: "#6DD35E", labelColor: "#000000"}, // green
    {color: "#55C9A6", labelColor: "#000000"}, // turquoise
    {color: "#77DFEA", labelColor: "#000000"}, // cyan
    {color: "#8C97F4", labelColor: "#000000"}, // lavender
    {color: "#B181C1", labelColor: "#000000"}, // purple
    {color: "#D899C0", labelColor: "#000000"}, // pink
    {color: '#030303', labelColor: "#ffffff"}, // black
]

const RecordPicker = ({ stickyRecord, botId }) => {

    return;
    const [input, setInput] = useState(stickyRecord);
    const [address, setAddress] = useState(undefined);
    const [editing, setEditing] = useState(false);

    const handleCheck = () => {
        os.showConfirm({
            title: 'Pull stickies?',
            content: 'This will get other sticky notes stored in this record.',
            confirmText: 'Pull',
            cancelText: "Don't Pull",
        }).then(choice => {
            if (choice) {
                thisBot.pullStickies({recordName: input})
            }
            if (input !== stickyRecord) {
                thisBot.moveSticky({botId: botId, newRecord: input, newAddress: address}).then((res) => {
                    if (!res.success) {
                        os.toast("Error moving sticky note");
                        setInput(stickyRecord);
                    }
                });
            }
            setEditing(false);
        })
    }

    const handleAddRecord = () => {
        os.requestAuthBot().then(authBot => {
            os.showInput(`stickies-${authBot.id}`,
                {title: 'Record Name'}
            ).then(recordName => {
                if (recordName) {
                    getBot(byID(botId)).tags.stickyRecord = recordName;
                    setInput(recordName);
                    handleCheck();
                }

            })
        })
    }

    if (!input) {
        return (
            <div style={{margin: '8px 0'}}>
                <button
                    className="md-button"
                    onClick={handleAddRecord}
                    style={{
                        color: 'var(--on-background)',
                        background: 'var(--background)',
                        padding: '4px 8px',
                        border: '2px solid var(--on-background)',
                        margin: '0',
                        flexGrow: 1,
                        textTransform: 'none',
                        overflow: "visible",
                        position: "relative"
                    }}
                >
                    Save to Cloud
                </button>
            </div>
        )
    }

    return (
        <div style={{display: 'flex', margin: '8px 0', alignItems: 'center'}}>
            <div
                style={{
                    marginRight: '4px',
                    maxWidth: '196px',
                    overflowX: 'hidden',
                    textOverflow: 'ellipses'
                }}
            >record:</div>

            {!editing && <div
                style={{
                    maxWidth: '196px',
                    overflowX: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                }}
            >{input}</div>}

            {editing && <input
                className="md-input"
                value={input}
                placeholder={`stickies-${authBot.id}`}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => {
                    setInput(e.target.value);
                    if (e.key === "Enter") {
                        handleCheck();
                    }
                }}
                style={{
                    height: '24px',
                    background: 'var(--background)',
                    color: 'var(--on-background)',
                    border: '2px solid var(--on-background)',
                    outline: 'none',
                    padding: '0 4px',
                    flexGrow: 1,
                    borderRadius: '4px',
                    margin: '0 4px 0 0',
                }}
            />}

            {!editing && <button
                className="md-button"
                onClick={() => setEditing(true)}
                style={{
                    color: 'var(--on-background)',
                    background: 'var(--background)',
                    width: '24px',
                    height: '24px',
                    borderRadius: '4px',
                    margin: '0 4px 0 4px',
                    minWidth: '0',
                }}
            >
                <span className="md-icon md-icon-font"
                    style={{
                        transform: 'scale(0.75)'
                    }}
                >edit</span>
            </button>}

            {editing && <>
                <button
                    className="md-button"
                    onClick={handleCheck}
                    style={{
                        color: 'var(--on-background)',
                        background: 'var(--background)',
                        width: '24px',
                        height: '24px',
                        borderRadius: '4px',
                        minWidth: '0',
                        margin: '0',
                    }}
                >
                    <span className="md-icon md-icon-font"
                        style={{transform: 'scale(0.75)'}}
                    >
                        check
                    </span>
                </button>

                <button
                    className="md-button"
                    onClick={() => {
                        setEditing(false);
                    }}
                    style={{
                        color: 'var(--on-background)',
                        background: 'var(--background)',
                        width: '24px',
                        height: '24px',
                        borderRadius: '4px',
                        minWidth: '0',
                        margin: '0',
                    }}
                >
                    <span className="md-icon md-icon-font"
                        onClick={() => {
                            setEditing(false);
                            setInput(stickyRecord);
                        }}
                        style={{transform: 'scale(0.75)'}}
                    >
                        close
                    </span>
                </button>
            </>}

        </div>
    )
}

const ShapePicker = ({ botId }) => {

    return; 

    const handleChange = (x, y) => {
        const stickyBot = getBot(byID(botId))
        stickyBot.tags.scaleX = x;
        stickyBot.tags.scaleY = y;
    }

    return (
        <div className="shape-picker-container">
            {false && <button
                className="shape-btn md-button md-button-small"
                onClick={() => handleChange(0.9, 2.9)}
                style={{
                    color: 'var(--on-background)',
                    background: 'var(--background)',
                    border: '2px solid var(--on-background)',
                    padding: '4px 8px',
                    margin: '0',
                    flexGrow: 1,
                }}
            >
                Tall
            </button>}
            <button
                className="shape-btn md-button"
                onClick={() => handleChange(0.9, 0.9)}
                style={{
                    color: 'var(--on-background)',
                    background: 'var(--background)',
                    padding: '4px 8px',
                    border: '2px solid var(--on-background)',
                    margin: '0',
                    flexGrow: 1,
                }}
            >
                Square
            </button>
            <button
                className="shape-btn md-button"
                onClick={() => handleChange(2.9, 0.9)}
                style={{
                    color: 'var(--on-background)',
                    background: 'var(--background)',
                    padding: '4px 8px',
                    border: '2px solid var(--on-background)',
                    margin: '0',
                    flexGrow: 1,
                }}
            >
                Wide
            </button>
        </div>
    )
}

const ColorPicker = ( { onChange } ) => {
    const handleUpdateColor = (color, labelColor) => {
        onChange(color, labelColor);
    }

    return (
        <div className="color-picker-container">
            {NOTE_COLORS.map(c => {
                return (
                    <button
                        className="sticky-color-btn"
                        onClick={() => handleUpdateColor(c.color, c.labelColor)}
                        style={{ backgroundColor: c.color }}
                    />
                )
            })}
        </div>
    )
}

const ArrowColorPicker = ( { onChange } ) => {
    const handleUpdateArrowColor = (color) => {
        onChange(color);
    }

    return (
        <div className="arrow-color-picker-container">
            {NOTE_COLORS.map(c => {
                return (
                    <button
                        className="sticky-arrow-color-btn"
                        onClick={() => handleUpdateArrowColor(c.color)}
                        style={{ color: c.color }}
                    >
                    {"-"}
                    </button>
                )
            })}
        </div>
    )
}

const ArrowWidthPicker = ({botId, onChange, count} ) => {
    const handleUpdateArrowWidth = (width) => {
        onChange(width);
    }
    
    let width = count;

    // let width = getBot("id", botId).tags.lineWidth;
    if(width == undefined){
        width = 4;
    }

    return (
        <div className="arrow-width-picker-container">
            {"Line Width: " + width}
            <input className="arrow-width-picker" 
                type="range" 
                min="1" 
                max="20" 
                value={width}
                onInput={(event) => {
                    let val = event.currentTarget.value;
                    if(val < 1){
                        val = 1
                    }
                    else if(val > 20){
                        val = 20;
                    }
                    handleUpdateArrowWidth(val);
                }}
            >
            </input>
        </div>
    )
}

const ImportButton = () => {
    const [recordAddressOptions, setRecordAddressOptions] = useState([]);
    const [recordName, setRecordName] = useState();
    const [showRecordOptions, setShowRecordOptions] = useState(false);

    useEffect (() => {
        recordOptions();
    }, []);

    const recordOptions = async () => {
        const container = [];
        const authBot = await os.requestAuthBot();
        const data = await os.listData(`stickies-${authBot.id}`);
        setRecordName(`stickies-${authBot.id}`);
        for (let i = 0; i < data?.items?.length; ++i) {
            container.push(data.items[i].address)
        }
        setRecordAddressOptions(container);
    }

    const addressOptions = useCallback(() => {
        const container = [];
        for (let i = 0; i < recordAddressOptions.length; ++i) {
            container.push(
                <div 
                    style={{
                        borderBottom: '2px solid var(--on-background)',
                        padding: '4px 8px',
                    }}
                    onClick={() => {
                        thisBot.pullStickies({recordName: recordName, address: recordAddressOptions[i]});
                    }}
                > {recordAddressOptions[i]} </div>
            )
        }
        return container;
    }, [recordName])

     return (
            <div style={{margin: '8px 0'}}>
                <button
                    className="md-button"
                    onClick={async () => {
                        await recordOptions();
                        setShowRecordOptions(!showRecordOptions);
                    }}
                    style={{
                        color: 'var(--on-background)',
                        background: 'var(--background)',
                        padding: '4px 8px',
                        border: '2px solid var(--on-background)',
                        margin: '0',
                        flexGrow: 1,
                        textTransform: 'none',
                        overflow: "visible",
                        position: "relative",
                        marginBottom: "10px"
                    }}
                >
                    Import Stickies
                    {showRecordOptions && <div style={{
                            display: "flex",
                            color: 'var(--on-background)',
                            background: 'var(--background)',
                            border: '2px solid var(--on-background)',
                            margin: '0',
                            flexGrow: 1,
                            textTransform: 'none',
                            position: "absolute",
                            zIndex: "5",
                            flexDirection: "column",
                            left: "0",
                            top: "100%",
                            maxHeight: "500%",
                            overflow: "auto"
                        }}>
                        {addressOptions()}
                    </div>}
                </button>
            </div>
        )
}

const SaveButton = ({ stickyRecord, address, botId, setRecordName, setAddress }) => {

    const handleSaveClick = useCallback(async () => {
        const authBot = await os.requestAuthBot();
        const newRecordName = await os.showInput(stickyRecord || `stickies-${authBot.id}`, {title: 'Choose Record (Disregard for personal record)'}).then(async newRecordName => {
            const newAddressName = await os.showInput(address || "", {title: 'Name your sticky'}).then(newAddressName => {
                console.log("tymte");
                if (newRecordName && newRecordName != stickyRecord) {
                    thisBot.moveSticky({botId: botId, newRecord: newRecordName, newAddress: newAddressName || address}).then((res) => {
                        if (!res.success) {
                            os.toast("Error moving sticky note");
                            setRecordName(newRecordName);
                            setAddress(newAddressName);
                        }
                    });
                }
            })
        })
        
    }, [stickyRecord, botId]);

    return (
        <img             
            src="https://brandplayer-prod-filesbucket-458964701190.s3.amazonaws.com/6db28ddc-1835-4fb4-8ed3-5ccf26c02217/20fd9a39529055ee1f00b91aba4a21a485155682d81c7ddaaed8289ee75cf257.png"
            onClick={() => {
                handleSaveClick()
            }} 
        />
    )
}

const App = ( { botId, label, color, labelColor, lineColor, lineWidth } ) => {
    const [content, setContent] = useState(label);
    const [colorState, setColorState] = useState(color);
    const [arrowColorState, setArrowColorState] = useState(lineColor);
    const [arrowWidthState, setArrowWidthState] = useState(lineWidth);
    const [labelColorState, setLabelColorState] = useState(labelColor);

    const [recordName, setRecordName] = useState();
    const [address, setAddress] = useState();

    const handleNoteChange = (e) => {
        setContent(e.target.value);
    }

    const handleUpdateColor = (newColor, newLabelColor) => {
        setColorState(newColor);
        setLabelColorState(newLabelColor);
    }

    const handleUpdateArrowColor = (newColor) => {
        setArrowColorState(newColor);
    }

    const handleUpdateArrowWidth = (width) => {
        setArrowWidthState(width);
    }

    useEffect(() => {
        const stickyBot = getBot(byID(botId));
        stickyBot.tags.color = colorState;
    }, [colorState])

    useEffect(() => {
        const stickyBot = getBot(byID(botId));
        stickyBot.tags.labelColor = labelColorState;
    }, [labelColorState])

    useEffect(() => {
        if(arrowColorState != undefined){
            const stickyBot = getBot(byID(botId));
            stickyBot.tags.lineColor = arrowColorState;

            const arrowBots = getBots(byTag("botID", "stickyArrowNode"), byTag("stickyBotID",botId));
            if(arrowBots){
                for(let i = 0; i < arrowBots.length;i++){
                    arrowBots[i].tags.lineColor = arrowColorState;
                }
            }
        }
    }, [arrowColorState])

    useEffect(() => {
        if(arrowWidthState != undefined){
            const stickyBot = getBot(byID(botId));
            stickyBot.tags.lineWidth = arrowWidthState;

            const arrowBots = getBots(byTag("botID", "stickyArrowNode"), byTag("stickyBotID",botId));
            if(arrowBots){
                for(let i = 0; i < arrowBots.length;i++){
                    arrowBots[i].tags.lineWidth = arrowWidthState;
                }
            }
        }
    }, [arrowWidthState])

    useEffect(() => {
        const stickyBot = getBot(byID(botId));
        stickyBot.tags.stickyRecord = recordName;
    }, [recordName]);

    useEffect(() => {
        const stickyBot = getBot(byID(botId));
        stickyBot.tags.stickyAddress = address;
    }, [address]);

    const handleClose = () => {
        var noteBot = getBot(byID(botId));
        if (noteBot) { noteBot.tags.label = content }

        shout("hideNoteEditor");
    }

    return (<>
        <style>{tags['NoteEditor.css']}</style>
        <div className="note-editor">
            <div className="note-edit-modal">
                <div style={{display: "flex", justifyContent: "space-between"}}>
                    <h2 style={{margin: '0 0 4px 0'}}>Edit {address || "Note"}</h2>
                </div>

                <RecordPicker
                    stickyRecord={getBot(byID(botId)).tags.stickyRecord}
                    botId={botId}
                />

                <ShapePicker botId={botId} />
                
                <textarea
                    className="note-edit-note"
                    onChange={handleNoteChange}
                    onKeyDown={handleNoteChange}
                    onBlur={handleNoteChange}
                    style={{
                        backgroundColor: colorState,
                        color: labelColorState,
                        fontFamily: 'inherit',
                    }}
                >{content}</textarea>

                <ColorPicker botId={botId} onChange={handleUpdateColor} />

                <ArrowWidthPicker botId={botId} onChange={handleUpdateArrowWidth} count={arrowWidthState}/>
                <ArrowColorPicker botId={botId} onChange={handleUpdateArrowColor} />

                <div
                    className="arrow-color-section"
                    style={{
                        backgroundColor: arrowColorState,
                        fontFamily: 'inherit',
                    }}
                ></div>
                
            </div>

            <div className="note-edit-bg" onClick={handleClose}/>
        </div>
    </>)
}

return App
               
//<ImportButton/>
//<SaveButton stickyRecord={recordName} address={address} botId={botId} setRecordName={setRecordName} setAddress={setAddress}/>
