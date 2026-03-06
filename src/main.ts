import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: false
  });

  app.enableCors({
    origin: [process.env.URL_ORIGIN],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true
  });

  // Opcional: Apenas executa listen se não estiver na Vercel
  if (process.env.NODE_ENV !== 'production') {
    await app.listen(process.env.PORT ?? 3000);
  }

  await app.init();
  
  // Retorna a instância para o adaptador da Vercel
  const expressApp = app.getHttpAdapter().getInstance();
  return expressApp;
}

// Exporta a promessa para que o vercel.json consiga consumir
export default bootstrap();