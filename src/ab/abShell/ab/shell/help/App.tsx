const AppContainer = links.components.AppContainer();
const Window = links.components.Window();
const TextLink = links.components.TextLink();
const css = links.utils.abCompileCSS([ thisBot, links.components ]);

const { useState, useEffect, useCallback, useRef, useMemo } = os.appHooks;

/**
 * @param {Object} props
 * @param {Object.<string, Command>} props.commands
 */
const AvailableCommands = ({ commands, onCommandClick }) => {
    const commandNames = Object.keys(commands).sort();

    const onClose = useCallback(() => {
        thisBot.unmount();
    }, []);
    
    return (
        <>
            <p><TextLink onClick={onClose}>{'x Close'}</TextLink></p>
            <h2>Available Commands</h2>
            <p>Usage: .command [options]</p>
            <br/>
            <table className='help-table'>
                {commandNames.map((name) => {
                    const command = commands[name];

                    let description = null;

                    if (command.help) {
                        if (command.help.shortDescription) {
                            description = command.help.shortDescription;
                        }
                    }
                    
                    return (
                        <tr>
                            <td><TextLink onClick={() => onCommandClick(command.name)}>{command.name}</TextLink></td>
                            <td>{description}</td>
                        </tr>
                    )
                })}
            </table>
        </>
    )
}

/**
 * @param {Object} props
 * @param {Command} props.command
 */
const SpecificCommand = ({ command, onBack }) => {
    let usage = '';
    let description = null;
    let args = null;

    if (command.help) {
        if (command.help.usage) {
            if (Array.isArray(command.help.usage)) {
                usage = command.help.usage.join('\n');
            } else {
                usage = command.help.usage;
            }
        }

        if (command.help.longDescription) {
            description = command.help.longDescription;
        } else if (command.help.shortDescription) {
            description = command.help.shortDescription;
        }

        if (command.help.args && command.help.args.length > 0) {
            args = command.help.args;
        }
    }
    
    return (
        <>  
            <p><TextLink onClick={onBack}>{'< Back'}</TextLink></p>
            <h2>{command.name}</h2>
            { usage &&
                <table className='usage-table'>
                    <tr>
                        <td><h3>Usage:</h3></td>
                        <td>{usage}</td>
                    </tr>
                </table>
            }
            { description && 
                <div className='section'>
                    <h3>Description:</h3>
                    <p className='description'>{description}</p>
                </div>
            }
            { args &&
                <div className='section'>
                    <h3>Arguments:</h3>
                    <table className='args-table'>
                        { args.map((arg) => {
                            if (!arg.identifier) {
                                return null;
                            }
                            
                            let argIdentifierDisplay = null;
                            let argDescriptionDisplay = null;

                            if (Array.isArray(arg.identifier)) {
                                argIdentifierDisplay = arg.identifier.join(',\n');
                            } else {
                                argIdentifierDisplay = arg.identifier;
                            }

                            if (arg.description) {
                                argDescriptionDisplay = arg.description;
                            }

                            return (
                                <tr>
                                    <td>{argIdentifierDisplay ?? ''}</td>
                                    <td>{argDescriptionDisplay ?? ''}</td>
                                </tr>
                            )
                        })}
                    </table>
                </div>
            }
            <br/>
            <table className='help-table'>
            </table>
        </>
    )
}

/**
 * @param {Object} props
 * @param {Object.<string, Command>} props.commands
 * @param {any[]} [props.args]
 */
const App = ({ commands, initialSelectedCommand }) => {
    const [ selectedCommand, setSelectedCommand ] = useState(initialSelectedCommand);

    // Escape key press event handler
    useEffect(() => {
        const onEscapeKeyPress = () => {
            if (selectedCommand != null) {
                setSelectedCommand(null);
            } else {
                thisBot.unmount();
            }
        }

        thisBot.vars.onEscapeKeyPress.push(onEscapeKeyPress);

        return () => {
            const callbackIndex = thisBot.vars.onEscapeKeyPress.findIndex((callback) => callback === onEscapeKeyPress);
            if (callbackIndex >= 0) {
                thisBot.vars.onEscapeKeyPress.splice(callbackIndex, 1);
            }
        }
    }, [selectedCommand]);
    
    const onBackgroundClick = useCallback(() => {
        thisBot.unmount();
    }, []);

    const onCommandClick = useCallback((name) => {
        setSelectedCommand(name);
    }, [setSelectedCommand])

    const content = useMemo(() => {
        if (!selectedCommand) {
            return <AvailableCommands commands={commands} onCommandClick={onCommandClick}/>
        } else { 
            return <SpecificCommand command={commands[selectedCommand]} onBack={() => setSelectedCommand(null)}/>
        }
    }, [commands, selectedCommand, setSelectedCommand]);

    return (
        <>
            <style>{css}</style>

            <AppContainer onBackgroundClick={onBackgroundClick}>
                <Window>
                    {content}
                </Window>
            </AppContainer>
        </>
    )
}

return App;