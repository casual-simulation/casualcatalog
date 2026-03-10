// Not supported outside of builder version
if (!builderVersion) {
    thisBot.abChatBarClose();
    return;
}

if (!that.message) {
    thisBot.abChatBarClose();
    return;
}

// Append message to chat history and update the current history index.
thisBot.vars.chatHistory.push(that.message);
thisBot.vars.historyIndex = thisBot.vars.chatHistory.length;

// Function to parse arguments with quote support and error handling
// Examples: 
//   'arg1 arg2' -> ['arg1', 'arg2']
//   '"arg with spaces" arg2' -> ['arg with spaces', 'arg2']
//   '"unclosed quote' -> throws Error
function parseArguments(input) {
    const args = [];
    let currentArg = '';
    let insideQuotes = null;
    let quoteStartPos = -1;
    
    for (let i = 0; i < input.length; i++) {
        const char = input[i];
        
        if (insideQuotes) {
            if (char === insideQuotes) {
                insideQuotes = null;
                quoteStartPos = -1;
            } else if (char === '\\' && i + 1 < input.length) {
                i++; // Skip the backslash
                currentArg += input[i];
            } else {
                currentArg += char;
            }
        } else {
            if (char === '"' || char === "'") {
                insideQuotes = char;
                quoteStartPos = i;
            } else if (char === ' ') {
                if (currentArg.length > 0) {
                    args.push(currentArg);
                    currentArg = '';
                }
            } else {
                currentArg += char;
            }
        }
    }
    
    if (insideQuotes) {
        throw new Error(`Unclosed quote: found opening ${insideQuotes} at position ${quoteStartPos} but no closing quote`);
    }
    
    if (currentArg.length > 0) {
        args.push(currentArg);
    }
    
    return args;
}

if (that.message[0] == ".") {
    const commandPart = that.message.substring(1); // Remove the dot
    const spaceIndex = commandPart.indexOf(' ');

    // Create a fresh CommandsManager with each call so that we always have the latest commands and functionality.
    const abCommands = new ABCommandsManager();
    
    // Get command name.
    let cmd;
    if (spaceIndex === -1) {
        cmd = commandPart;
    } else {
        cmd = commandPart.substring(0, spaceIndex);
    }

    // Get command args.
    if (abCommands && abCommands.hasCommand(cmd)) {
        let args;

        if (spaceIndex !== -1) {
            // Has arguments
            const argsString = commandPart.substring(spaceIndex + 1);

            try {
                const parsedArgs = parseArguments(argsString);
                args = parsedArgs.length ? parsedArgs : undefined;
            } catch (error) {
                links.utils.abLogAndToast({ message: `Error parsing command arguments: ${error.message}`, logType: 'Error' });
                thisBot.abChatBarClose();
                return;
            }
        }

        // Call command.
        abCommands.callCommand(cmd, args);
    } else {
        // Not a command, evaluate message as javascript.
        const js = that.message.substring(1);
        os.run(js);
    }
}

thisBot.abChatBarClose();