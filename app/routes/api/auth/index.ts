import { PrismaClient } from "@prisma/client";
import type { ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { sign } from "jsonwebtoken";
import util from "util";

const prisma = new PrismaClient();

export const action: ActionFunction = async ({ request }) => {
  switch (request.method) {
    case "POST": {
      console.log("Authenticate an user");
      const promisyfSign = util.promisify(sign);
      const token = await promisyfSign(
        { exp: Math.floor(Date.now() / 1000) + 60 * 60, data: "foobar" },
        "secret"
      );

      return json({ token: "this is token", test: token }, { status: 201 });

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
