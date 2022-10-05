import type { ActionFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Link, useCatch, useLoaderData } from "@remix-run/react";

export async function loader() {
  let res = await fetch("http://localhost:3000/api/users");
  if (res.status === 401) {
    throw new Response("You are not authorized", { status: 401 });
  }
  let users: any[] = await res.json();
  return json(users);
}

export const action: ActionFunction = async ({ request }) => {
  console.log("create a new userk");

  const formData = await request.formData();
  const name = formData.get("name");
  const email = formData.get("email");

  let res = await fetch("http://localhost:3000/api/users", {
    method: "post",
    body: JSON.stringify({ name, email }),
  });
  console.log("status", res.status);

  if (res.status === 401) {
    throw new Response("Unauthorized", { status: 401 });
  }
  console.log(await res.json());

  console.log({ name, email });
  return redirect("/");
};

export default function Index() {
  const users = useLoaderData<typeof loader>() ?? [];
  console.log(users);

  return (
    <div>
      <h1 className="text-3xl font-light">Welcome to Remix</h1>
      <div>
        <Form method="post" className="inline-flex gap-6 flex-col">
          <fieldset className="flex flex-col gap-2">
            <label htmlFor="name">Name</label>
            <input id="name" className="border" name="name" required />
          </fieldset>

          <fieldset className="flex flex-col gap-2">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              className="border"
              type={"email"}
              name={"email"}
              required
            />
          </fieldset>
          <button className="border" type="submit">
            Add User
          </button>
        </Form>
        {Array.isArray(users) &&
          users?.map((user) => (
            <div key={user.id}>
              {user.email} - {user.name}
            </div>
          ))}
      </div>
    </div>
  );
  }


export function CatchBoundary() {
  const caught = useCatch();
  console.log({ caught });

  if (caught.status === 401) {
    return (
      <div className="error-container">
        <p>You must be logged in to create a joke.</p>
        <Link to="/login">Login</Link>
      </div>
    );
  }
}
