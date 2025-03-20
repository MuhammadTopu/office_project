import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaClient } from '@prisma/client';
import { ValidationPipe } from '@nestjs/common';

const prisma = new PrismaClient();

async function conn() {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const user = await prisma.user.findMany();
    // console.log(user);
    console.log('Connected to Prisma successfully');
  } catch (error) {
    console.error('Prisma connection error:', error);
  }
}
conn(); // Connect to Prisma

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      'http://localhost:5173',
      'https://task-management-jx19481ri-kamran-hossain-topus-projects.vercel.app',
      'https://task-management-gray-ten.vercel.app',
      'https://task-management-git-main-kamran-hossain-topus-projects.vercel.app',
      'https://task-management-kamran-hossain-topus-projects.vercel.app',
    ],
    allowedHeaders: ['Content-Type', 'Authorization', 'id'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  });

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
