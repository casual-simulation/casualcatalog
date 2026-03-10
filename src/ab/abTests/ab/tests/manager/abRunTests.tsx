const testCases = getBots(
    byTag('__test', true),
    byTag('__testCase', true)
);

let totalCount = testCases.length;
let completedCount = 0;
let successCount = 0;
let failureCount = 0;
let promises = [];
for(let testCase of testCases) {
    if (testCase.tags.skip) {
        continue;
    }

    const promise = thisBot.runTestCase(getID(testCase)).then((result) => {
        if (result.success) {
            successCount += 1;
        } else {
            failureCount += 1;
        }
        completedCount += 1;
        if (thisBot.links.runTestsButton) {
            thisBot.links.runTestsButton.masks.label = `${completedCount}/${totalCount}`;
        }

        return result;
    });
    promises.push(promise);
}

const results = await Promise.all(promises);

let success = true;
let firstUnsucessfulResult = null;
for(let result of results) {
    if (result.success) {
        continue;
    }
    success = false;
    firstUnsucessfulResult = result;
    break;
}

if (success) {
    os.toast("Success!");

    if (thisBot.links.runTestsButton) {
        thisBot.links.runTestsButton.masks.label = `✓ ${successCount}/${totalCount}`;
    }

    return true;
} else {
    configBot.tags.systemPortalDiff = 'testSystem';
    configBot.tags.systemPortal = firstUnsucessfulResult.system;
    configBot.tags.systemPortalPane = 'diff';
    configBot.tags.systemPortalDiffBot = firstUnsucessfulResult.diffBotId;
    configBot.tags.systemPortalDiffTag = 'timeline';

    if (thisBot.links.runTestsButton) {
        thisBot.links.runTestsButton.masks.label = `❌ ${successCount}/${totalCount}`;
    }

    return false;
}