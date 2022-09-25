import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export async function loader() {
  let res = await fetch("http://localhost:3000/api/users");
  let users: any[] = await res.json();
  return json(users);
}

export default function Index() {
  const users = useLoaderData<typeof loader>();
  return (
    <div>
      <h1 className="text-3xl font-light">Welcome to Remix</h1>
      {users.map((user) => (
        <div key={user.id}>
          {user.email} - {user.name}
        </div>
      ))}
    </div>
  );
}
