import { JSONAccountBalance } from 'casualos';

const balance: JSONAccountBalance = await thisBot.getAccountBalance();
const creditsNum = Number.parseFloat(balance.credits);

return creditsNum;