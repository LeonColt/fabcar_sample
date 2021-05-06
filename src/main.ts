import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get( ConfigService );

  const documentationOptions = new DocumentBuilder()
        .setTitle("FAB CAR")
        .setDescription("FAB CAR Backend Documentation")
        .setVersion("0.0.1")
        .setContact( 'LC', null, 'riyanto.1230.2828@gmail.com' )
        .addBearerAuth({
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
            in: 'header'
        } )
        .build();

    const documentation = SwaggerModule.createDocument( app, documentationOptions );
    SwaggerModule.setup( "docs", app, documentation );

  await app.listen(+configService.get('PORT'));
}
bootstrap();
