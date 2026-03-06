import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule,{
    bodyParser:false
  });

  await app.enableCors({
    origin:[process.env.URL_ORIGIN],
    methods:'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials:true
  })
  await app.listen(process.env.PORT ?? 3000);

}
bootstrap();
