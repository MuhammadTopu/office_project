import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function test() {
  try {
    await prisma.user.create({
      data: {
        name: 'Alice',
        email: 'alice@prisma.com',
        password: 'asdas',
      },
    });
    console.log('"User created successfully!"');
  } catch (error) {
    console.error('"Error creating user:"', error);
  } finally {
    await prisma.$disconnect();
  }
}

test();
