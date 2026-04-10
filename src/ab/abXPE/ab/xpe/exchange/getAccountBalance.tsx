import { JSONAccountBalance } from 'casualos';

const {
    accountId,
    accountType,
}: ABXPEGetAccountBalanceParams = that ?? {}

assert(masks.initialized, `[${tags.system}.${tagName}] skill must be loaded before first.`);
assert(accountId, `[${tags.system}.${tagName}] accountId is a required parameter.`);
assert(accountType, `[${tags.system}.${tagName}] accountType is a required parameter.`);

let userId, studioId, contractId;

if (accountType === 'user') {
    userId = accountId;
} else if (accountType === 'studio') {
    studioId = accountId;
} else if (accountType === 'contract') {
    contractId = accountId;
} else {
    throw new Error(`[${tags.system}.${tagName}] unknown accountType '${accountType}'`);
}

const balanceResult = await xp.getAccountBalances({ userId, studioId, contractId });

if (tags.debug) {
    console.log(`[${tags.system}.${tagName}] balanceResult:`, balanceResult);
}

if (balanceResult.success) {
    return balanceResult.credits as JSONAccountBalance;
} else {
    return null;
}