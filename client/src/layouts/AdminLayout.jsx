// Implement the sidebar, that admin can easily navigate to admin routes
import { NavLink, Outlet } from "react-router-dom";

function AdminLayout() {
  const navItems = [
    { name: "Dashboard", path: "/admin/dashboard" },
    { name: "Add Train", path: "/admin/trains/add" },
    { name: "Manage Trains", path: "/admin/trains" },
    { name: "Create Schedule", path: "/admin/schedules/create" },
    { name: "Manage Stations", path: "/admin/stations" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 p-5 text-white">
        <h2 className="mb-8 text-2xl font-bold">Admin Panel</h2>

        <nav className="space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/admin/trains"}
              className={({ isActive }) =>
                `block rounded-lg px-4 py-3 transition ${
                  isActive
                    ? "bg-purple-600 text-white"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main Content Placeholder */}
      <main className="min-w-0 flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;
