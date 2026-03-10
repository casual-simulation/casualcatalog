const { useState } = os.appHooks;
const css = helper.compileCSS([ thisBot ])

if (!tags.dialogue[stepManager.tags.sequence]) {
    var dialogueArray = tags.dialogue
    dialogueArray[stepManager.tags.sequence] = {}
    tags.dialogue = `🧬${JSON.stringify(dialogueArray)}`
}

const SpeechBlock = ({item, index}) => {
    const {name, onClick, focus, text, scaleY, scaleX} = {...item}

    const updateDialogue = (part, value) => {
        // Save relevant data
        var sequence = stepManager.tags.sequence
        var step = stepManager.tags.step 
        var dialogueArray = tags.dialogue

        // Update differently based on what part is being changed
        switch (part) {
            case "focus":
                // I cannot figure out why it's sometimes Yes and sometimes true
                dialogueArray[sequence][step][index][part] = (value === "Yes" || value == "true");
                break;
            case "onClick":
                dialogueArray[sequence][step][index][part] = (
                    value === "Continue"
                    ? `@shout("executeDialogue", {step: ${step}, sequence: '${sequence}', dialogueIndex: ${index + 1}})` 
                    : `@shout("hideSpeechBubble")`
                );
                break;
            case "height":
                dialogueArray[sequence][step][index]['scaleY'] = value;
                break;
            case "width":
                dialogueArray[sequence][step][index]['scaleX'] = value;
                break;
            default:
                dialogueArray[sequence][step][index][part] = value;
        }

        // Update the tag
        thisBot.tags.dialogue = `🧬${JSON.stringify(dialogueArray)}`
    }

    return (
        <div className="speech-block">

            <div className="speech-block-row">
                <span className="speech-block-label">Speaker: </span>
                <input
                    className="speech-block-input"
                    autoComplete="off"
                    id={`speaker-${index}`}
                    value={name}
                    onChange={(e) => updateDialogue('name', e.target.value)}
                />
            </div>

            <div className="speech-block-row">
                <span className="speech-block-label">Text: </span>
                <input
                    className="speech-block-input"
                    autoComplete="off"
                    id={`text-${index}"`}
                    value={text}
                    onChange={(e) => updateDialogue('text', e.target.value)}
                />
            </div>

            <div className="speech-block-row">
                <span className="speech-block-label">Focus: </span>
                <select
                    name="focus"
                    id={`focus-${index}`}
                    onChange={(e) => updateDialogue('focus', e.target.value)}
                >
                    <option value={true} selected={focus}>Yes</option>
                    <option value={false} selected={!focus}>No</option>
                </select>
            </div>

            <div className="speech-block-row">
                <span className="speech-block-label">onClick:</span>
                <select
                    name="onClick"
                    id={`onClick-${index}`}
                    onChange={(e) => updateDialogue('onClick', e.target.value)}
                >
                    <option value="Continue">Continue</option>
                    <option value="End" selected={onClick.includes("hide")}>End</option>
                </select>
            </div>

            <div className="speech-block-row">
                <span className="speech-block-label">Height: </span>
                <input
                    className="speech-block-input"
                    id={`height-${index}"`}
                    type="number"
                    value={scaleY ?? 2}
                    onChange={(e) => updateDialogue('height', e.target.value)}
                />
            </div>

            <div className="speech-block-row">
                <span className="speech-block-label">Width: </span>
                <input
                    className="speech-block-input"
                    id={`width-${index}"`}
                    type="number"
                    value={scaleX ?? 3}
                    onChange={(e) => updateDialogue('width', e.target.value)}
                />
            </div>
        </div>
)}

const App = () => {
    const sequence = stepManager.tags.sequence
    const step = stepManager.tags.step 

    const [speechArray, setSpeechArray] = useState(tags.dialogue[sequence][step])

    const addDialogue = () => {
        var dialogueArray = tags.dialogue

        const defaultObject = {name: '', text: '', focus: true, onClick: "@shout(\"hideSpeechBubble\")"}
        if (Array.isArray(dialogueArray[sequence][step])) {
            dialogueArray[sequence][step].push(defaultObject)
        } else {
            dialogueArray[sequence][step] = [defaultObject]
        }
        tags.dialogue = `🧬${JSON.stringify(dialogueArray)}`
        // Update component state
        const _speechArray = dialogueArray[sequence][step]
        setSpeechArray([..._speechArray])
    }

    const removeLast = () => {
        var dialogueArray = tags.dialogue
        dialogueArray[sequence][step].pop()
        tags.dialogue = `🧬${JSON.stringify(dialogueArray)}`
        // Update component state
        const _speechArray = dialogueArray[sequence][step]
        setSpeechArray([..._speechArray])
    }

    const handleClose = async () => {
            os.unregisterApp("dialogueApp")
    }

    return (
        <>
            <style>{css}</style>
            <div className="dialogue-app-container">

                <h3 className="app-header">Edit Dialogue</h3>
                <div>Sequence: {sequence} | Step: {step}</div>

                <div className="dialogue-list-container">
                    { Array.isArray(speechArray)
                      ? speechArray.map((item, index) => <SpeechBlock item={item} index={index} />)
                      : <></> }
                </div>

                <div className="bottom-buttons">
                    <button onClick={addDialogue}>Add Dialogue</button>
                    <button onClick={removeLast}>Remove Last Dialogue</button>
                    <button onClick={handleClose}>Close</button>
                </div>
            </div>
        </>
    )
}

return App
