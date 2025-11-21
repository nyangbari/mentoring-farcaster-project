import { Injectable } from '@nestjs/common'

@Injectable()
export class VaultService {
  private vault = 0 // 실제 구현에서는 DB 사용 권장

  deposit(amount: number) {
    this.vault += amount
    return this.vault
  }

  withdraw(amount: number) {
    if (this.vault < amount) {
      throw new Error('Vault has insufficient funds')
    }
    this.vault -= amount
    return this.vault
  }

  getVaultBalance() {
    return this.vault
  }
}
