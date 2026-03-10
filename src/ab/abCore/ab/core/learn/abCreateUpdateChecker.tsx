let abUpdateChecker = getBot('abUpdateChecker', true);

if (abUpdateChecker) {
    globalThis.abUpdateChecker = abUpdateChecker;
    return abUpdateChecker;
}

let mod = {
    space: 'tempLocal',
    abUpdateChecker: true,
    abIgnore: true,
    checking: false,
    updateAvailable: false,
    debug: false,
    onCreate: `@
        thisBot.startInterval();
        thisBot.onUpdateCheck();
    `,
    startInterval: `@
        if (!tags.interval) {
            const UPDATE_CHECK_INTERVAL_MINUTES = 5;
            const intervalMS = UPDATE_CHECK_INTERVAL_MINUTES * 60 * 1000;
            tags.interval = setInterval(() => thisBot.onUpdateCheck(), intervalMS);

            if (tags.debug) {
                console.log('[abUpdateChecker] start update check interval ms:', intervalMS);
            }
        }
    `,
    stopInterval: `@
        if (tags.interval) {
            clearInterval(tags.interval);
            tags.interval = null;

            if (tags.debug) {
                console.log('[abUpdateChecker] stop update check interval.');
            }
        }
    `,
    forceUpdateCheck: `@
        thisBot.stopInterval();
        thisBot.startInterval();
        thisBot.onUpdateCheck({ force: true });
    `,
    onUpdateCheck: `@
        const force = that?.force ?? false;

        if (!tags.checking) {
            if (!tags.updateAvailable || force) {
                tags.checking = true;

                try {
                    const result = await ab.abCheckABUpdateAvailable();

                    if (tags.debug) {
                        console.log('[abUpdateChecker] update check result:', result);
                    }

                    if (result.success) {
                        tags.updateAvailable = result.updateAvailable;

                        if (result.updateAvailable) {
                            shout('onABUpdateAvailable');
                        }
                    }
                } finally {
                    tags.checking = false;
                }
            } else {
                if (tags.debug) {
                    console.log('[abUpdateChecker] skip update check — update is already known to be available.');
                }
            }
        } else {
            if (tags.debug) {
                console.log('[abUpdateChecker] update check already in progress.');
            }
        }

    `,
}

abUpdateChecker = create(mod);
globalThis.abUpdateChecker = abUpdateChecker

return abUpdateChecker;