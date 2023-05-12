import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Authentication System', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('handles a signup request', async () => {
    const email = 'minhtest123@gmail.com';
    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email, password: '123456789' })
      .expect(201)
      .then((res) => {
        expect(res.body.id).toBeDefined();
        expect(res.body.email).toEqual(email);
      });
  });

  it('handles a signin request', async () => {
    const email = 'minhtest123@gmail.com';
    const result = await request(app.getHttpServer())
      .post('/auth/signin')
      .send({ email, password: '123456789' })
      .expect(201);
    const cookie = result.get('Set-Cookie');

    const { body } = await request(app.getHttpServer())
      .get('/auth/me')
      .set('Cookie', cookie)
      .expect(200);
    expect(body[0].email).toEqual(email);
    expect(body[0].id).toBeDefined();
  });
});
