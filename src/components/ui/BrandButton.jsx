import { Link } from "react-router-dom";

/**
 * Reusable brand button.
 *
 * Usage:
 *  <BrandButton to="/register">Join</BrandButton>
 *  <BrandButton variant="outline" to="/find-blood">Search</BrandButton>
 *  <BrandButton as="button" onClick={...}>Click</BrandButton>
 */
export default function BrandButton({
  to,
  as = "link",
  variant = "solid", // solid | outline | ghost
  className = "",
  children,
  ...rest
}) {
  const base =
    variant === "outline"
      ? "btn-brand-outline"
      : variant === "ghost"
        ? "btn btn-ghost rounded-2xl"
        : "btn-brand";

  if (as === "button") {
    return (
      <button className={`${base} ${className}`} {...rest}>
        {children}
      </button>
    );
  }

  return (
    <Link to={to || "#"} className={`${base} ${className}`} {...rest}>
      {children}
    </Link>
  );
}
