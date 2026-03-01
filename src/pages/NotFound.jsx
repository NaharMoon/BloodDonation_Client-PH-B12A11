import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] grid place-items-center px-4">
      <div className="text-center card-soft p-10 max-w-xl">
        <p className="text-6xl">🩸</p>
        <h1 className="text-3xl font-extrabold mt-4">Page not found</h1>
        <p className="opacity-75 mt-2">The page you’re looking for doesn’t exist.</p>
        <Link to="/" className="btn-brand mt-6 inline-flex">
          Back to Home
        </Link>
      </div>
    </div>
  );
}
