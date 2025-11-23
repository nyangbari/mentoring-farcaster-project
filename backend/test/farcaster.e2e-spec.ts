import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import axios from 'axios';
import { AppModule } from '../src/app.module';

jest.mock('axios');

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('FarcasterController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    mockedAxios.get.mockResolvedValue({
      data: {
        cast: {
          author: { fid: 1 },
          text: 'hello',
          embeds: [],
          timestamp: '2024-01-01T00:00:00Z',
        },
      },
    });

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /farcaster/cast returns remote payload', async () => {
    await request(app.getHttpServer())
      .get('/farcaster/cast?fid=1&hash=0xabc')
      .expect(200)
      .expect({
        author: { fid: 1 },
        text: 'hello',
        embeds: [],
        timestamp: '2024-01-01T00:00:00Z',
      });

    expect(mockedAxios.get).toHaveBeenCalledWith(
      'https://hub-api.farcaster.xyz/v1/cast?fid=1&hash=0xabc',
    );
  });
});
