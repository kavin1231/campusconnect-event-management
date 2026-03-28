import { Link } from "react-router-dom";

const Unauthorized = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background-dark text-slate-100">
      <div className="max-w-md w-full px-6 py-8 bg-neutral-dark/60 border border-neutral-border rounded-2xl text-center">
        <h1 className="text-3xl font-black mb-4">Access Denied</h1>
        <p className="text-slate-300 mb-6">
          You don't have permission to view this page. If you think this is a
          mistake, please contact your system administrator.
        </p>
        <div className="flex flex-col gap-3">
          <Link
            to="/dashboard"
            className="w-full py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 transition"
          >
            Go to Dashboard
          </Link>
          <Link
            to="/"
            className="w-full py-3 rounded-xl border border-neutral-border text-slate-200 hover:bg-neutral-dark/60 transition"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
