/**
 * ABCommandsManager is part of abShell.
 * You can register commands to it that can be invoked using '$<command>' with the CasualOS chat bar.
 * Its generally not recommended to create this yourself but instead to listen for the @onABCommandsManagerCreated shout
 * and to register your commands there.
 * @prop {string[]} commands
 */
class ABCommandsManager {
    commands: Record<string, ABCommand>;

    constructor() {
        this.commands = {};

        // Shout that an instance of ABCommandsManager has been created and allow any listeners
        // to add their own commands to the instance.
        shout('onABCommandsManagerCreated', this);
    }

    /**
     * Add a command to ABCommandsManager.
     * This command will be available to invoke using '$<name>' on the CasualOS chat bar.
     * @returns {boolean} Wether or not the command was successfully added.
     */
    addCommand(name: string, callback: ABCommandCallback, help: ABCommandHelp): boolean {
        if (!name || typeof name !== 'string') {
            console.error(`[ABCommandsManager] string name is required for commands.`);
            return false;
        }

        if (this.commands[name]) {
            console.error(`[ABCommandsManager] ${name} is already exists as a command.`);
            return false;
        }

        if (!callback || typeof callback !== 'function') {
            console.error(`[ABCommandsManager] ${name} command requires a callback function.`);
            return false;
        }

        if (!help) {
            console.error(`[ABCommandsManager] ${name} command requires help object.`);
            return false;
        }

        if (!help.shortDescription) {
            console.error(`[ABCommandsManager] ${name} command is missing shortDescription from help object.`);
            return false;
        }

        this.commands[name] = { name, callback, help };
        return true;
    }

    hasCommand(name: string): boolean {
        return this.commands[name] != null;
    }

    /**
     * Remove a command from ABCommandsManager
     * @returns {boolean} Wether or not the specified command was removed. If the command doesn't exist false will also be returned.
     */
    removeCommand(name: string): boolean {
        if (this.commands[name]) {
            delete this.commands[name];
            return true;
        } else {
            return false;
        }
    }

    /**
     * Call the specified command with the provided args (if any).
     * @returns {boolean} Wether or not the command was executed.
     */
    callCommand(name: string, args?: any[]): boolean {
        const command = this.commands[name];
        if (command) {
            if (args) {
                const validArgs = [];

                if (command.help.args) {
                    for (const helpArg of command.help.args) {
                        if (Array.isArray(helpArg.identifier)) {
                            validArgs.push(...helpArg.identifier);
                        } else {
                            validArgs.push(helpArg.identifier);
                        }
                    }
                }

                // Assert that the input args are valid against the command help documentation.
                // This is an easy way to validate args before executing a command.
                ABCommandsManager.assertValidArgs(args, validArgs);
            }
            command.callback(args);
            return true;
        } else {
            console.error(`[ABCommandsManager] ${name} is not a valid command.`);
            return false;
        }
    }

    /**
     * Returns the value of the provided arg. Will remove the arg and value from the args array.
     */
    static parseArgValue(args: any[], arg: string): any {
        let value = null;

        if (args) {
            const argIndex = args.findIndex(a => a === arg);

            if (argIndex >= 0) {
                let deleteCount = 1;
                const valueIndex = argIndex + 1;

                if (valueIndex < args.length) {
                    deleteCount++;
                    value = args[valueIndex];
                }

                // Remove related args & values
                args.splice(argIndex, deleteCount);
            }
        }
        
        return value;
    }

    /**
     * Returns wether the arg flag is provided in the args. Will remove the arg from the args array.
     */
    static parseArgFlag(args: any[], arg: string): boolean {
        if (args) {
            const argIndex = args.findIndex(a => a === arg);

            if (argIndex >= 0) {
                // Remove arg flag.
                args.splice(argIndex, 1);

                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    static assertValidArgs(args: any[], validArgs: any[]): void {
        if (args) {
            const invalidArgs = [];

            for (let arg of args) {
                if (arg && typeof arg === 'string') {
                    if (arg.startsWith('-')) {
                        // This is an arg we want to evaluate.
                        if (!validArgs || !validArgs.includes(arg)) {
                            // This arg is not included in the validArgs, thus the arg is invalid.
                            invalidArgs.push(arg);
                        }
                    } else {
                        // Ignore this arg it is mostly likely a value arg.
                    }
                }
            }

            if (invalidArgs.length > 0) {
                const errorMessage = `Invalid arguments: ${invalidArgs.join(', ')}`;

                os.toast(errorMessage, 4);
                throw new Error(errorMessage);
            }
        }
    }
}

globalThis.ABCommandsManager = ABCommandsManager;