import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { TokenService } from '../src/blockchain/token.service';

describe('TokenController (e2e)', () => {
  let app: INestApplication;

    const mockTokenService: Pick<TokenService, 'sendTokens' | 'checkTokenBalance'> = {
      sendTokens: jest.fn().mockResolvedValue({ transactionHash: '0xhash' }) as any,
      checkTokenBalance: jest.fn().mockResolvedValue(true) as any,
    };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(TokenService)
      .useValue(mockTokenService)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /token/send', async () => {
    const payload = {
      address: '0x405ff2f6d7b9bc2ad28eee8edaca6ab045c63825',
      amount: 1,
    };

    await request(app.getHttpServer())
      .post('/token/send')
      .send(payload)
      .expect(201)
      .expect({ txHash: '0xhash' });

      expect(mockTokenService.sendTokens).toHaveBeenCalledWith(payload.address, payload.amount);
  });

  it('GET /token/balance/:address', async () => {
      (mockTokenService.checkTokenBalance as jest.Mock).mockResolvedValueOnce(false);

    const target = '0x405ff2f6d7b9bc2ad28eee8edaca6ab045c63825';

    await request(app.getHttpServer())
      .get(`/token/balance/${target}`)
      .expect(200)
      .expect({ hasToken: false });

    expect(mockTokenService.checkTokenBalance).toHaveBeenCalledWith(target);
  });
});
