import { GenericResult, SimpleError } from 'casualos';

const {
    userId,
    studioId,
    contractId,
    amount,
    destination,
    sourceId,
}: ABXPEPayoutParams = that ?? {};

const idProvidedCount = [userId, studioId, contractId].filter(Boolean).length;

assert(masks.initialized, `[${tags.system}.${tagName}] skill must be loaded before first.`);
assert(idProvidedCount > 0, `[${tags.system}.${tagName}] a userId, studioId, or contractId must be provided as a parameter`);
assert(idProvidedCount === 1, `[${tags.system}.${tagName}] can only provide one of the id parameters: userId, studioId, or contractId.`);

/* [Ryan] This is not implemented properly yet.

const response: GenericResult<void, SimpleError> = await xp.payout({ amount, destination });

if (tags.debug) {
    console.log(`[${tags.system}.${tagName}] payout response:`, response);
}

if (response.success) {
    const curCredits = await thisBot.getAvailableCredits({ accountId, accountType });

    const result: ABXPEPayoutResultSuccess = {
        ...response,
        payAmount: amount,
        curCredits,
        sourceId
    };

    shout('onABXPEPaidOut', result);

    return result;
} else {
    const result: ABXPEPayoutResultFailure = { 
        ...response,
        sourceId,
    };

    return result;
}
*/

const result: ABXPEPayoutResultFailure = { 
    success: false,
    errorCode: 'not_implemented',
    errorMessage: `${tags.system}.${tagName} is not implemented properly yet`,
    sourceId,
};

return result;


