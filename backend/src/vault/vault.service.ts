import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// Vault 예치금을 DB에 저장하기 위한 Entity (선택사항)
// 기존 메모리 방식을 유지하거나 DB로 전환 가능

interface VaultRecord {
  fid: string;
  balance: number;
  reviewRequestId?: number; // 어떤 리뷰 요청에 대한 예치인지
}

@Injectable()
export class VaultService {
  // FID 기반으로 변경 (기존: 지갑 주소 기반)
  private vaults = new Map<string, number>();
  
  // 리뷰 요청별 예치금 추적
  private reviewRequestVaults = new Map<number, { fid: string; amount: number }>();

  /**
   * FID 기반 토큰 예치
   */
  async deposit(fid: string, amount: number): Promise<number> {
    if (amount <= 0) {
      throw new BadRequestException('예치 금액은 0보다 커야 합니다');
    }
    
    const currentBalance = this.vaults.get(fid) || 0;
    const newBalance = currentBalance + amount;
    this.vaults.set(fid, newBalance);
    return newBalance;
  }

  /**
   * 리뷰 요청에 대한 예치
   */
  async depositForReviewRequest(
    fid: string,
    reviewRequestId: number,
    amount: number,
  ): Promise<number> {
    // 1. 전체 예치금에 추가
    const newBalance = await this.deposit(fid, amount);
    
    // 2. 리뷰 요청별 예치금 기록
    this.reviewRequestVaults.set(reviewRequestId, { fid, amount });
    
    return newBalance;
  }

  /**
   * FID 기반 토큰 출금
   */
  async withdraw(fid: string, amount: number): Promise<number> {
    const currentBalance = this.vaults.get(fid) || 0;
    
    if (currentBalance < amount) {
      throw new BadRequestException(
        `Vault 잔액 부족: 예치된 ${currentBalance} MTR, 요청 ${amount} MTR`
      );
    }
    
    const newBalance = currentBalance - amount;
    this.vaults.set(fid, newBalance);
    return newBalance;
  }

  /**
   * FID 기반 잔액 조회
   */
  async getBalance(fid: string): Promise<number> {
    return this.vaults.get(fid) || 0;
  }

  /**
   * 리뷰 요청에 대한 예치금 조회
   */
  async getReviewRequestDeposit(reviewRequestId: number): Promise<{ fid: string; amount: number } | null> {
    return this.reviewRequestVaults.get(reviewRequestId) || null;
  }

  /**
   * 리뷰 완료 시 보상 분배
   * - 요청자의 예치금에서 리뷰어에게 전송
   */
  async distributeReward(
    requesterFid: string,
    reviewerFid: string,
    amount: number,
  ): Promise<{
    requesterBalance: number;
    reviewerReceived: number;
  }> {
    // 1. 요청자 예치금에서 차감
    const requesterBalance = await this.withdraw(requesterFid, amount);
    
    // 2. 리뷰어는 직접 받음 (WalletService에서 처리)
    // 여기서는 Vault 기록만 관리
    
    return {
      requesterBalance,
      reviewerReceived: amount,
    };
  }

  /**
   * 모든 Vault 정보 조회 (관리자용)
   */
  async getAllVaults() {
    return Array.from(this.vaults.entries()).map(([fid, balance]) => ({
      fid,
      balance,
    }));
  }

  /**
   * 예치 취소 (리뷰 요청 취소 시)
   */
  async cancelDeposit(fid: string, amount?: number): Promise<number> {
    const currentBalance = this.vaults.get(fid) || 0;
    const withdrawAmount = amount ?? currentBalance;
    
    return this.withdraw(fid, withdrawAmount);
  }
}