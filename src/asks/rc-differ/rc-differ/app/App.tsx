const { useState, useCallback, useEffect, useMemo } = os.appHooks;

const DEFAULT_BOT_COMPARE_TAG = 'system';
const CACHE_IDS = {
    DIFFER_MODE: 'rc-differ-mode',
    ORIGINAL_TARGET: 'rc-differ-original-target',
    CHANGED_TARGET: 'rc-differ-changed-target',
    CHANGES_ONLY: 'rc-differ-changed-only',
    ENTIRE_TAG: 'rc-differ-entire-tag',
    BOT_COMPARE_TAG: 'rc-differ-bot-compare-tag',
    LAST_SELECTED_CHOOSE_FROM_OPTION: 'rc-differ-last-selected-choose-from-option',
    EGG_LOOKUP_RECORD_KEY: 'rc-differ-egg-lookup-record-key',
    EGG_LOOKUP_EGG_NAME: 'rc-differ-egg-lookup-egg-name',
    EGG_LOOKUP_EGG_VERSION: 'rc-differ-egg-lookup-egg-version',
}

// recursiveForLoop helps get around some of the limitations of the 
// CasualOS __energyCheck when parsing through large aux files.
function recursiveForLoop({
    start = 0,
    end,
    step = 1,
    callback,
    condition = null
}) {

    function loop(current) {
        // Check custom condition if provided
        if (condition && !condition(current)) return;

        // Default termination conditions
        if (step > 0 && current >= end) return;
        if (step < 0 && current <= end) return;
        if (step === 0) return;

        // Execute callback
        const result = callback(current);

        // Allow early termination if callback returns false
        if (result === false) return;

        // Continue recursion
        loop(current + step);
    }

    loop(start);
}

function getCachedOption(name, defaultValue) {
    if (configBot) {
        if (!configBot.vars.rcDifferOptionCache) {
            configBot.vars.rcDifferOptionCache = {};
        }

        return configBot.vars.rcDifferOptionCache[name] ?? defaultValue;
    }
}

function setCachedOption(name, value) {
    if (configBot) {
        if (!configBot.vars.rcDifferOptionCache) {
            configBot.vars.rcDifferOptionCache = {};
        }

        configBot.vars.rcDifferOptionCache[name] = value;
        // console.log(`set cached option ${name}:`, {...configBot.vars.rcDifferOptionCache});
    }
}

async function selectAuxFileFromEgg() {
    const cachedRecordKey = getCachedOption(CACHE_IDS.EGG_LOOKUP_RECORD_KEY, configBot.tags.studio);
    const recordKey = await os.showInput(cachedRecordKey, {
        title: 'Record to lookup egg in',
        type: 'text',
    })

    if (!recordKey) {
        // No record key specified.
        return null;
    }

    if (recordKey !== cachedRecordKey) {
        setCachedOption(CACHE_IDS.EGG_LOOKUP_RECORD_KEY, recordKey);
    }

    const cachedEggName = getCachedOption(CACHE_IDS.EGG_LOOKUP_EGG_NAME, null);
    const eggName = await os.showInput(cachedEggName, {
        title: 'Name of egg',
        type: 'text',
    })

    if (!eggName) {
        // No egg name specified.
        return null;
    }

    if (eggName !== cachedEggName) {
        setCachedOption(CACHE_IDS.EGG_LOOKUP_EGG_NAME, eggName);
    }

    const eggDataResponse = await os.getData(recordKey, eggName);

    if (!eggDataResponse.success) {
        os.toast(`No data found at address '${eggName}' in record '${recordKey}'`, 5);
        return null;
    }

    const egg = eggDataResponse.data;

    if (!Array.isArray(egg.eggVersionHistory) || egg.eggVersionHistory.length === 0) {
        os.toast(`Data found at address '${eggName}' in record '${recordKey}' does not appear to be an egg.`, 5);
        return null;
    }

    const eggVersionOptions = egg.eggVersionHistory.map((item, index) => {
        return { label: `version ${index + 1}`, value: index }
    })

    let cachedEggVersion = getCachedOption(CACHE_IDS.EGG_LOOKUP_EGG_VERSION, eggVersionOptions.length - 1);

    if (cachedEggVersion >= eggVersionOptions.length) {
        // If the cached egg version is too large for the number of versions
        // available for this egg, then set it the current version for this egg.
        cachedEggVersion = eggVersionOptions.length - 1;
        setCachedOption(CACHE_IDS.EGG_LOOKUP_EGG_VERSION, cachedEggVersion);
    }

    const selectedVersionOption = await os.showInput(cachedEggVersion, {
        title: 'Version of egg',
        type: 'list',
        subtype: 'select',
        items: eggVersionOptions,
    })

    if (!selectedVersionOption) {
        // No egg version selected.
        return null;
    }

    const version = selectedVersionOption.value;

    if (version !== cachedEggVersion) {
        setCachedOption(CACHE_IDS.EGG_LOOKUP_EGG_VERSION, version);
    }

    const auxDataUrl = egg.eggVersionHistory[version];
    const auxData = await os.getFile(auxDataUrl);
    const auxFile = {
        name: `${eggName} (v${version + 1})`,
        data: auxData
    }

    return auxFile;
}

async function selectAuxFile() {
    const files = await os.showUploadFiles();

    let selectedAuxFiles = files.filter((file) => {
        if (file.name.endsWith('.aux')) {
            return true;
        } else {
            return false;
        }
    })

    if (selectedAuxFiles.length) {
        if (selectedAuxFiles.length > 1) {
            os.toast('Can only diff one file at a time.', 4);
        }

        let auxData = JSON.parse(selectedAuxFiles[0].data);

        let auxFile = {
            name: selectedAuxFiles[0].name,
            data: auxData,
        }

        return auxFile;
    } else {
        return null;
    }
}

async function selectAuxFiles() {
    const files = await os.showUploadFiles();

    let selectedAuxFiles = files.filter((file) => {
        if (file.name.endsWith('.aux')) {
            return true;
        } else {
            return false;
        }
    })

    if (selectedAuxFiles.length) {
        let auxFiles = [];

        recursiveForLoop({
            start: 0,
            end: selectedAuxFiles.length,
            condition: (i) => i < selectedAuxFiles.length,
            callback: (i) => {
                let auxData = JSON.parse(selectedAuxFiles[i].data);
                auxFiles.push({
                    name: selectedAuxFiles[i].name,
                    data: auxData,
                })
            }
        })

        return auxFiles;
    } else {
        return null;
    }
}

async function createCompareTagToBotMap(auxFile, compareTag, onError) {
    let botMap = {};

    if (auxFile) {
        const auxData = auxFile.data;
        let botState;

        if (auxData.version === 1) {
            botState = auxData.state;
        } else if (auxData.version === 2) {
            if (auxData.updates.length === 1) {
                const update = auxData.updates[0];
                botState = await os.getInstStateFromUpdates([update]);

            } else if (auxData.updates.length > 1) {
                if (onError) {
                    onError(`AUX Version 2 files can only have 1 update.`);
                }
            }
        }

        for (let botId in botState) {
            let botData = botState[botId];

            let compareTagValue = botData.tags[compareTag];

            if (compareTagValue) {
                if (botMap[compareTagValue]) {
                    if (onError) {
                        onError(`Bot with ${compareTag} tag value of ${compareTagValue} already exists in ${auxFile.name}`);
                    }
                }

                botMap[compareTagValue] = botData;
            } else {
                if (onError) {
                    onError(`Bot Id ${botId} in ${auxFile.name} does not specify the compare tag '${compareTag}'`);
                }
            }

        }
    }

    return botMap;
}

/**
 * Convert the given value to a string that can be used with the jsdiff library.
 * Jsdiff doesnt like to be given anything other than strings, so this conversion is needed for undefined, null, booleans, etc.
 */
function convertToDiffableString(value) {
    if (value == null) {
        return '';
    } else if (typeof value.toString === 'function') {
        return value.toString();
    } else {
        throw new Error('[convertToDiffableString] could not convert the given value to a string.');
    }
}

function useImport(url) {
    const [lib, setLib] = useState(null);
    const [loading, setLoading] = useState(false);

    // Import.
    useEffect(() => {
        async function load() {
            setLoading(true);

            try {
                const lib = await import(url);
                setLib(lib);
            } catch (e) {
                console.error('Failed to import:', url);
                setLib(null);
            } finally {
                setLoading(false);
            }
        }

        load();
    }, [url]);

    return [lib, loading];
}

function getSortedFiles(files) {
    if (!Array.isArray(files)) {
        return files;
    }
    
    return [...files].sort((a, b) => a.name.localeCompare(b.name));
}

const BotDiff = ({
    botDiff,
    showEntireTag
}) => {
    return (
        <div className='bot-diff'>
            <div className='bot-name'>{botDiff.botCompareKey}</div>
            <div className='bot-tags'>
                {botDiff.tagDiffs.map((el, index) => {
                    return <TagDiff key={index} tagDiff={el} showEntireTag={showEntireTag} />
                })}
            </div>
        </div>
    )
}

const FileGroup = ({
    fileGroup,
    showEntireTag
}) => {
    const [isCollapsed, setIsCollapsed] = useState(true);

    const toggleCollapse = useCallback(() => {
        setIsCollapsed(prev => !prev);
    }, []);

    const getBadgeInfo = (status) => {
        switch (status) {
            case 'new':
                return { className: 'badge-new', text: 'NEW' };
            case 'removed':
                return { className: 'badge-removed', text: 'REMOVED' };
            case 'modified':
                return { className: 'badge-modified', text: 'MODIFIED' };
            case 'no-changes':
                return { className: 'badge-no-changes', text: 'NO CHANGES' };
            default:
                return null;
        }
    };

    const badgeInfo = getBadgeInfo(fileGroup.status);

    return (
        <div className='file-group'>
            <div className='file-header' onClick={toggleCollapse}>
                <div className='file-name'>
                    <span className='collapse-icon material-icon'>
                        {isCollapsed ? 'add' : 'remove'}
                    </span>
                    {fileGroup.fileName}
                    {badgeInfo && (
                        <span className={`file-status-badge ${badgeInfo.className}`}>
                            {badgeInfo.text}
                        </span>
                    )}
                </div>
                <div className='file-stats'>
                    {fileGroup.botChangeCount != null &&
                        <div className='change-count'>{fileGroup.botChangeCount} bot(s) changed.</div>
                    }
                    {fileGroup.tagChangeCount != null &&
                        <div className='change-count'>{fileGroup.tagChangeCount} tag(s) changed.</div>
                    }
                </div>
            </div>
            {!isCollapsed && (
                <div className='file-bots'>
                    {fileGroup.botDiffs.map((botDiff, index) => {
                        return <BotDiff key={index} botDiff={botDiff} showEntireTag={showEntireTag} />
                    })}
                </div>
            )}
        </div>
    )
}

const TagDiff = ({
    tagDiff,
    showEntireTag
}) => {

    let diffLines = [];
    let oldLineNum = 1;
    let newLineNum = 1;

    for (let diff of tagDiff.diff) {
        const lines = diff.value.split('\n');
        if (lines[lines.length - 1] === '') {
            lines.pop();
        }

        for (let line of lines) {
            let lineObj = {
                oldLineNum: undefined,
                newLineNum: undefined,
                value: line,
                added: diff.added,
                removed: diff.removed,
            }

            if (diff.added) {
                lineObj.newLineNum = newLineNum;
                newLineNum++;
            } else if (diff.removed) {
                lineObj.oldLineNum = oldLineNum;
                oldLineNum++;
            } else {
                lineObj.oldLineNum = oldLineNum;
                lineObj.newLineNum = newLineNum;
                oldLineNum++;
                newLineNum++;
            }

            diffLines.push(lineObj);
        }
    }

    if (!showEntireTag) {
        const contextLines = 3;
        let reducedDiffLines = [];
        let lastIncludedIndex = -1;

        recursiveForLoop({
            start: 0,
            end: diffLines.length,
            condition: (i) => i < diffLines.length,
            callback: (i) => {
                let line = diffLines[i];

                if (line.added || line.removed) {
                    // Include context lines above and below the change
                    const start = Math.max(0, i - contextLines);
                    const end = Math.min(diffLines.length, i + contextLines + 1);

                    recursiveForLoop({
                        start: start,
                        end: end,
                        condition: (k) => k < end,
                        callback: (k) => {
                            if (!reducedDiffLines.includes(diffLines[k])) {
                                if (k > lastIncludedIndex + 1 && reducedDiffLines.length > 0) {
                                    // Insert a visual divider if there's a gap
                                    let hiddenRangeStart = diffLines[lastIncludedIndex + 1].oldLineNum;
                                    let hiddenRangeEnd = diffLines[k].oldLineNum - 1;

                                    // Check if hiddenRangeStart and hiddenRangeEnd are valid
                                    if (hiddenRangeStart !== undefined && hiddenRangeEnd !== undefined) {
                                        reducedDiffLines.push({ divider: true, range: [hiddenRangeStart, hiddenRangeEnd] });
                                    }
                                }
                                reducedDiffLines.push(diffLines[k]);
                                lastIncludedIndex = k;
                            }
                        }
                    })
                }
            }
        })

        // Check for initial hidden lines if the first change doesn't start from the first line
        if (diffLines.length > 0 && reducedDiffLines.length > 0 && reducedDiffLines[0].oldLineNum > 1) {
            reducedDiffLines.unshift({
                divider: true,
                range: [1, reducedDiffLines[0].oldLineNum - 1],
            });
        }

        // Check for trailing hidden lines if the last change doesn't end at the last line
        if (diffLines.length > 0 && lastIncludedIndex >= 0 && lastIncludedIndex < diffLines.length - 1) {
            // Ensure we have valid objects before accessing properties
            const lastLine = diffLines[diffLines.length - 1];
            const lastDisplayedLine = reducedDiffLines[reducedDiffLines.length - 1];

            if (lastLine && lastDisplayedLine &&
                lastLine.oldLineNum !== undefined &&
                lastDisplayedLine.oldLineNum !== undefined &&
                lastLine.oldLineNum > lastDisplayedLine.oldLineNum) {

                reducedDiffLines.push({
                    divider: true,
                    range: [lastDisplayedLine.oldLineNum + 1, lastLine.oldLineNum],
                });
            }
        }

        diffLines = reducedDiffLines;
    }

    return (
        <div className='tag-diff'>
            <div className='tag-name'>{tagDiff.tag}</div>
            <div className='tag-content'>
                {(diffLines && diffLines.length > 0) &&
                    <table>
                        {diffLines.map((el, index) => {
                            if (el.divider) {
                                let message;

                                if (el.range && el.range.length === 2) {
                                    if (Math.abs(el.range[0] - el.range[1]) > 0) {
                                        message = `Lines ${el.range[0]} to ${el.range[1]} hidden`;
                                    } else {
                                        message = `Line ${el.range[0]} hidden`;
                                    }
                                } else {
                                    message = `Lines hidden`;
                                }

                                return (
                                    <tr key={`divider-${index}`} className='divider'>
                                        <td className='line-number'>...</td>
                                        <td className='line-number'>...</td>
                                        <td className='line-content'>{message}</td>
                                    </tr>
                                )
                            } else {
                                let subClass = '';

                                if (el.added) {
                                    subClass = 'added';
                                } else if (el.removed) {
                                    subClass = 'removed';
                                }

                                return (
                                    <tr key={`line-${index}`} className='line'>
                                        <td className={`line-number original ${subClass}`}>{el.oldLineNum}</td>
                                        <td className={`line-number changed ${subClass}`}>{el.newLineNum}</td>
                                        <td className='line-content'><span className={subClass}>{el.value === '' ? '\r' : el.value}</span></td>
                                    </tr>
                                )
                            }
                        })}
                    </table>
                }
                {(!diffLines || diffLines.length === 0) &&
                    <span className='no-changes'>{`<No changes>`}</span>
                }
            </div>
        </div>
    )
}

const SmallCircularButton = ({
    icon,
    onClick,
    children
}) => {
    return (
        <button className='small-circular-button' onClick={onClick}>
            <span className='material-icon'>{icon}</span>
            {children}
        </button>
    )
}

const SelectedFile = ({
    file,
    onRemoveClick,
}) => {
    return (
        <div className='file'>
            <span className='name'>{file.name}</span>
            <SmallCircularButton icon='close' onClick={onRemoveClick} />
        </div>
    )
}

function App() {
    const [diffModule, diffModuleLoading] = useImport('https://cdn.jsdelivr.net/npm/diff@5.2.0/+esm');
    const [differMode, setDifferMode] = useState(getCachedOption(CACHE_IDS.DIFFER_MODE, 'file'));
    const [originalTarget, setOriginalTarget] = useState(getCachedOption(CACHE_IDS.ORIGINAL_TARGET));
    const [changedTarget, setChangedTarget] = useState(getCachedOption(CACHE_IDS.CHANGED_TARGET));
    const [showChangesOnly, setShowChangesOnly] = useState(getCachedOption(CACHE_IDS.CHANGES_ONLY, true));
    const [showEntireTag, setShowEntireTag] = useState(getCachedOption(CACHE_IDS.ENTIRE_TAG, false));
    const [botCompareTag, setBotCompareTag] = useState(getCachedOption(CACHE_IDS.BOT_COMPARE_TAG));
    const [botDiffs, setBotDiffs] = useState();
    const [version, setVersion] = useState();
    const [errors, setErrors] = useState();
    const [versionDate, setVersionDate] = useState();
    const [botChangeCount, setBotChangeCount] = useState();
    const [tagChangeCount, setTagChangeCount] = useState();
    const [settingsChanged, setSettingsChanged] = useState(false);
    const [firstDiff, setFirstDiff] = useState(true);
    const [loadedFilesFromServer, setLoadedFilesFromServer] = useState(false);
    const [diffProcessing, setDiffProcessing] = useState(false);

    // on mount
    useEffect(() => {
        const packageInfoBot = getBot('system', 'rc-differ._packageInfo');

        if (packageInfoBot) {
            setVersion(packageInfoBot.raw.version);
            setVersionDate(packageInfoBot.tags.versionDate.toLocaleString(DateTime.DATETIME_FULL));
        }

        tryFetchDataFromServer();
    }, [])

    const onCloseClick = useCallback(() => {
        os.showConfirm({
            title: 'Close Differ App',
            content: 'Are you sure you want to close this app? You can use the chat command "differ" to re-open this later.',
            cancelText: 'Cancel',
            confirmText: 'Yes'
        }).then((confirm) => {
            if (confirm) {
                thisBot.unmount();
                configBot.tags.gridPortal = 'home';
            }
        })
    }, []);

    const tryFetchDataFromServer = useCallback(async () => {
        const url = new URL(configBot.tags.url);
        const httpPort = url.searchParams.get('httpPort');

        if (!httpPort) {
            return;
        }

        try {
            const response = await self.fetch(`http://localhost:${httpPort}/diff-data`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const json = await response.json();
            console.log('response json:', json);

            setOriginalTarget({
                name: json.originalName,
                data: JSON.parse(json.original),
            })

            setChangedTarget({
                name: json.modifiedName,
                data: JSON.parse(json.modified)
            })

            setLoadedFilesFromServer(true);
        } finally {
            // Tell the server to shutdown.
            self.fetch(`http://localhost:${httpPort}/shutdown`);
        }
    }, [])

    const clearDiffState = useCallback(() => {
        setOriginalTarget(null);
        setChangedTarget(null);
        setCachedOption(CACHE_IDS.ORIGINAL_TARGET, null);
        setCachedOption(CACHE_IDS.CHANGED_TARGET, null);
        setBotDiffs(null);
        setBotChangeCount(null);
        setTagChangeCount(null);
        setErrors(null);
    }, [])

    const processDiff = useCallback(async () => {
        if (!originalTarget || !changedTarget) {
            return;
        }

        console.log('==== process diff start ====');

        setDiffProcessing(true);

        let compareTag = botCompareTag ? botCompareTag : DEFAULT_BOT_COMPARE_TAG;
        let errors = [];
        let botDiffs = [];
        let botChangeCount = 0;
        let tagChangeCount = 0;

        const onCreateBotMapError = (errorMessage) => {
            errors.push(errorMessage);
        }

        if (differMode === 'file') {
            let originalBotMap = await createCompareTagToBotMap(originalTarget, compareTag, onCreateBotMapError);
            let changedBotMap = await createCompareTagToBotMap(changedTarget, compareTag, onCreateBotMapError);

            const fileDiff = await processFileDiff({
                originalBotMap,
                changedBotMap,
                fileName: null, // No specific filename for single file mode
                showChangesOnly,
                diffModule
            });

            botChangeCount += fileDiff.botChangeCount;
            tagChangeCount += fileDiff.tagChangeCount;
            botDiffs.push(...fileDiff.botDiffs);

        } else if (differMode === 'folder') {
            // Multiple files diff - group by filename
            const originalFiles = Array.isArray(originalTarget) ? originalTarget : [originalTarget];
            const changedFiles = Array.isArray(changedTarget) ? changedTarget : [changedTarget];

            // Create maps by filename
            const originalFileMap = {};
            const changedFileMap = {};

            originalFiles.forEach(file => {
                originalFileMap[file.name] = file;
            });

            changedFiles.forEach(file => {
                changedFileMap[file.name] = file;
            });

            // Get all unique filenames
            const allFilenames = new Set([
                ...Object.keys(originalFileMap),
                ...Object.keys(changedFileMap)
            ]);

            // Process each file and create file groups
            const fileGroups = [];

            for (const filename of Array.from(allFilenames).sort()) {
                const originalFile = originalFileMap[filename] || null;
                const changedFile = changedFileMap[filename] || null;

                // Determine file status
                let fileStatus = 'modified'; // default
                if (!originalFile && changedFile) {
                    fileStatus = 'new';
                } else if (originalFile && !changedFile) {
                    fileStatus = 'removed';
                }

                let originalBotMap = {};
                let changedBotMap = {};

                if (originalFile) {
                    originalBotMap = await createCompareTagToBotMap(originalFile, compareTag, onCreateBotMapError);
                }

                if (changedFile) {
                    changedBotMap = await createCompareTagToBotMap(changedFile, compareTag, onCreateBotMapError);
                }

                const fileDiff = await processFileDiff({
                    originalBotMap,
                    changedBotMap,
                    fileName: filename,
                    showChangesOnly,
                    diffModule
                });

                // Update file status based on actual changes detected
                const hasActualChanges = fileDiff.botDiffs.some(botDiff => 
                    botDiff.tagDiffs.some(tagDiff => 
                        tagDiff.diff.some(d => d.added || d.removed)
                    )
                );

                // Update file status based on actual changes detected
                if (fileStatus === 'modified' && !hasActualChanges) {
                    fileStatus = 'no-changes';
                }

                // For removed files, we still want to show them even if showChangesOnly is true
                // For new files, we also want to show them
                // For modified files, respect the showChangesOnly setting
                // For no-changes files, only show if showChangesOnly is false
                const shouldIncludeFile = fileStatus === 'new' ||
                    fileStatus === 'removed' ||
                    fileStatus === 'no-changes' && !showChangesOnly ||
                    (!showChangesOnly || fileDiff.botDiffs.length > 0);

                if (shouldIncludeFile) {
                    botChangeCount += fileDiff.botChangeCount;
                    tagChangeCount += fileDiff.tagChangeCount;

                    // Create a file group containing all bots for this file
                    fileGroups.push({
                        fileName: filename,
                        status: fileStatus, // Add status to file group
                        botChangeCount: fileDiff.botChangeCount,
                        tagChangeCount: fileDiff.tagChangeCount,
                        botDiffs: fileDiff.botDiffs.map(botDiff => ({
                            ...botDiff,
                            fileName: undefined // Remove fileName from individual bots since it's in the group
                        }))
                    });
                }
            }

            botDiffs = fileGroups;
        }

        if (errors.length > 0) {
            setErrors(errors);
        } else {
            setErrors(null);
        }

        // console.log('bot diffs:', self.structuredClone(botDiffs));

        setBotDiffs(botDiffs);
        setFirstDiff(false);
        setBotChangeCount(botChangeCount);
        setTagChangeCount(tagChangeCount);

        console.log('==== process diff end ====');
        setDiffProcessing(false);
    }, [diffModule, differMode, originalTarget, changedTarget, showChangesOnly, botCompareTag]);

    async function processFileDiff({
        originalBotMap,
        changedBotMap,
        fileName,
        showChangesOnly,
        diffModule
    }) {
        let botDiffs = [];
        let botChangeCount = 0;
        let tagChangeCount = 0;

        let compareKeys = new Set([
            ...Object.keys(originalBotMap),
            ...Object.keys(changedBotMap)
        ]);
        compareKeys = Array.from(compareKeys).sort();

        for (let compareKey of compareKeys) {
            let originalBot = originalBotMap[compareKey];
            let changedBot = changedBotMap[compareKey];
            let tagDiffs = [];
            let hasBotChanged = false;

            let tagNames = new Set([
                ...Object.keys((originalBot ?? {}).tags ?? {}),
                ...Object.keys((changedBot ?? {}).tags ?? {})
            ]);
            tagNames = Array.from(tagNames).sort();

            for (let tagName of tagNames) {
                const originalTagValue = convertToDiffableString(((originalBot ?? {}).tags ?? {})[tagName]);
                const changedTagValue = convertToDiffableString(((changedBot ?? {}).tags ?? {})[tagName]);

                const diff = diffModule.diffLines(originalTagValue, changedTagValue);

                const changesDetected = diff.some(d => d.added || d.removed);
                if (!showChangesOnly || (showChangesOnly && changesDetected)) {
                    if (changesDetected) {
                        if (!hasBotChanged) {
                            hasBotChanged = true;
                            botChangeCount++;
                        }
                        tagChangeCount++;
                    }

                    tagDiffs.push({
                        botCompareKey: compareKey,
                        tag: tagName,
                        diff: diff,
                    });
                }
            }

            if (tagDiffs.length > 0) {
                botDiffs.push({
                    botCompareKey: compareKey,
                    fileName: fileName, // Add filename to bot diff
                    tagDiffs,
                });
            }
        }

        return {
            botDiffs,
            botChangeCount,
            tagChangeCount
        };
    }

    const onModeChange = useCallback((event) => {
        const mode = event.currentTarget.value;
        setCachedOption(CACHE_IDS.DIFFER_MODE, mode);
        setDifferMode(mode);
        clearDiffState();
    }, [clearDiffState]);

    const onChooseClick = useCallback(async (clickEvent, setter, configBotVar = null) => {
        let target;

        if (differMode === 'file') {
            let sourceMode = undefined;

            if (clickEvent.shiftKey) {
                sourceMode = 'file';
            }

            const chooseFromOptions = [
                { label: 'From computer', value: 'file' },
                { label: 'From ab egg', value: 'egg' }
            ]

            let selectedOption;

            if (sourceMode == undefined) {
                const lastSelectedOptionIndex = getCachedOption(CACHE_IDS.LAST_SELECTED_CHOOSE_FROM_OPTION, 0);

                selectedOption = await os.showInput(lastSelectedOptionIndex, {
                    title: 'Source',
                    type: 'list',
                    subtype: 'radio',
                    items: chooseFromOptions
                });

                if (!selectedOption) {
                    return null;
                }

                const selectedOptionIndex = chooseFromOptions.findIndex(o => o.value === selectedOption.value);

                if (selectedOptionIndex !== lastSelectedOptionIndex) {
                    setCachedOption(CACHE_IDS.LAST_SELECTED_CHOOSE_FROM_OPTION, selectedOptionIndex);
                }
            } else {
                selectedOption = chooseFromOptions.find(o => o.value === sourceMode);

                if (!selectedOption) {
                    return null;
                }
            }

            if (selectedOption.value === 'file') {
                target = await selectAuxFile();
            } else if (selectedOption.value = 'egg') {
                target = await selectAuxFileFromEgg();
            }
        } else if (differMode === 'folder') {
            target = await selectAuxFiles();
        } else {
            console.error(`Differ mode ${diffModule} is not implemented in onChooseClick.`);
        }

        if (target) {
            setCachedOption(configBotVar, target);
            setter(target);
            setLoadedFilesFromServer(false);
        }

    }, [differMode]);

    const onRemoveFileClick = useCallback(({
        setter,
        fileName,
        configBotVar
    }) => {
        if (differMode === 'file') {
            setter(null);
            setCachedOption(configBotVar, null);
        } else if (differMode === 'folder') {
            let newValue = null;

            setter((prev) => {
                newValue = prev.filter(file => file.name !== fileName);
                return newValue;
            });

            setCachedOption(configBotVar, newValue);
        } else {
            console.error(`Differ mode ${differMode} is not implemented in onRemoveFileClick.`);
        }
    }, [differMode]);

    const onChangesOnlyCheckbox = useCallback((event) => {
        const checked = event.currentTarget.checked;
        setCachedOption(CACHE_IDS.CHANGES_ONLY, checked);
        setShowChangesOnly(checked);
        setSettingsChanged(true);
    }, [])

    const onEntireTagCheckbox = useCallback((event) => {
        const checked = event.currentTarget.checked;
        setCachedOption(CACHE_IDS.ENTIRE_TAG, checked);
        setShowEntireTag(checked);
        setSettingsChanged(true);
    }, [])

    const onBotCompareTagChange = useCallback((event) => {
        const value = event.currentTarget.value;
        setCachedOption(CACHE_IDS.BOT_COMPARE_TAG, value);
        setBotCompareTag(value);
        setSettingsChanged(true);
    }, [])

    // Automatically process diff when loading files from the server.
    useEffect(() => {
        if (loadedFilesFromServer && originalTarget && changedTarget) {
            processDiff();
        }
    }, [loadedFilesFromServer, originalTarget, changedTarget, processDiff])

    // Re-process diff when settings are changed.
    useEffect(() => {
        if (settingsChanged) {
            if (!firstDiff) {
                // console.log('settings changed on active diff - going to re-process!');
                processDiff();
            } else {
                // console.log('settings changed but first diff hasnt been done yet');
            }
        } else {
            // console.log('settings changed set back to false')
        }

        setSettingsChanged(false);
    }, [settingsChanged, firstDiff, processDiff])


    const onDownloadMergedFile = useCallback(() => {
        /** Ryan's Merge logic notes:
         * 
         * If none - merge
         * If added and removed - choose
         * If removed and added - choose
         * If removed only - merge
         * If added only - merge
         */


        console.log('onDownloadMergedFile');
    }, [originalTarget, changedTarget])

    const botDiffsHash = useMemo(() => {
        let stateData = [];

        if (botDiffs) {
            stateData.push(botDiffs);
        }

        stateData.push({
            showChangesOnly,
            showEntireTag,
        })

        return crypto.sha256(stateData);
    }, [botDiffs, showChangesOnly, showEntireTag])

    return (
        <>
            <style>{tags['style.css']}</style>
            <div className='diff-app'>
                <div className='diff-app-container'>
                    <h1>RC AUX Differ</h1>
                    <div className='version-info'>
                        <div>Version: {version}</div>
                        <div>Date: {versionDate}</div>
                        <div>Author: Ryan Cook {'('}<a href="https://github.com/Blitzy" target="_blank">GitHub</a> | <a href="mailto:ryan.cook@yeticgi.com">Email</a>{')'}</div>
                    </div>
                    <button className='close-button' onClick={onCloseClick}>Close</button>
                    {diffModuleLoading &&
                        <h2>Loading...</h2>
                    }
                    {!diffModuleLoading &&
                        <>
                            <div className='mode-selection'>
                                <label for='mode-select'>Differ Mode</label>
                                <select name='mode' id='mode-select' onChange={onModeChange}>
                                    <option value='file' selected={differMode === 'file'}>File</option>
                                    <option value='folder' selected={differMode === 'folder'}>Folder</option>
                                </select>
                            </div>
                        <div className='files-selection'>
                            <div className='files'>
                                <button onClick={(clickEvent) => onChooseClick(clickEvent, setOriginalTarget, CACHE_IDS.ORIGINAL_TARGET)}>
                                    {differMode === 'file' ? 'Choose Original AUX' : 'Choose Original Folder'}
                                </button>
                                {originalTarget && (
                                    Array.isArray(originalTarget) ? (
                                        getSortedFiles(originalTarget).map((file) =>
                                            <SelectedFile
                                                key={file.name}
                                                file={file}
                                                onRemoveClick={() => onRemoveFileClick({
                                                    setter: setOriginalTarget,
                                                    fileName: file.name,
                                                    configBotVar: CACHE_IDS.ORIGINAL_TARGET
                                                })}
                                            />
                                        )
                                    ) : (
                                        <SelectedFile
                                            file={originalTarget}
                                            onRemoveClick={() => onRemoveFileClick({
                                                setter: setOriginalTarget,
                                                configBotVar: CACHE_IDS.ORIGINAL_TARGET
                                            })}
                                        />
                                    )
                                )}
                            </div>
                            <div className='files'>
                                <button onClick={(clickEvent) => onChooseClick(clickEvent, setChangedTarget, CACHE_IDS.CHANGED_TARGET)}>
                                    {differMode === 'file' ? 'Choose Changed AUX' : 'Choose Changed Folder'}
                                </button>
                                {changedTarget && (
                                    Array.isArray(changedTarget) ? (
                                        getSortedFiles(changedTarget).map((file) =>
                                            <SelectedFile
                                                key={file.name}
                                                file={file}
                                                onRemoveClick={() => onRemoveFileClick({
                                                    setter: setChangedTarget,
                                                    fileName: file.name,
                                                    configBotVar: CACHE_IDS.CHANGED_TARGET
                                                })}
                                            />
                                        )
                                    ) : (
                                        <SelectedFile
                                            file={changedTarget}
                                            onRemoveClick={() => onRemoveFileClick({
                                                setter: setChangedTarget,
                                                configBotVar: CACHE_IDS.CHANGED_TARGET
                                            })}
                                        />
                                    )
                                )}
                            </div>
                        </div>

                            <div className='diff-options'>
                                <div className='option'>
                                    <label for='bot-compare-tag'>Bot Compare Tag</label><br />
                                    <input type='text' id='bot-compare-tag' name='bot-compare-tag' placeholder={botCompareTag ? null : DEFAULT_BOT_COMPARE_TAG} value={botCompareTag ? botCompareTag : null} onChange={onBotCompareTagChange}></input>
                                </div>
                                <div className='option'>
                                    <label for='changes-only'>Changed Tags Only</label>
                                    <input type='checkbox' id='changes-only' name='changes-only' checked={showChangesOnly} onChange={onChangesOnlyCheckbox} />
                                </div>
                                <div className='option'>
                                    <label for='entire-tag'>Show Entire Tag</label>
                                    <input type='checkbox' id='entire-tag' name='entire-tag' checked={showEntireTag} onChange={onEntireTagCheckbox} />
                                </div>
                            </div>
                            <div className='diff-button-group'>
                                <button className='diff-button' onClick={processDiff} disabled={diffProcessing}>Diff</button>
                                {diffProcessing &&
                                    <div className='diff-processing'>diff processing...</div>
                                }
                            </div>
                            {false && <button className='download-button' onClick={onDownloadMergedFile}>Download Merged File</button>}

                            {(errors && errors.length) &&
                                <div className='diff-errors'>
                                    <h2>Errors ({errors.length})</h2>
                                    <div className='errors'>
                                        {errors.map((error) => {
                                            return (
                                                <div className='error'>
                                                    <span className='icon'>❗</span>
                                                    <span className='message'>{error}</span>
                                                </div>)
                                        })}
                                    </div>
                                </div>
                            }
                            <div className='diffs-container' key={botDiffsHash}>
                                {botChangeCount != null &&
                                    <div className='change-count'>{botChangeCount} bot(s) changed.</div>
                                }
                                {tagChangeCount != null &&
                                    <div className='change-count'>{tagChangeCount} tag(s) changed.</div>
                                }
                                {botDiffs &&
                                    botDiffs.map((el, index) => {
                                        // Check if this is a file group (folder mode) or individual bot diff (file mode)
                                        if (el.fileName && el.botDiffs) {
                                            // This is a file group from folder mode
                                            return <FileGroup key={index} fileGroup={el} showEntireTag={showEntireTag} />
                                        } else {
                                            // This is an individual bot diff from file mode
                                            return <BotDiff key={index} botDiff={el} showEntireTag={showEntireTag} />
                                        }
                                    })
                                }
                            </div>
                        </>
                    }
                </div>
            </div>
        </>
    )
}

return App;