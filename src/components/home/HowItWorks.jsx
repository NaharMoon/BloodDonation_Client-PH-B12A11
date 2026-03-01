import SectionTitle from "../ui/SectionTitle";
import Container from "../ui/Container";

const STEPS = [
  {
    title: "Create a Request",
    desc: "Post recipient details (blood group, location, date & time) — in less than a minute.",
    icon: "📝",
  },
  {
    title: "Find a Donor",
    desc: "Search donors by blood group and location, or browse pending requests.",
    icon: "🔎",
  },
  {
    title: "Confirm & Donate",
    desc: "Donor confirms the request, visits the hospital, then marks donation completed.",
    icon: "🩸",
  },
  {
    title: "Track Status",
    desc: "Requests move from pending → inprogress → done, keeping everything transparent.",
    icon: "✅",
  },
];

export default function HowItWorks() {
  return (
    <section className="section-pad">
      <SectionTitle
        badge="⚡ Simple flow"
        title="How"
        highlight="it works"
        subtitle="No clutter — just the essential steps to connect donors with real people in need."
        align="center"
      />

      <Container>
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {STEPS.map((s, idx) => (
            <div key={s.title} className="card-soft p-6">
              <div className="flex items-center justify-between">
                <div className="text-3xl">{s.icon}</div>
                <div className="badge badge-outline border-primary/30 text-primary">
                  Step {idx + 1}
                </div>
              </div>
              <h3 className="mt-4 text-lg font-extrabold">{s.title}</h3>
              <p className="mt-2 text-sm opacity-80">{s.desc}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
