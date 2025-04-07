import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Seed Admin
  await prisma.admin.upsert({
    where: { id: "admin-1" },
    update: {},
    create: {
      id: "admin-1",
      username: "admin_user",
    },
  });

  // Seed Clients
  const client1 = await prisma.client.create({
    data: {
      name: "Client A",
    },
  });
  const client2 = await prisma.client.create({
    data: {
      name: "Client B",
    },
  });

  // Seed Positions
  await prisma.position.createMany({
    data: [
      {
        symbol: "AAPL",
        quantity: 10,
        cost_basis: 150.5,
        clientId: client1.id,
      },
      {
        symbol: "GOOGL",
        quantity: 5,
        cost_basis: 2800.75,
        clientId: client2.id,
      },
    ],
  });

  // Seed Market Data
  await prisma.marketData.createMany({
    data: [
      { symbol: "AAPL", current_price: 155.2 },
      { symbol: "GOOGL", current_price: 2900.1 },
    ],
  });

  // Seed Margins
  await prisma.margin.createMany({
    data: [
      {
        clientId: client1.id,
        margin_requirement: 5000.0,
        loan: 2000.0,
      },
      {
        clientId: client2.id,
        margin_requirement: 7000.0,
        loan: 3000.0,
      },
    ],
  });
}

main()
  .then(() => {
    console.log("Seeding complete");
  })
  .catch((e) => {
    console.error("Error seeding database", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
