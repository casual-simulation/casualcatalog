// Wait for an `onAnyABArtifactReconstituted` broadcast that matches a caller-
// supplied predicate. Useful when blocking on an artifact reconstitution
// without knowing the `abArtifactInstanceID` up front (e.g. when an artifact
// is created indirectly).
//
// args:
//   matchSuccess  — predicate for the reconstitute event. Required.
//   matchFailure  — predicate for the failure event. Defaults to `matchSuccess`.
//                   Failure events omit `shardBots`, so use a coarser check.
//   timeoutMs     — optional. Omit / 0 = wait forever.
//
// returns: the matching reconstitute event.
// throws:  on reconstitute failure, or on timeout (timeout errors have
//          `error.timedOut === true`).
//
// Example:
//
//   try {
//       await ab.links.artifact.awaitArtifactReconstitution({
//           matchSuccess: e => e?.abArtifactName === 'kit' && e.shardBots?.some(b => b?.tags?.label === expectedLabel),
//           matchFailure: e => e?.abArtifactName === 'kit',
//           timeoutMs: 15000,
//       });
//   } catch (e) {
//       if (!e?.timedOut) throw e; // real failure; swallow timeout
//   }

const {
    matchSuccess,
    matchFailure,
    timeoutMs,
} = that ?? {};

assert(typeof matchSuccess === 'function', `[${tags.system}.${tagName}] 'matchSuccess' predicate is required.`);

const failurePredicate = typeof matchFailure === 'function' ? matchFailure : matchSuccess;

let cleanup = () => {};
let timeoutHandle;

const waitForReconstitution = new Promise((resolve, reject) => {
    const handleReconstituted = (listenerThat) => {
        try {
            if (!matchSuccess(listenerThat)) return;
        } catch (e) {
            cleanup();
            reject(e);
            return;
        }
        cleanup();
        resolve(listenerThat);
    };

    const handleReconstitutionFailed = (listenerThat) => {
        try {
            if (!failurePredicate(listenerThat)) return;
        } catch (e) {
            cleanup();
            reject(e);
            return;
        }
        cleanup();
        reject(new Error(listenerThat?.errorMessage ?? 'artifact reconstitution failed'));
    };

    cleanup = () => {
        if (timeoutHandle) {
            clearTimeout(timeoutHandle);
            timeoutHandle = undefined;
        }
        os.removeBotListener(thisBot, 'onAnyABArtifactReconstituted', handleReconstituted);
        os.removeBotListener(thisBot, 'onAnyABArtifactReconstitutionFailed', handleReconstitutionFailed);
    };

    os.addBotListener(thisBot, 'onAnyABArtifactReconstituted', handleReconstituted);
    os.addBotListener(thisBot, 'onAnyABArtifactReconstitutionFailed', handleReconstitutionFailed);
});

if (!timeoutMs || timeoutMs <= 0) {
    return await waitForReconstitution;
}

const timeoutPromise = new Promise((_, reject) => {
    timeoutHandle = setTimeout(() => {
        cleanup();
        const err = new Error(`artifact reconstitution timed out after ${timeoutMs}ms`);
        err.timedOut = true;
        reject(err);
    }, timeoutMs);
});

return await Promise.race([waitForReconstitution, timeoutPromise]);
