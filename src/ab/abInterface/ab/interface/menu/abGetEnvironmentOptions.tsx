const options = [];

if (!configBot.tags.abStayAwake) {
    options.push({
        label: `hide`,
        abEnvironmentMenuSortOrder: 0,
        formAddress: "visibility_off",
        onClick: ListenerString(() => {
            destroy(links.manifestation.links.abBot);
        }),
    })
}

if (!configBot.tags.abStayAwake) {
    options.push({
        label: "sleep",
        abEnvironmentMenuSortOrder: 100,
        formAddress: "nights_stay",
        onClick: ListenerString(() => {
            links.manifestation.abSetAwake({ awake: false })
        }),
    })
}

if (authBot) {
    options.push({
        label: "account info",
        abEnvironmentMenuSortOrder: 200,
        formAddress: "badge",
        onClick: ListenerString(() => {
            os.showAccountInfo(); 
            shout('abMenuRefresh');
        }),
    })
}

options.push({
    label: "nuggets",
    abEnvironmentMenuSortOrder: 250,
    onCreate: ListenerString(() => {
        tags.nugManager = getLink(getBot('system', 'ab.interface.nugget')); 
        
        if (links.nugManager.tags.listening) { 
            tags.onClick = ListenerString(() => {
                shout('abMenuRefresh'); 
                links.manifestation.abClick();
                setTagMask(links.nugManager, 'listening', null);
            });
            tags.formAddress = `check_box`; 
        } else { 
            tags.onClick = ListenerString(() => {
                shout('abMenuRefresh'); 
                inks.manifestation.abClick();
                setTagMask(links.nugManager, 'listening', true, 'local');
            });
            tags.formAddress = `check_box_outline_blank`;
        }
    }),
})

options.push({
    label: `${links.personality.tags.abBuilderIdentity} personality`,
    abEnvironmentMenuSortOrder: 300,
    menuItemType: 'dropdown',
    dropdownOptions: [
        {
            label: `name: ${links.personality.tags.abBuilderIdentity}`,
            formAddress: "cube",
            onClick: ListenerString(async () => {
                const name = await os.showInput(links.personality.tags.abBuilderIdentity, { title: 'what would you like to call me?' });
                shout('abPersonalityChange', { abBuilderIdentity: name });
                destroy(links.manifestation.links.abBot);
            }),
        },
        {
            label: `ai model: ${links.personality.tags.abPreferredAIModel}`,
            formAddress: "edit_note",
            onClick: ListenerString(async () => {
                const models = configBot.tags.aiChatModels;

                if (models) {
                    const options = [];

                    for (const entry of models) {
                        options.push({ label: entry.name, value: entry.name });
                    }

                    const currentModelIndex = options.findIndex(o => o.value === links.personality.tags.abPreferredAIModel);

                    const selectedOption = await os.showInput(currentModelIndex, {
                        title: 'what ai model would you like me to use?',
                        type: 'list',
                        items: options,
                    });

                    if (selectedOption && selectedOption.value !== links.personality.tags.abPreferredAIModel) {
                        shout('abPersonalityChange', { abPreferredAIModel: selectedOption.value });
                        destroy(links.manifestation.links.abBot);
                    }
                } else {
                    if (authBot) {
                        os.showAlert({
                            title: 'something went wrong',
                            content: 'failed to get list of ai chat models.'
                        })
                    } else {
                        os.showAlert({
                            title: 'sign in required',
                            content: 'you must sign in to use ai.'
                        })
                    }
                }
            }),
        },
        {
            label: `ai always approve: ${links.personality.tags.abAlwaysApprovePatchBots ? 'yes' : 'no'}`,
            formAddress: 'edit_note',
            onClick: ListenerString(async () => {
                shout('abPersonalityChange', { abAlwaysApprovePatchBots: !links.personality.tags.abAlwaysApprovePatchBots });
                shout('abMenuRefresh');
            })
        },
        {
            label: `color: ${links.personality.tags.abBaseColor}`,
            formAddress: "edit_note",
            onClick: ListenerString(async () => {
                const color = await os.showInput(links.personality.tags.abBaseColor, { type: 'color', title: 'what color would you like me to be?' });
                shout('abPersonalityChange', { abBaseColor: color, abBaseStrokeColor: color });
                destroy(links.manifestation.links.abBot);
            }),
        },
        {
            label: `menu color: ${links.personality.tags.abBaseMenuColor}`,
            formAddress: "edit_note",
            onClick: ListenerString(async () => {
                const color = await os.showInput(links.personality.tags.abBaseMenuColor, { type: 'color', title: 'what color would you like my menus to be?' });
                shout('abPersonalityChange', { abBaseMenuColor: color });
                shout('abMenuRefresh');
            }),
        },
        {
            label: `menu text color: ${links.personality.tags.abBaseMenuLabelColor}`,
            formAddress: "edit_note",
            onClick: ListenerString(async () => {
                const color = await os.showInput(links.personality.tags.abBaseMenuLabelColor, { type: 'color', title: 'what color would you like my menu text to be?' });
                shout('abPersonalityChange', { abBaseMenuLabelColor: color, abBaseShadowColor: color });
                shout('abMenuRefresh');
            }),
        },
        {
            label: `bot label color: ${links.personality.tags.abBaseLabelColor}`,
            formAddress: "edit_note",
            onClick: ListenerString(async () => {
                const color = await os.showInput(links.personality.tags.abBaseLabelColor, { type: 'color', title: 'what color would you like my bot text to be?' });
                shout('abPersonalityChange', { abBaseLabelColor: color });
                shout('abMenuRefresh');
            }),
        },
        {
            label: `default portal color: ${links.personality.tags.abBaseGridPortalColor ?? links.remember.tags.abBaseGridPortalColor ?? '#263238'}`,
            formAddress: "edit_note",
            onClick: ListenerString(async () => {
                let portalColor = await os.showInput(links.personality.tags.abBaseGridPortalColor ?? links.remember.tags.abBaseGridPortalColor ?? '#263238', { type: 'color', title: 'what would you like your portal to look like?' });
                if (!portalColor) {
                    portalColor = '#263238';
                }
                shout('abPersonalityChange', { abBaseGridPortalColor: portalColor });
            }),
        },
        {
            label: `default map portal basemap`,
            formAddress: "edit_note",
            onClick: ListenerString(() => {
                shout("showABBasemapOptions");
            }),
        },
        {
            label: "default settings",
            formAddress: "delete_forever",
            color: 'red',
            labelColor: 'black',
            onClick: ListenerString(() => {
                shout('abPersonalityReset');
                destroy(links.manifestation.links.abBot);
            }),
        },
    ]
})

const aiDropdownOptions = [];

if (links.voice) {
    aiDropdownOptions.push({
        label: "voice enabled",
        voice: tags.voice,
        onCreate: ListenerString(() => {
            thisBot.vars.onVoiceBotChanged = (that) => {
                if (that.tags.includes('voiceEnabled')) {
                    thisBot.refreshDisplay();
                }
            }

            os.addBotListener(links.voice, 'onBotChanged', thisBot.vars.onVoiceBotChanged);

            thisBot.refreshDisplay();
        }),
        refreshDisplay: ListenerString(() => {
            links.voice.tags.voiceEnabled ? tags.formAddress = 'check_box' : tags.formAddress = 'check_box_outline_blank';
        }),
        onClick: ListenerString(() => {
            setTagMask(links.voice, 'voiceEnabled', !!!links.voice.tags.voiceEnabled, 'tempLocal');
        }),
        onDestroy: ListenerString(() => {
            os.removeBotListener(links.voice, 'onBotChanged', thisBot.vars.onVoiceBotChanged);
        })
    });

    aiDropdownOptions.push({
        label: "auto speaks",
        voice: tags.voice,
        onCreate: ListenerString(() => {
            thisBot.vars.onVoiceBotChanged = (that) => {
                if (that.tags.includes('autoSpeak') || that.tags.includes('voiceEnabled')) {
                    thisBot.refreshDisplay();
                }
            }

            os.addBotListener(links.voice, 'onBotChanged', thisBot.vars.onVoiceBotChanged);

            thisBot.refreshDisplay();
        }),
        refreshDisplay: ListenerString(() => {
            tags.abMenu = links.voice.tags.voiceEnabled;
            links.voice.tags.autoSpeak ? tags.formAddress = 'check_box' : tags.formAddress = 'check_box_outline_blank';
        }),
        onClick: ListenerString(() => {
            setTagMask(links.voice, 'autoSpeak', !!!links.voice.tags.autoSpeak, 'tempLocal');
        }),
        onDestroy: ListenerString(() => {
            os.removeBotListener(links.voice, 'onBotChanged', thisBot.vars.onVoiceBotChanged);
        })
    });

    aiDropdownOptions.push({
        label: "mic muted",
        voice: tags.voice,
        onCreate: ListenerString(() => {
            thisBot.vars.onVoiceBotChanged = (that) => {
                if (that.tags.includes('muted') || that.tags.includes('voiceEnabled')) {
                    thisBot.refreshDisplay();
                }
            }

            os.addBotListener(links.voice, 'onBotChanged', thisBot.vars.onVoiceBotChanged);

            thisBot.refreshDisplay();
        }),
        refreshDisplay: ListenerString(() => {
            tags.abMenu = links.voice.tags.voiceEnabled;
            links.voice.tags.muted ? tags.formAddress = 'check_box' : tags.formAddress = 'check_box_outline_blank';
        }),
        onClick: ListenerString(() => {
            setTagMask(links.voice, 'muted', !!!links.voice.tags.muted, 'tempLocal');
        }),
        onDestroy: ListenerString(() => {
            os.removeBotListener(links.voice, 'onBotChanged', thisBot.vars.onVoiceBotChanged);
        })
    });
}

if (links.gpt) {
    aiDropdownOptions.push({
        formAddress: "edit_note",
        onCreate: ListenerString(() => {
            if (!authBot) {
                destroy(thisBot);
            } else if (authBot.tags.subscriptionTier == 'FreePlay' || authBot.tags.subscriptionTier == undefined) {
                destroy(thisBot);
            }

            tags.label = 'edit ' + links.personality.tags.abBuilderIdentity + ' prompt';
            tags.gptBot = getLink(ab.links.ask);
        }),
        onClick: ListenerString(() => {
            links.gptBot.editPrompt();
        }),
    });

    aiDropdownOptions.push({
        label: `clear ${ab.links.personality.tags.abBuilderIdentity} ai chat history`,
        formAddress: 'clear_all',
        onCreate: ListenerString(() => {
            const history = ab.links.ask.abConversationHistoryGet({ historyStorageBot: ab.links.remember }) ?? [];
            tags.label = `clear ${ab.links.personality.tags.abBuilderIdentity} ai chat history (${history.length > 0 ? `${history.length} messages` : `empty`})`;
        }),
        onClick: ListenerString(() => {
            ab.links.ask.abConversationHistoryClear({ historyStorageBot: ab.links.remember });
            shout('abMenuRefresh');
        }),
    });
}

if (aiDropdownOptions && aiDropdownOptions.length > 0) {
    options.push({
        label: `${links.personality.tags.abBuilderIdentity} ai`,
        abEnvironmentMenuSortOrder: 400,
        menuItemType: 'dropdown',
        dropdownOptions: aiDropdownOptions
    })
}

if (links.presence) {
    options.push({
        label: "presence",
        abEnvironmentMenuSortOrder: 510,
        menuItemType: 'dropdown',
        dropdownOptions: [
            {
                label: "camera presence",
                presence: tags.presence,
                onCreate: ListenerString(() => {
                    thisBot.vars.onPresenceBotChanged = (that) => {
                        if (that.tags.includes('cameraEnabled')) {
                            thisBot.refreshDisplay();
                        }
                    }

                    os.addBotListener(links.presence, 'onBotChanged', thisBot.vars.onPresenceBotChanged);

                    thisBot.refreshDisplay();
                }),
                refreshDisplay: ListenerString(() => {
                    links.presence.tags.cameraEnabled ? tags.formAddress = 'check_box' : tags.formAddress = 'check_box_outline_blank';
                }),
                onClick: ListenerString(() => {
                    setTagMask(links.presence, 'cameraEnabled', !!!links.presence.tags.cameraEnabled, 'local');
                }),
                onDestroy: ListenerString(() => {
                    os.removeBotListener(links.presence, 'onBotChanged', thisBot.vars.onPresenceBotChanged);
                })
            },
            {

                label: "cursor presence",
                presence: tags.presence,
                onCreate: ListenerString(() => {
                    thisBot.vars.onPresenceBotChanged = (that) => {
                        if (that.tags.includes('cursorEnabled')) {
                            thisBot.refreshDisplay();
                        }
                    }

                    os.addBotListener(links.presence, 'onBotChanged', thisBot.vars.onPresenceBotChanged);

                    thisBot.refreshDisplay();
                }),
                refreshDisplay: ListenerString(() => {
                    links.presence.tags.cursorEnabled ? tags.formAddress = 'check_box' : tags.formAddress = 'check_box_outline_blank';
                }),
                onClick: ListenerString(() => {
                    setTagMask(links.presence, 'cursorEnabled', !!!links.presence.tags.cursorEnabled, 'local');
                }),
                onDestroy: ListenerString(() => {
                    os.removeBotListener(links.presence, 'onBotChanged', thisBot.vars.onPresenceBotChanged);
                })
            }
        ]
    })
}

options.push({
    label: "snap",
    abEnvironmentMenuSortOrder: 700,
    menuItemType: 'dropdown',
    dropdownOptions: [
        {
            label: "grid snap",
            onCreate: ListenerString(() => {
                tags.formAddress = links.remember.tags.abGridSnapState ? 'check_box' : 'check_box_outline_blank'
            }),
            onClick: ListenerString(() => {
                links.remember.tags.abGridSnapState = !links.remember.tags.abGridSnapState; tags.formAddress = links.remember.tags.abGridSnapState ? 'check_box' : 'check_box_outline_blank';
            }),
        },
        {
            label: "bot snap",
            onCreate: ListenerString(() => {
                tags.formAddress = links.remember.tags.abBotSnapState ? 'check_box' : 'check_box_outline_blank';
            }),
            onClick: ListenerString(() => {
                links.remember.tags.abBotSnapState = !links.remember.tags.abBotSnapState; tags.formAddress = links.remember.tags.abBotSnapState ? 'check_box' : 'check_box_outline_blank';
            }),
        }
    ]
})

const developerDropdownOptions = [];

if (links.test) {
    developerDropdownOptions.push({
        label: "record test",
        formAddress: "science",
        onClick: ListenerString(() => {
            shout('abRecordTest');
            shout('abMenuRefresh');
        }),
    })

    developerDropdownOptions.push({
        label: "record trace",
        formAddress: "timeline",
        onClick: ListenerString(() => {
            shout('abRecordTrace');
            shout('abMenuRefresh');
        }),
    })
}

developerDropdownOptions.push({
    label: "command bar",
    formAddress: "terminal",
    onClick: ListenerString(() => {
        shout('abChatBarOpen'); shout('abMenuRefresh');
    }),
})

developerDropdownOptions.push({
    label: "permanently delete",
    formAddress: "delete_forever",
    labelColor: 'black',
    onCreate: ListenerString(() => {
        tags.label += " " + links.personality.tags.abBuilderIdentity;
        tags.color = links.remember.tags.abBaseContrastColor ?? "#D93030";
    }),
    onClick: ListenerString(async () => {
        const confirmed = await os.showConfirm({
            title: 'Permanently delete ' + links.personality.tags.abBuilderIdentity,
            content: 'Are you sure you want to delete ' + links.personality.tags.abBuilderIdentity + ' from ' + links.learn.tags.abInst + '? This is not reversible!',
        })

        destroy(links.manifestation.links.abBot);

        const abBots = getBots((b) => {
            return b.space === 'shared' &&
                b.tags.system &&
                b.tags.system.startsWith('ab');
        });

        if (confirmed) {
            destroy(abBots);
        }
    })
})

if (developerDropdownOptions.length > 0) {
    options.push({
        label: 'developer',
        abEnvironmentMenuSortOrder: 1000,
        menuItemType: 'dropdown',
        dropdownOptions: developerDropdownOptions,
    })
}

if (getBot("system", "ab.home.egg")) {
    options.push({
        label: "save home egg",
        abEnvironmentMenuSortOrder: 1200,
        formAddress: "egg",
        onClick: ListenerString(() => {
            getBot("system", "ab.home.egg").saveData(); shout('abMenuRefresh');
        }),
    })
}

options.push({
    label: "check for " + ab.links.personality.tags.abBuilderIdentity + " updates",
    abEnvironmentMenuSortOrder: 1300,
    formAddress: "cube",
    learn: tags.learn,
    checkForUpdates: ListenerString(async () => {
        // Temporarily replace with busy indicator while checking for updates.
        tags.abMenu = false;

        thisBot.vars.busyIndicator = ab.links.menu.abCreateMenuBusyIndicator({
            abMenu: true,
            label: 'checking for updates to ' + abPersonality.tags.abBuilderIdentity,
            abMenuSortOrder: tags.abEnvironmentMenuSortOrder,
        });

        try {
            thisBot.vars.abUpdateCheck = await ab.abCheckABUpdateAvailable({ detailed: true });
        } finally {
            destroy(thisBot.vars.busyIndicator);
            thisBot.vars.busyIndicator = null;

            // Bring back the update button.
            tags.abMenu = true;
        }

        if (thisBot.vars.abUpdateCheck && thisBot.vars.abUpdateCheck.success) {
            if (globalThis.abUpdateChecker) {
                abUpdateChecker.tags.updateAvailable = thisBot.vars.abUpdateCheck.updateAvailable;
            }

            if (thisBot.vars.abUpdateCheck.updateAvailable) {
                const abFilesWithUpdates = thisBot.vars.abUpdateCheck.abFileChecks.filter(f => f.updateAvailable);

                const confirmed = await os.showConfirm({
                    title: 'Updates found for ' + abPersonality.tags.abBuilderIdentity,
                    content: 'There are ' + abFilesWithUpdates.length + ' file updates for ' + abPersonality.tags.abBuilderIdentity + '. Would you like to install the updates now? You and any connected users will automatically refresh the page after the update is complete.',
                    cancelText: 'Not now',
                    confirmText: 'Yes'
                })

                if (confirmed) {
                    links.learn.updateAB();
                    shout('abMenuRefresh');
                }
            } else {
                ab.links.utils.abLogAndToast(abPersonality.tags.abBuilderIdentity + ' is already up-to-date!');
            }
        } else {
            masks.label = 'update check failed';
        }
    }),
    onClick: ListenerString(() => {
        thisBot.checkForUpdates();
    }),
    onDestroy: ListenerString(() => {
        if (thisBot.vars.busyIndicator) {
            destroy(thisBot.vars.busyIndicator);
        }
    }),
})

return options;