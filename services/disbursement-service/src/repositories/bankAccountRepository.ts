import { BankAccount, ApplicationId } from '../types';

export class BankAccountRepository {
  private accounts: BankAccount[] = [];

  async findByApplicationId(applicationId: ApplicationId): Promise<BankAccount | null> {
    const account = this.accounts.find(a => a.applicationId === applicationId);
    return account || null;
  }

  async upsert(account: BankAccount): Promise<BankAccount> {
    const index = this.accounts.findIndex(a => a.applicationId === account.applicationId);
    if (index >= 0) {
      this.accounts[index] = account;
    } else {
      this.accounts.push(account);
    }
    return account;
  }
}
