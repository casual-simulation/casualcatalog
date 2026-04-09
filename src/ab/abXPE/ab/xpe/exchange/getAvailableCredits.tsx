import { JSONAccountBalance } from 'casualos';

const balance: JSONAccountBalance = await thisBot.getAccountBalance();

if (balance) {
    const creditsNum = Number.parseFloat(balance.credits ?? '0');
    const debitsNum = Number.parseFloat(balance.debits ?? '0');
    
    return creditsNum - debitsNum;
} else {
    return null;
}