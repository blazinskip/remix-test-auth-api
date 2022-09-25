import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function loader() {
  console.log("it was called");

  const users = await prisma.user.findMany();
  return new Response(JSON.stringify(users), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
