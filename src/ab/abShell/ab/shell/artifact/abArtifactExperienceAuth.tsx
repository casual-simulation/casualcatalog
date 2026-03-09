const { 
    abArtifactInstanceID
} = that ?? {}

assert(typeof abArtifactInstanceID === 'string', `[${tags.system}.${tagName}] abArtifactInstanceID is a required string parameter.`);

const expAuthResult: ABArtifactExperienceAuth = {
    abArtifactInstanceID,
    authorized: undefined,
    failureReason: undefined,
}

if (globalThis.abArtifactExperienceAuthFailure) {
    expAuthResult.authorized = false;
    expAuthResult.failureReason = abArtifactExperienceInitialized;

    return expAuthResult;
}

let myAuthBot = await os.requestAuthBotInBackground();

if (!myAuthBot) {
    // Not signed in, need to sign in to use artifact experience.
    let abArtifactUserAuthPromise = globalThis.abArtifactUserAuthPromise;

    if (!abArtifactUserAuthPromise) {
        abArtifactUserAuthPromise = os.showConfirm({
            title: 'Sign In Required',
            content: 'This server has artifacts that work best when you’re signed in. If you continue without signing in, the artifacts may not stay in sync.',
            confirmText: 'Sign In',
            cancelText: 'Continue Without'
        });

        globalThis.abArtifactUserAuthPromise = abArtifactUserAuthPromise;
    }

    const confirmed = await abArtifactUserAuthPromise;
    delete globalThis.abArtifactExperienceAuthFailure;

    if (confirmed) {
        myAuthBot = await os.requestAuthBot();
    } else {
        expAuthResult.authorized = false;
        expAuthResult.failureReason = 'user_declined_sign_in';
        globalThis.abArtifactExperienceAuthFailure = expAuthResult.failureReason;
        
        return expAuthResult;
    }
}

if (!myAuthBot) {
    expAuthResult.authorized = false;
    expAuthResult.failureReason = 'unknown';
    globalThis.abArtifactExperienceAuthFailure = expAuthResult.failureReason;

    return expAuthResult;
}

// const adminPermissionResult = await os.grantInstAdminPermission(links.remember.tags.abRecordName);
// console.log(`adminPermissionResult:`, adminPermissionResult);

// if (adminPermissionResult.success) {
//     expAuthResult.authorized = true;

//     return expAuthResult;
// } else {
//     expAuthResult.authorized = false;
//     expAuthResult.failureReason = 'user_declined_inst_permission';
//     globalThis.abArtifactExperienceAuthFailure = expAuthResult.failureReason;

//     return expAuthResult;
// }

expAuthResult.authorized = true;

return expAuthResult;