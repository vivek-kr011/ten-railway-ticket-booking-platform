import { Link } from "react-router-dom";

const HomePage = () => {
  const quickActions = [
    {
      title: "Search Trains",
      description: "Find trains and check available schedules.",
      path: "/search",
      icon: "🚆",
      color: "blue",
    },
    {
      title: "My Bookings",
      description: "View and manage your train bookings.",
      path: "/my-bookings",
      icon: "🎫",
      color: "green",
    },
    {
      title: "Login / Signup",
      description: "Login or create an account to continue.",
      path: "/login",
      icon: "👤",
      color: "purple",
    },
  ];

  const features = [
    {
      title: "Easy Booking",
      description:
        "Book your train tickets quickly with a simple and user-friendly process.",
      icon: "⚡",
      color: "blue",
    },
    {
      title: "Secure Payment",
      description:
        "Make payments through a secure and reliable payment process.",
      icon: "🛡️",
      color: "green",
    },
    {
      title: "Easy Cancellation",
      description:
        "Manage your bookings and cancel tickets easily whenever required.",
      icon: "↻",
      color: "purple",
    },
  ];

  const iconStyles = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-emerald-100 text-emerald-600",
    purple: "bg-purple-100 text-purple-600",
  };

  const buttonStyles = {
    blue: "bg-blue-600 hover:bg-blue-700",
    green: "bg-emerald-500 hover:bg-emerald-600",
    purple: "bg-purple-600 hover:bg-purple-700",
  };

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* HERO SECTION */}
      <section className="relative isolate flex min-h-[480px] items-center overflow-hidden sm:min-h-[540px]">
        <img
          src="/Vande-Bharat.png"
          alt="Vande Bharat Express at sunset"
          className="absolute inset-0 -z-20 h-full w-full object-cover object-center"
        />

        {/* Dark overlay for readable text */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-slate-950/90 via-slate-900/65 to-slate-900/10" />

        <div className="mx-auto w-full max-w-7xl px-6 py-20 sm:px-10 lg:px-12">
          <div className="max-w-2xl">
            <span className="mb-5 inline-flex rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-sm font-medium text-white shadow-sm backdrop-blur-md">
              Your journey, made simpler
            </span>

            <h1 className="mb-6 text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
              Book Your Train
              <br />
              Journey <span className="text-blue-400">Easily</span>
            </h1>

            <p className="mb-8 max-w-xl text-base leading-7 text-slate-100 sm:text-lg sm:leading-8">
              Search trains, book tickets, manage your bookings, and enjoy a
              simple and secure railway booking experience.
            </p>

            <Link
              to="/search"
              className="inline-flex items-center gap-3 rounded-full bg-blue-600 px-7 py-3.5 font-semibold text-white shadow-lg shadow-blue-950/30 transition duration-300 hover:-translate-y-0.5 hover:bg-blue-500"
            >
              Search Trains
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* QUICK ACTIONS */}
      <section className="bg-white px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 text-center">
            <span className="rounded-full bg-blue-100 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-blue-700">
              Quick Actions
            </span>

            <h2 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">
              What would you like to do?
            </h2>

            <p className="mt-3 text-slate-600">
              Get started with the most common actions.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {quickActions.map((action) => (
              <Link
                key={action.title}
                to={action.path}
                className={`group relative overflow-hidden rounded-2xl border border-${action.color}-200 bg-gradient-to-br from-white to-${action.color}-50/50 p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl`}
              >
                <div
                  className={`mb-5 flex h-16 w-16 items-center justify-center rounded-2xl text-3xl ${iconStyles[action.color]}`}
                >
                  {action.icon}
                </div>

                <h3 className="mb-2 text-xl font-bold">
                  {action.title}
                </h3>

                <p className="max-w-xs leading-6 text-slate-600">
                  {action.description}
                </p>

                <div
                  className={`mt-5 flex h-10 w-10 items-center justify-center rounded-full text-xl text-white transition group-hover:translate-x-1 ${buttonStyles[action.color]}`}
                >
                  →
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="bg-gradient-to-b from-blue-50/80 to-white px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <span className="rounded-full bg-blue-100 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-blue-700">
              Why Choose Us?
            </span>

            <h2 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">
              A Better Way to Book Train Tickets
            </h2>

            <p className="mt-3 text-slate-600">
              We make your train journey simple, secure and hassle-free.
            </p>
          </div>

          <div className="grid gap-10 md:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl border border-slate-100 bg-white p-7 text-center shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div
                  className={`mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl text-3xl ${iconStyles[feature.color]}`}
                >
                  {feature.icon}
                </div>

                <h3 className="mb-3 text-xl font-bold">
                  {feature.title}
                </h3>

                <p className="leading-7 text-slate-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          {/* TRAVEL BANNER */}
          <div className="relative isolate mt-16 overflow-hidden rounded-3xl">
            <img
              src="/Vande-Bharat.png"
              alt="Vande Bharat Express"
              className="absolute inset-0 -z-20 h-full w-full object-cover object-center"
            />

            <div className="absolute inset-0 -z-10 bg-gradient-to-r from-blue-950/95 via-blue-950/75 to-blue-950/25" />

            <div className="flex flex-col gap-6 px-7 py-10 sm:px-10 sm:py-12 md:flex-row md:items-center md:justify-between">
              <div className="max-w-xl">
                <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white backdrop-blur-sm">
                  Travel Smart
                </span>

                <h2 className="mt-4 text-3xl font-bold text-white sm:text-4xl">
                  Your Next Journey Awaits
                </h2>

                <p className="mt-3 leading-7 text-blue-50">
                  Book your next train journey with a smoother and simpler
                  booking experience.
                </p>
              </div>

              <Link
                to="/search"
                className="inline-flex shrink-0 items-center justify-center gap-3 rounded-full bg-white px-6 py-3.5 font-semibold text-blue-700 shadow-lg transition hover:bg-blue-50"
              >
                Search Trains
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-950 px-6 py-7 text-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 sm:flex-row">
          <Link to="/" className="text-lg font-bold tracking-tight">
            🚆 Ticket Booking System
          </Link>

          <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-300">
            <Link to="/" className="transition hover:text-white">
              Home
            </Link>

            <Link to="/search" className="transition hover:text-white">
              Search Trains
            </Link>

            <Link to="/my-bookings" className="transition hover:text-white">
              My Bookings
            </Link>
          </div>

          <p className="text-center text-xs text-slate-400">
            © {new Date().getFullYear()} Ticket Booking System.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;