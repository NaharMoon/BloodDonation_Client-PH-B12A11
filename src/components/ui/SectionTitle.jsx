import Container from "./Container";

export default function SectionTitle({
  badge,
  title,
  highlight,
  subtitle,
  align = "left", // left | center
  actions,
}) {
  const isCenter = align === "center";

  return (
    <Container>
      <div className={`${isCenter ? "text-center" : ""} max-w-3xl ${isCenter ? "mx-auto" : ""}`}>
        {badge ? (
          <p className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold text-sm ${isCenter ? "mx-auto" : ""}`}>
            {badge}
          </p>
        ) : null}

        <h2 className="mt-4 text-3xl md:text-4xl font-extrabold leading-tight">
          {title} {highlight ? <span className="text-primary">{highlight}</span> : null}
        </h2>

        {subtitle ? <p className="mt-3 opacity-80">{subtitle}</p> : null}

        {actions ? <div className={`mt-6 flex flex-wrap gap-3 ${isCenter ? "justify-center" : ""}`}>{actions}</div> : null}
      </div>
    </Container>
  );
}
