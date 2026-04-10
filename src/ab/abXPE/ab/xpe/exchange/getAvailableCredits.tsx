import { JSONAccountBalance } from 'casualos';

const {
    accountId,
    accountType,
}: ABXPEGetAvailableCreditsParams = that ?? {}

assert(accountId, `[${tags.system}.${tagName}] accountId is a required parameter.`);
assert(accountType, `[${tags.system}.${tagName}] accountType is a required parameter.`);

const balance: JSONAccountBalance = await thisBot.getAccountBalance({ accountId, accountType });

if (balance) {
    const creditsNum = Number.parseFloat(balance.credits ?? '0');
    const debitsNum = Number.parseFloat(balance.debits ?? '0');
    
    return creditsNum - debitsNum;
} else {
    return null;
}