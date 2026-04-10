import { GenericResult, SimpleError } from 'casualos';

const {
    amount,
    destination,
    sourceId,
}: ABXPEPayoutParams = that ?? {};

const response: GenericResult<void, SimpleError> = await xp.payout({ amount, destination });

if (tags.debug) {
    console.log(`[${tags.system}.${tagName}] payout response:`, response);
}

if (response.success) {
    const curCredits = await thisBot.getAvailableCredits();

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


