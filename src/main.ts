import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaClient } from '@prisma/client';
import { ValidationPipe } from '@nestjs/common';

const prisma = new PrismaClient();

async function conn() {
  try {
    const user = await prisma.user.findMany();
    console.log(user);
    console.log('Connected to Prisma successfully');
  } catch (error) {
    console.error('Prisma connection error:', error);
  }
}
conn(); // Connect to Prisma

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ Enable CORS to allow frontend requests
  app.enableCors({
    origin: 'http://localhost:5173', // Your frontend URL
    allowedHeaders: ['Content-Type', 'Authorization', 'id'], // Include 'id' header
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  });

  // ✅ Global Validation Pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`🚀 Server is running on http://localhost:${port}`);
}
bootstrap();
