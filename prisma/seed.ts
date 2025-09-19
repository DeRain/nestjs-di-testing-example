import { PrismaClient } from '@prisma/client';

async function main() {
  const prisma = new PrismaClient();
  try {
    await prisma.query.create({ data: { address: '0x0000000000000000000000000000000000000000', chainId: 31337, resultWei: '0' } });
    await prisma.query.create({ data: { address: '0x0000000000000000000000000000000000000001', chainId: 31337, resultWei: '0' } });
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  // eslint-disable-next-line no-console
  console.error(e);
  process.exit(1);
});


