import { JSONAccountBalance } from 'casualos';

const {
    userId,
    studioId,
    contractId,
}: ABXPEGetAvailableCreditsParams = that ?? {}

const idProvidedCount = [userId, studioId, contractId].filter(Boolean).length;

assert(masks.initialized, `[${tags.system}.${tagName}] skill must be loaded before first.`);
assert(idProvidedCount > 0, `[${tags.system}.${tagName}] a userId, studioId, or contractId must be provided as a parameter`);
assert(idProvidedCount === 1, `[${tags.system}.${tagName}] can only provide one of the id parameters: userId, studioId, or contractId.`);

const balance: JSONAccountBalance = await thisBot.getAccountBalance({ userId, studioId, contractId });

if (balance) {
    const creditsNum = Number.parseFloat(balance.credits ?? '0');
    const debitsNum = Number.parseFloat(balance.debits ?? '0');
    
    return creditsNum - debitsNum;
} else {
    return null;
}