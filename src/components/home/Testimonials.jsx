import SectionTitle from "../ui/SectionTitle";
import Container from "../ui/Container";

const TESTIMONIALS = [
  {
    name: "Afsana Rahman",
    role: "Donor",
    text: "I found a request near my area quickly. The dashboard status updates made everything clear.",
    emoji: "🩸",
  },
  {
    name: "Mehedi Hasan",
    role: "Volunteer",
    text: "Simple UI and role-based access helped us manage requests without confusion.",
    emoji: "🤝",
  },
  {
    name: "Nabila Ahmed",
    role: "Requester",
    text: "Posting a request took less than a minute. We got a donor contact fast. Alhamdulillah.",
    emoji: "🙏",
  },
];

export default function Testimonials() {
  return (
    <section className="section-pad">
      <SectionTitle
        badge="💬 Real stories"
        title="People"
        highlight="love"
        subtitle="A few words from donors, volunteers and requesters who used the platform."
        align="center"
      />

      <Container>
        <div className="mt-10 grid md:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="card-soft p-7">
              <div className="flex items-center justify-between">
                <div className="text-3xl">{t.emoji}</div>
                <span className="badge badge-outline border-primary/30 text-primary">{t.role}</span>
              </div>

              <p className="mt-5 text-sm md:text-base opacity-85 leading-relaxed">“{t.text}”</p>

              <div className="mt-6 flex items-center gap-3">
                <div className="h-11 w-11 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-extrabold">
                  {t.name.slice(0, 1)}
                </div>
                <div>
                  <p className="font-extrabold leading-tight">{t.name}</p>
                  <p className="text-xs opacity-70">Verified user feedback</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
