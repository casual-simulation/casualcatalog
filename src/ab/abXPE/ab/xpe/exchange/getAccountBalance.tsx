import { JSONAccountBalance } from 'casualos';

const {
    userId,
    studioId,
    contractId,
}: ABXPEGetAccountBalanceParams = that ?? {}

const idProvidedCount = [userId, studioId, contractId].filter(Boolean).length;

assert(masks.initialized, `[${tags.system}.${tagName}] skill must be loaded before first.`);
assert(idProvidedCount > 0, `[${tags.system}.${tagName}] a userId, studioId, or contractId must be provided as a parameter`);
assert(idProvidedCount === 1, `[${tags.system}.${tagName}] can only provide one of the id parameters: userId, studioId, or contractId.`);

const balanceResult = await xp.getAccountBalances({ userId, studioId, contractId });

if (tags.debug) {
    console.log(`[${tags.system}.${tagName}] ${userId ?? studioId ?? contractId} balance result:`, balanceResult);
}

if (balanceResult.success) {
    return balanceResult.credits as JSONAccountBalance;
} else {
    return null;
}