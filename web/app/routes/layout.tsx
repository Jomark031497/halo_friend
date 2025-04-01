import { Link, NavLink, Outlet } from "react-router";
import { FiLogOut } from "react-icons/fi";
import { MdDashboard } from "react-icons/md";
import { BsPatchCheckFill } from "react-icons/bs";
import { FaUser } from "react-icons/fa";
import clsx from "clsx";

const Navbar = () => {
  return (
    <header className="bg-primary flex h-16 items-center justify-between px-6 text-white">
      <Link to="/" className="text-2xl">
        hello-friend
      </Link>

      <button className="text-2xl">
        <FiLogOut />
      </button>
    </header>
  );
};

const Sidebar = () => {
  return (
    <aside className="hidden h-[calc(100vh-64px)] w-64 border-r border-gray-200 bg-white md:block">
      <div className="flex flex-col items-center gap-2 border-b border-gray-200 p-4">
        <div className="flex h-15 w-15 items-center justify-center rounded-full bg-gray-400 text-2xl text-white">
          JP
        </div>
        <Link to="/">Jomark Pangan</Link>
      </div>

      <div>
        <ul className="flex flex-col gap-4 p-6">
          {[
            {
              label: "Dashboard",
              icon: <MdDashboard />,
              link: "/",
            },
            {
              label: "Profile",
              icon: <FaUser />,
              link: "/profile",
            },
            {
              label: "Membership",
              icon: <BsPatchCheckFill />,
              link: "/membership",
            },
          ].map((item) => (
            <li key={item.label}>
              <NavLink
                to={item.link}
                className={({ isActive }) =>
                  clsx(
                    "text-md flex items-center gap-2",
                    isActive ? "text-primary" : "text-gray-500",
                  )
                }
              >
                {item.icon}
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};

const Layout = () => {
  return (
    <>
      <Navbar />
      <div className="block md:flex">
        <Sidebar />
        <main className="grow p-4">
          <Outlet />
        </main>
      </div>
    </>
  );
};

export default Layout;
