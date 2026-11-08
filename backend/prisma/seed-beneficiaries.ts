import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findUnique({ where: { email: 'admin@finbit.com' } });
  if (!user) return console.log('User not found');

  await prisma.beneficiary.createMany({
    data: [
      { ownerId: user.id, name: 'Rahul Sharma', email: 'rahul@example.com', accountNumber: 'ACC-9821' },
      { ownerId: user.id, name: 'Priya Singh', email: 'priya@example.com', accountNumber: 'ACC-4412' },
    ]
  });

  console.log('✅ Test Beneficiaries Added!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
