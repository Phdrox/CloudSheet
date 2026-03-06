import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap(req, res) {
  const app = await NestFactory.create(AppModule,{
    bodyParser:false
  });

  await app.enableCors({
    origin:[process.env.URL_ORIGIN],
    methods:'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials:true
  })
  await app.init();
  return app.getHttpAdapter().getInstance()(req, res);

}

