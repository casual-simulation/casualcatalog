import { JSONAccountBalance } from 'casualos';

const balance: JSONAccountBalance = await thisBot.getAccountBalance();

if (balance) {
    const creditsNum = Number.parseFloat(balance.credits);
    return creditsNum;
} else {
    return null;
}