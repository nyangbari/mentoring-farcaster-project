import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WalletService } from '../wallet/wallet.service';
import { VaultService } from '../vault/vault.service';
import { Review } from './review.entity';
import { ReviewRequest } from '../review-request/review-request.entity';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewService {
  constructor(
    private readonly wallet: WalletService,
    private readonly vault: VaultService,
    @InjectRepository(Review)
    private readonly reviewRepo: Repository<Review>,
    @InjectRepository(ReviewRequest)
    private readonly reviewRequestRepo: Repository<ReviewRequest>,
  ) {}

  /**
   * 리뷰 요청 시 토큰 예치 (FID 기반)
   * - approve 불필요!
   * - 사용자 지갑에서 바로 Vault로 이동
   */
  async depositTokens(requesterFid: string, amount: number) {
    // Step 1: 사용자 잔액 확인
    const balance = await this.wallet.getBalance(requesterFid);

    if (balance < amount) {
      throw new BadRequestException(
        `잔액 부족: 보유 ${balance} MTR, 요청 ${amount} MTR`
      );
    }

    // Step 2: 사용자 지갑에서 차감
    const remainingBalance = await this.wallet.depositToVault(requesterFid, amount);

    // Step 3: Vault에 기록
    const vaultBalance = await this.vault.deposit(requesterFid, amount);

    return {
      requesterFid,
      depositedAmount: amount,
      remainingWalletBalance: remainingBalance,
      vaultBalance,
    };
  }

  /**
   * 리뷰어에게 보상 지급 (FID 기반)
   */
  async sendRewardToReviewer(
    requesterFid: string,
    reviewerFid: string,
    amount: number,
  ) {
    // Step 1: Vault에서 예치금 확인
    const vaultBalance = await this.vault.getBalance(requesterFid);

    if (vaultBalance < amount) {
      throw new BadRequestException(
        `예치금 부족: 예치된 ${vaultBalance} MTR, 요청 ${amount} MTR`
      );
    }

    // Step 2: Vault에서 차감
    await this.vault.withdraw(requesterFid, amount);

    // Step 3: 리뷰어 지갑에 추가
    const reviewerBalance = await this.wallet.receiveFromVault(reviewerFid, amount);

    return {
      requesterFid,
      reviewerFid,
      rewardAmount: amount,
      remainingVault: vaultBalance - amount,
      reviewerNewBalance: reviewerBalance,
    };
  }

  /**
   * 여러 리뷰어에게 일괄 분배 (FID 기반)
   */
  async distributeRewards(
    requesterFid: string,
    distributions: Array<{ reviewerFid: string; amount: number }>,
  ) {
    // Step 1: 총 지급액 계산
    const totalAmount = distributions.reduce((sum, d) => sum + d.amount, 0);

    // Step 2: Vault 잔액 확인
    const vaultBalance = await this.vault.getBalance(requesterFid);

    if (vaultBalance < totalAmount) {
      throw new BadRequestException(
        `예치금 부족: 예치된 ${vaultBalance} MTR, 총 지급 요청 ${totalAmount} MTR`
      );
    }

    // Step 3: 각 리뷰어에게 순차 지급
    const results: any[] = [];

    for (const dist of distributions) {
      try {
        const result = await this.sendRewardToReviewer(
          requesterFid,
          dist.reviewerFid,
          dist.amount,
        );
        results.push({
          success: true,
          ...result,
        });
      } catch (error: any) {
        results.push({
          success: false,
          reviewerFid: dist.reviewerFid,
          amount: dist.amount,
          error: error.message,
        });
      }
    }

    return {
      totalDistributed: totalAmount,
      initialVault: vaultBalance,
      remainingVault: await this.vault.getBalance(requesterFid),
      distributions: results,
    };
  }

  /**
   * 예치 취소 (리뷰 요청 취소 시)
   */
  async cancelDeposit(requesterFid: string, amount?: number) {
    const vaultBalance = await this.vault.getBalance(requesterFid);
    const withdrawAmount = amount ?? vaultBalance;

    if (withdrawAmount > vaultBalance) {
      throw new BadRequestException(
        `출금 불가: 예치된 ${vaultBalance} MTR, 요청 ${withdrawAmount} MTR`
      );
    }

    // Vault에서 출금
    await this.vault.withdraw(requesterFid, withdrawAmount);

    // 사용자 지갑으로 환불
    await this.wallet.receiveFromVault(requesterFid, withdrawAmount);

    return {
      requesterFid,
      canceledAmount: withdrawAmount,
      remainingVault: vaultBalance - withdrawAmount,
    };
  }

  /**
   * 잔액 조회 (FID 기반)
   */
  async getDepositBalance(fid: string) {
    const vaultBalance = await this.vault.getBalance(fid);
    const walletBalance = await this.wallet.getBalance(fid);

    return {
      fid,
      vaultBalance,    // Vault에 예치된 금액
      walletBalance,   // 지갑 잔액
    };
  }

  // ========== 리뷰 CRUD ==========

  async getReviewsByHash(reviewHash: string) {
    const items = await this.reviewRepo.find({
      where: { review_hash: reviewHash },
      order: { createdAt: 'DESC' },
    });

    return {
      items,
      total: items.length,
    };
  }

  async createReview(dto: CreateReviewDto) {
    const reviewRequest = await this.reviewRequestRepo.findOne({
      where: { id: dto.review_request_id },
    });

    if (!reviewRequest) {
      throw new NotFoundException(`Review request ${dto.review_request_id} not found`);
    }

    const review = this.reviewRepo.create({
      review_request_id: dto.review_request_id,
      review_hash: dto.review_hash,
      reviewer_user_id: dto.reviewer_user_id,
      reviewer_user_name: dto.reviewer_user_name,
      reviewer_user_profile_url: dto.reviewer_user_profile_url,
      reviewer_wallet_addr: dto.reviewer_wallet_addr,
      rating: dto.rating,
      summary: dto.summary,
      review_request: reviewRequest,
    });

    return this.reviewRepo.save(review);
  }
}