import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('password123', 10);

  const user = await prisma.user.upsert({
    where: { email: 'admin@finbit.com' },
    update: {},
    create: {
      email: 'admin@finbit.com',
      name: 'Aryan Thakur',
      password: passwordHash,
      accounts: {
        create: {
          accountNumber: 'ACC-1001',
          balance: 12459200, // $124,592.00 in paise
          currency: 'USD',
        }
      }
    }
  });

  console.log('✅ Test User Created:', user.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => await prisma.$disconnect());
