import { PrismaClient, RentalPeriod, TransactionType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const { faker } = await import("@faker-js/faker");

  console.log("🌱 Seeding database...");

  // --- Create Users ---
  const users = await Promise.all(
    Array.from({ length: 3 }).map(() =>
      prisma.user.create({
        data: {
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          email: faker.internet.email(),
          phoneNumber: faker.phone.number(),
          password: faker.internet.password({ length: 12 }),
          address: faker.location.streetAddress(),
        },
      })
    )
  );

  console.log(`👤 Created ${users.length} users`);

  // --- Create Products ---
  const products = await Promise.all(
    Array.from({ length: 20 }).map(() => {
      const owner = faker.helpers.arrayElement(users);

      return prisma.product.create({
        data: {
          title: faker.commerce.productName(),
          categories: faker.commerce.department(),
          description: faker.commerce.productDescription(),
          purchasePrice: parseFloat(
            faker.commerce.price({ min: 50, max: 1000 })
          ),
          rentPrice: parseFloat(faker.commerce.price({ min: 10, max: 200 })),
          rentalPeriod: faker.helpers.arrayElement(Object.values(RentalPeriod)),
          ownerId: owner.id,
        },
      });
    })
  );

  console.log(`📦 Created ${products.length} products`);

  // --- Create Transactions ---
  const transactions = await Promise.all(
    Array.from({ length: 5 }).map(() => {
      const product = faker.helpers.arrayElement(products);
      const customer = faker.helpers.arrayElement(
        users.filter((u) => u.id !== product.ownerId)
      );

      const rentStart = faker.date.recent({ days: 20 });
      const rentEnd = new Date(
        rentStart.getTime() +
          faker.number.int({ min: 1, max: 14 }) * 24 * 60 * 60 * 1000
      );

      return prisma.transaction.create({
        data: {
          productId: product.id,
          customerId: customer.id,
          transactionType: faker.helpers.arrayElement(
            Object.values(TransactionType)
          ),
          rentTimeFrom: rentStart,
          rentTimeTo: rentEnd,
        },
      });
    })
  );

  console.log(`💳 Created ${transactions.length} transactions`);
  console.log("✅ Seeding complete!");
}

// Run seeding
main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
