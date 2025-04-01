import { Link } from "react-router";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Dashboard | hello.friend" },
    { name: "description", content: "Welcome hello.friend, How are you?" },
  ];
}

const appointments = [];

export default function Home() {
  return (
    <>
      <h1 className="mb-8 text-2xl font-semibold">Welcome, Jomark!</h1>

      <section className="rounded border border-gray-200 bg-white p-4">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-500">Upcoming Appointments</h2>
          <Link to="/" className="bg-primary rounded p-2 px-3 text-sm font-semibold text-white">
            BOOK SESSION
          </Link>
        </div>

        {appointments.length ? (
          <div>show appointments</div>
        ) : (
          <p className="text-sm">You have no appointments.</p>
        )}
      </section>
    </>
  );
}
