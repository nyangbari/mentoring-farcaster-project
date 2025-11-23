import { Injectable } from '@nestjs/common'

@Injectable()
export class VaultService {
  // 임시로 메모리에 저장하는 방식 (실제로는 DB 사용 권장)
  private vaults = new Map<string, number>()

  /**
   * 토큰 예치
   * 
   * @param address - 사용자 지갑 주소
   * @param amount - 예치할 금액
   * @returns 업데이트된 잔액
   */
  async deposit(address: string, amount: number): Promise<number> {
    const currentBalance = this.vaults.get(address) || 0
    const newBalance = currentBalance + amount
    this.vaults.set(address, newBalance)
    return newBalance
  }

  /**
   * 토큰 출금
   * 
   * @param address - 사용자 지갑 주소
   * @param amount - 출금할 금액
   * @returns 업데이트된 잔액
   */
  async withdraw(address: string, amount: number): Promise<number> {
    const currentBalance = this.vaults.get(address) || 0
    if (currentBalance < amount) {
      throw new Error('Vault 잔액 부족')
    }
    const newBalance = currentBalance - amount
    this.vaults.set(address, newBalance)
    return newBalance
  }

  /**
   * 잔액 조회
   * 
   * @param address - 사용자 지갑 주소
   * @returns 현재 예치 잔액
   */
  async getBalance(address: string): Promise<number> {
    return this.vaults.get(address) || 0
  }

  /**
   * 모든 Vault 정보 조회 (관리자용)
   */
  async getAllVaults() {
    return Array.from(this.vaults.entries()).map(([address, balance]) => ({
      address,
      balance
    }))
  }
}