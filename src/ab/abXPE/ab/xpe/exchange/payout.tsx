import { JSONAccountBalance } from 'casualos';

const {
    amount,
    destination,
    sourceId,
}: ABXPE = that ?? {};

if (tags.mock) {
    await os.sleep(100);

    const balance: JSONAccountBalance = thisBot.vars.mockBalance;
    let creditsNum = Number.parseFloat(balance.credits);

    if (creditsNum >= amount) {
        if (tags.debug) {
            console.log(`[${tags.system}.${tagName}] mock: paying ${amount} out a balance of ${creditsNum}.`);
        }
        
        creditsNum -= amount;
        balance.credits = creditsNum.toString();

        const result: ABXPEPayoutResultSuccess = { success: true, payAmount: amount, curCredits: creditsNum, sourceId };
        shout('onABXPEPaidOut', result);

        return result;
    } else {
        const result: ABXPEPayoutResultFailure = { success: false, errorCode: 'mock_insufficient_funds', errorMessage: 'User has insufficient funds.', sourceId};
        
        return result;
    }
} else {
    const response: GenericResult<void, SimpleError> = await xp.payout({ amount, destination });
    const curCredits = await thisBot.getCredits();

    if (response.success) {
        const result: ABXPEPayoutResultSuccess = { success: true, payAmount: amount, curCredits, sourceId };
        shout('onABXPEPaidOut', result);

        return result;
    } else {
        const result: ABXPEPayoutResultFailure = { success: false, errorCode: repsonse.errorCode, errorMessage: response.errorMessage, sourceId };

        return result;
    }
}


