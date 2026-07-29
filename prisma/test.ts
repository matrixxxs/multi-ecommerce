import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({
  adapter,
});

async function main() {
  const admin = await prisma.admin_users.findUnique({
    where: { email: "aderupokoolamiposi@gmail.com" }, // use a real email from your DB
  });

  console.log(admin);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
