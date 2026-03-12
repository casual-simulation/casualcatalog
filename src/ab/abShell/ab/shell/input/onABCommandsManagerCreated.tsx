let abCommands: ABCommandsManager = that;

// These are all the built-in commands.

abCommands.addCommand('help', (args) => {
    const commands = abCommands.commands;
    const commandKeys = Object.keys(commands);

    let selectedCommand;
    if (commandKeys && commandKeys.length && args && args.length) {
        const commandKeyMatch = commandKeys.find(key => key === args[0]);
        selectedCommand = commandKeyMatch;
    }
    
    links.help.mount({ abCommandsManager: abCommands, selectedCommand });
}, {
    shortDescription: 'Show this help window. Can specify a command to open the help page for that command directly.',
    usage: ['.help', '.help [command]']
});

abCommands.addCommand('.', args => thisBot.cmdABWake(args), {
    shortDescription: 'Wake up ab.',
    usage: '..'
});

abCommands.addCommand('wake', args => thisBot.cmdABWake(args), {
    shortDescription: 'Wake up ab.',
    usage: '.wake'
});

abCommands.addCommand('sleep', args => thisBot.cmdABSleep(args), {
    shortDescription: 'Put ab to sleep.',
    usage: '.sleep'
});

abCommands.addCommand('account', async (args) => {
    const endpoint = await os.getRecordsEndpoint();
    os.openURL(endpoint);
}, {
    shortDescription: 'Open the account/records page in a new tab.',
    usage: '.account'
});

abCommands.addCommand('ask', (args) => {
    if (links.ask) {
        if (args && args.length > 0) {
            const askInput = args.join(' ');
            links.ask.abCoreMenuAction(askInput);
        } else {
            links.utils.abLogAndToast(`.ask command requires input`);
        }
    } else {
        links.utils.abLogAndToast(`ask bot is not loaded, cannot load ask`);
    }
}, {
    shortDescription: 'Ask ab',
    usage: '.ask <ask_name>'
});

abCommands.addCommand('nameab', async (args) => {
    const name = await os.showInput(links.personality.tags.abBuilderIdentity, { title: 'what would you like to call me?' });
    shout('abPersonalityChange', { abBuilderIdentity: name });
}, {
    shortDescription: 'Give ab a new name.',
    usage: '.nameab'
});

abCommands.addCommand('updateab', async (args) => {
    links.learn.updateAB();;
}, {
    shortDescription: 'Update AB core and skills to current code.',
    usage: '.updateab'
});

abCommands.addCommand('system', args => thisBot.cmdSystem(args), {
    shortDescription: 'Open the system portal (IDE) for the inst.',
    longDescription: `Open the system portal (IDE) for the i    

    You may provide a custom systemTagName with the command, in order to open the system portal only for bots with the given systemTagName. By default, "system" will be used as the systemTagName.

    For example:

    > .system
    This will show all bots in the systemPortal that have a "system" tag.

    > .system myGroup
    This will show all bots in the systemPortal that have a "myGroup" tag.
    `,
    usage: [
        '.system',
        '.system systemTagName'
    ],
    args: [
        {
            identifier: '-w',
            description: 'Open the system portal in the current window. By default the system portal will open in a new tab.'
        }
    ]
});

abCommands.addCommand('log', (args) => {
    links.console.toggleConsole();
}, {
    shortDescription: 'Toggle visiblity of the ab log.',
    usage: '.log'
})

abCommands.addCommand('logclear', (args) => {
    const messageLogBots = getBots("consoleLogMessageBot", true);
    destroy(messageLogBots);
}, {
    shortDescription: 'Clear all ab log messages.',
    usage: '.logclear'
})

abCommands.addCommand('sheet', args => thisBot.cmdSheet(args), {
    shortDescription: 'Open the sheet portal for specified bot or an entire dimension.',
    usage: [
        '.sheet [options] [portal | helperBotName | botId | globalThisPath]',
        'ex. .sheet home',
        'ex. .sheet configBot',
        'ex. .sheet -t a2cf4739-39a2-4fd6-b3ef-cc4782f97089',
        'ex. .sheet globalThis.myObject.myBot',
        'ex. .sheet myObject.myBot'
    ],
    args: [
        {
            identifier: '-t',
            description: 'Open the sheet portal in a new browser tab. \n\nNOTE: .sheet will automatically inspect the space of a bot and force opening in the same tab if a bot is in tempLocal or tempShared space.',
        }
    ]
});

abCommands.addCommand('menusheet', (args) => {
    configBot.tags.sheetPortal = configBot.tags.menuPortal;
    if (!configBot.tags.menuPortal) {
        links.utils.abLogAndToast({ message: `Cannot open sheetPortal for menuPortal bots. The menuPortal is currently disabled.`})
    }
}, {
    shortDescription: 'Open the sheet portal for the current menu portal.',
    usage: '.menuSheet',
});

abCommands.addCommand('downloadinst', args => thisBot.cmdDownloadInst(args), {
    shortDescription: 'Download the inst to disk.',
    usage: '.downloadinst'
});

abCommands.addCommand('downloadsystem', args => thisBot.cmdDownloadSystem(args), {
    shortDescription: 'Download the specified bot system(s) to disk.',
    longDescription: `Download the specified bot system(s) to disk.
    
    The provided systemName(s) ill be used to match against bots whose system tag starts with systemName(s). It will respect the dot notation of the system tag, so partial matches will not work. See the examples below for a better understanding.

    For example if systemName is "hello":

    System Tag -> Download?
    - hello -> yes
    - hello.world.main -> yes
    - hello.world.fireworks -> yes
    - rc.redBot -> no
    - helloWorld.bot -> no
    - helium.atom -> no
    - hex.grid.hello -> no
    `,
    usage: [
        '.downloadsystem [...systemName]'
    ]
});

abCommands.addCommand('downloadab', args => thisBot.cmdDownloadAB(args), {
    shortDescription: 'Download specified ab group(s) to disk.',
    longDescription: `Download specified ab group(s) to disk.

    You can provide a list of groups to download along with the command:
    > .downloadab abCore abShell abInterface

    If group(s) are not provided with the comamand then you will be prompted to provide one with a dialog.
    `,
    usage: [
        '.downloadab [options] [group...]',
        'ex. .downloadab abShell abInterface',
        'ex. .downloadab -v 1 myGroupName'
    ],
    args: [
        {
            identifier: '-v',
            description: 'Specify the aux format version number. ex. -v 1 will be aux format version 1 (pure bot json). By default, ab files are usually downloaded as version 2 aux files (conflict-free update).'
        }
    ]
});

abCommands.addCommand('downloadegg', args => thisBot.cmdDownloadEgg(args), {
    shortDescription: 'Download aux file from ab egg.',
    longDescription: `Download aux file from ab egg. You will need to provide the recordKey as well and the name of the egg. A dropdown selection will be provided for the egg if found to select which version to download.`,
    usage: '.downloadegg',
});

abCommands.addCommand('loadskill', async (args) => {
    if (args) {
        for (let skill of args) {
            await links.learn.abAdapt(skill);
        }
    } else {
        links.utils.abLogAndToast('.loadskill requires some skill names');
    }
}, {
    shortDescription: 'Load the specified ab skills.',
    usage: '.loadSkill [skill ...]'
});

abCommands.addCommand('urlqr', () => os.showQRCode(configBot.tags.url), {
    shortDescription: 'Show a QR code for the brower tab\'s current URL.',
    usage: '.urlqr'
});

const DIM_SUPPORTED_PORTALS = ['grid', 'map', 'miniGrid', 'miniMap', 'sheet', 'system', 'menu', 'tag'];

abCommands.addCommand('dim', (args) => {
    if (args && args.length) {
        let portal = ABCommandsManager.parseArgValue(args, '-p');
        let dimension = args.join(' ');

        if (!portal) {
            portal = 'grid';
        }

        if (dimension === "null" || dimension == undefined) {
            dimension = null;
        }

        if (DIM_SUPPORTED_PORTALS.indexOf(portal) >= 0) {
            configBot.tags[`${portal}Portal`] = dimension;

            if (dimension == null) {
                links.utils.abLogAndToast({ message: `Closed ${portal}Portal.` });
            } else {
                links.utils.abLogAndToast({ message: `Set ${portal}Portal to '${dimension}' dimension.` });
            }
        } else {
            links.utils.abLogAndToast({ message: `${portal} is not a supported portal for the dim command.`, logType: 'error' })
        }
    }
}, {
    shortDescription: 'Go to specified portal dimension.',
    longDescription: `Go to specified protal dimension.
    
    If a portal argument is not provided then it will default to the gridPortal.
    
    If a dimension is not provided or is "null" then the portal will be set to null and be closed.`,
    usage: [
        '.dim <dimension>',
        '.dim -p <portal> <dimension>'
    ],
    args: [
        {
            identifier: '-p',
            description: `Specify the portal name. Can be anyone of the following: ${DIM_SUPPORTED_PORTALS.join(', ')}`
        }
    ]

});

abCommands.addCommand('uuid', () => {
    os.setClipboard(uuid());

    let message = `Copied new uuid to clipboard`;
    ab.log(links.personality.tags.abBuilderIdentity + ': ' + message);
    os.toast(message);
}, {
    shortDescription: 'Generate a universally unique identifier (uuid) and copy it to the clipboard.',
    usage: '.uuid'
});

abCommands.addCommand('copy', (args) => {
    const botIds = args && args.length > 0 ? args : undefined;
    if (botIds) {
        const bots: Bot[] = [];
        for (const id of botIds) {
            const bot = getBot('id', id);
            if (bot) {
                bots.push(bot);
            }
        }
        if (bots.length > 0) {
            ab.links.paste.abCopyBotsToClipboard({ bots });
        }
    } else {
        os.toast('Provide the id(s) of the bot(s) you want to copy to the clipboard.');
    }
}, {
    shortDescription: 'Copy a bot(s) to the clipboard.',
    usage: '.copy <botId> <botId2> ...'
});

abCommands.addCommand('dup', (args) => {
    const botId = args ? args[0] : undefined;
    if (botId) {
        const bot = getBot('id', botId);
        if (bot) {
            const dupBot = create(bot);
            os.setClipboard(dupBot.id);
            os.toast('Duplicate bot id copied to clipboard.');
        } else {
            os.toast(`No bot found with id ${botId}`);
        }
    } else {
        os.toast('Provide the id of the bot you want to duplicate');
    }
}, {
    shortDescription: 'Duplicate a specified bot and copy the new bot\'s id to the clipboard.',
    usage: '.dup <botId>'
});

abCommands.addCommand('uploadaux', (args) => {
    os.showUploadAuxFile();
}, {
    shortDescription: 'Upload AUX file(s) to the current inst.',
    usage: '.uploadaux'
})

abCommands.addCommand('uploadfiles', args => thisBot.cmdUploadFiles(args), {
    shortDescription: 'Upload file(s) directly to record.',
    usage: [
        '.uploadfiles',
        '.uploadfiles -record <record_id>'
    ],
    args: [
        {
            identifier: '-record',
            description: 'Optionally publish file(s) to a specific record. If omitted, file(s) will be published to the user\'s personal record.'
        }
    ]
})

abCommands.addCommand('publishask', args => thisBot.cmdPublishAsk(args), {
    shortDescription: 'Publish an ask to the public ab record.',
    longDescription: `Publish an ask to the public ab record.

    An ab ask is a little pointer to a pattern inside of a specific studio. The ask can be used to load the given pattern using a simple name, like a shortcut or an alias.

    The ask itself is stored in the public ab record so that anyone can read the pointer file, but the permissions for the pattern inside the studio are still managed by the original author.

    Any updates to an existing ask will be overwritten.
    `,
    usage: [
        '.publishask -ask <askID> -pattern <patternID> -studio <studioID>',
    ],
    args: [
        {
            identifier: '-ask',
            description: 'The ask to be set.',
        },
        {
            identifier: '-pattern',
            description: 'The pattern set the ask to point at.',
        },
        {
            identifier: '-studio',
            description: 'The studio to set the ask to point at. This is technically optional, if not provided then the studio ID of the currently logged in user will be used.',
        }
    ]
})

abCommands.addCommand('viewrecorddata', async (args) => {
    if (!links.viewRecordDataApp) {
        await links.learn.abAdapt('abViewRecord');
    }

    const isAlias = ABCommandsManager.parseArgFlag(args, '-a')

    let recordName;

    if (args && args.length > 0) {
        recordName = args.join(' ');
    }

    if (isAlias) {
        switch(recordName) {
            case 'player':
                if (authBot) {
                    recordName = authBot.id;
                } else {
                    links.utils.abLogAndToast(`.viewrecorddata must be logged in to view player record.`);
                    return;
                }
                break;
            case 'ab':
                recordName = links.remember.tags.abRecordName;
                break;
            default:
                links.utils.abLogAndToast(`.viewrecorddata command does not recognize alias ${recordName}`);
                return;
        }
    } else {
        if (!recordName && authBot) {
            recordName = authBot.id;
        }
    }
    
    if (recordName) {
        links.viewRecordDataApp.mount({ recordName });
    } else {
        links.utils.abLogAndToast(`.viewrecorddata command requires a recordName`);
    }
}, {
    shortDescription: 'View data stored in provided record name. If record name is not provided then it will default to your personal record.',
    longDescription: `View data stored in provided record name. If record name is not provided then it will default to your personal record.

    There are some aliases that can be used with the alias argument to load a record via alias:
    - player: your personal record
    - ab: ab's public record
    `,
    usage: [
        '.viewrecorddata',
        '.viewrecorddata [recordName]',
        '-viewrecorddata -a ab'  
    ],
    args: [
        {
            identifier: '-a',
            description: 'The provided recordName is actually an alias.'
        }
    ]
})