import { SELLERS } from "@/constants/seller-data";
import { prisma } from "@/prisma";
import { UserRole } from "@/types/roles";
import bcrypt from "bcryptjs";

const roles = [UserRole.SELLER, UserRole.ADMIN];
const platforms = ["Shopee", "Tiktok"]
const itemCategories = [
  {
    name: "Blazer",
    color: "from-red-500 to-rose-500",
    icon: "👔",
    quickPrices: [99, 149, 179, 199]
  },
  {
    name: "Blouse",
    color: "from-pink-500 to-red-500",
    icon: "🧥",
    quickPrices: [39, 59, 79, 99]
  },
  {
    name: "Others",
    color: "from-red-600 to-rose-600",
    icon: "🧥",
    quickPrices: [249, 299, 349, 399]
  },
]

async function main() {
  for (const role of roles) {
    await prisma.role.upsert({
      where: { roleName: role },
      update: {}, // do nothing if exists
      create: { roleName: role },
    });
  }
  console.log("✅ Roles seeded successfully.");

  for (const platform of platforms) {
    await prisma.platform.upsert({
      where: { name: platform },
      update: {}, // do nothing if exists
      create: { name: platform },
    });
  }
  console.log("✅ Platforms seeded successfully.");


  for (const category of itemCategories) {
    await prisma.itemCategory.upsert({
      where: { name: category.name },
      update: {},
      create: { ...category }
    })
  }
  console.log("✅ Categories seeded successfully.");


  const adminRole = await prisma.role.findUnique({ where: { roleName: UserRole.ADMIN } });
  const sellerRole = await prisma.role.findUnique({ where: { roleName: UserRole.SELLER } });

  const password = await bcrypt.hash("password", 10); // Use secure env var in production

  // Head Admin
  const admin = await prisma.user.upsert({
    where: { email: "admin@gmail.com" },
    update: {},
    create: {
      email: "admin@gmail.com",
      name: "Admin",
      roleId: adminRole!.id,
      hashedPassword: password,
      isActive: true,
      isOnboarded: true,
      emailVerified: new Date()
    },
  });

  for (const user of SELLERS) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: {
        email: user.email,
        name: user.name,
        roleId: sellerRole!.id,
        hashedPassword: password,
        isActive: true,
        isOnboarded: true,
        emailVerified: new Date(),
        userProfile: {
          create: {
            rate: user.rate,
            color: "bg-rose-500"
          }
        }
      },
    });
  }

  await prisma.adminProfile.upsert({
    where: { userId: admin.id },
    update: {},
    create: {
      userId: admin.id
    },
  });

  await prisma.userPreferences.upsert({
    where: { userId: admin.id },
    update: {},
    create: {
      userId: admin.id,
      theme: "dark"
    }
  })

  console.log("✅ Admin user seeded successfully.");
  console.log("✅ Seller user seeded successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
