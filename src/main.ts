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

  // Opcional: Apenas executa listen se não estiver na Vercel
  if (process.env.NODE_ENV !== 'production') {
    await app.listen(process.env.PORT ?? 3001);
  }

  await app.init();
  
  // Retorna a instância para o adaptador da Vercel
  const expressApp = app.getHttpAdapter().getInstance();
  return expressApp;
}

// Exporta a promessa para que o vercel.json consiga consumir
export default bootstrap();