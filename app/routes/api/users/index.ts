import { PrismaClient } from "@prisma/client";
import { ActionFunction, json } from "@remix-run/node";

const prisma = new PrismaClient();

export async function loader() {
  const users = await prisma.user.findMany();
  return new Response(JSON.stringify(users), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export const action: ActionFunction = async ({ request }) => {
  switch (request.method) {
    case "POST": {
      console.log("Create new user");
      const result = await request.json();
      console.log(result);
      const user = await prisma.user.create({
        data: { name: result.name, email: result.email },
        select: { name: true, id: true, email: true },
      });
      return json(user, { status: 201 });

      /* handle "POST" */
    }
    case "PUT": {
      /* handle "PUT" */
    }
    case "PATCH": {
      /* handle "PATCH" */
    }
    case "DELETE": {
      /* handle "DELETE" */
    }
  }
};
