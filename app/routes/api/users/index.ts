import { PrismaClient } from "@prisma/client";
import type {
  ActionFunction,
  AppData,
  DataFunctionArgs,
  LoaderFunction,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import { verify } from "jsonwebtoken";
import { promisify } from "util";

const prisma = new PrismaClient();
const verifyPromise: (arg1, arg2) => Promise<any> = promisify(verify);

function withUser(
  callback: (
    args: DataFunctionArgs,
    user: any
  ) => Promise<Response> | Promise<AppData>
): (args: DataFunctionArgs) => Promise<Response> | Promise<AppData> {
  return (args: DataFunctionArgs) =>
    new Promise(async (resolve, reject) => {
      const token =
        args.request.headers.get("Authorization")?.split(" ")?.[1] ?? "";
      console.log(token);

      try {
        const result = await verifyPromise(token, "secret");
        console.log(result);
        return resolve(callback(args, result));
      } catch (error) {
        reject(
          json(
            { message: "Unauthorized" },
            {
              status: 401,
              statusText: "Unauthorized",
              headers: {
                "Content-Type": "application/json",
              },
            }
          )
        );
      }
    });
}

export const loader: LoaderFunction = withUser(async (request, user) => {
  console.log({ request, user });
  const users = await prisma.user.findMany();
  return new Response(JSON.stringify(users), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
});

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
