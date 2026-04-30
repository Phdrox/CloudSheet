import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: true
  });
  app.use(cookieParser())

  app.enableCors({
    origin: ["https://cloud-sheet.vercel.app","https://cloudsheet.vercel.app"],
    methods: ['GET','HEAD','PUT','PATCH','POST','DELETE','OPTIONS'],
    credentials: true,
    allowedHeaders: [
      'Content-Type', 
      'Authorization', 
      'Accept', 
      'Origin', 
      'X-Requested-With',
    ],
    exposedHeaders: ['set-cookie'],
  });

  if (process.env.NODE_ENV !== 'production') {
    await app.listen(process.env.PORT ?? 3001);
  }

  await app.init();
  
  const expressApp = app.getHttpAdapter().getInstance();
  return expressApp;
}

export default bootstrap();