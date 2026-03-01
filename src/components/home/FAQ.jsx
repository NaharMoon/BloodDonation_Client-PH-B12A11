import SectionTitle from "../ui/SectionTitle";
import Container from "../ui/Container";

const FAQS = [
  {
    q: "Do I need an account to browse requests?",
    a: "You can browse pending requests publicly. To view full details and confirm a request as a donor, you need to login.",
  },
  {
    q: "How does request status work?",
    a: "New requests start as pending. After a donor confirms, it moves to inprogress, and finally done after donation is completed.",
  },
  {
    q: "Can an admin/volunteer edit donation requests?",
    a: "Admins/volunteers can manage requests and users based on role-based permissions. Regular donors can manage their own requests.",
  },
  {
    q: "Is my data secure?",
    a: "Protected routes use JWT-based authorization. Sensitive actions require login and role verification.",
  },
];

export default function FAQ() {
  return (
    <section className="section-pad">
      <SectionTitle
        badge="❓ FAQ"
        title="Common"
        highlight="questions"
        subtitle="Quick answers for first-time visitors."
        align="center"
      />

      <Container>
        <div className="mt-10 grid lg:grid-cols-2 gap-5">
          {FAQS.map((f, idx) => (
            <div key={f.q} className="card-soft p-0 overflow-hidden">
              <div className="collapse collapse-plus">
                <input type="radio" name="home-faq" defaultChecked={idx === 0} />
                <div className="collapse-title text-lg font-extrabold">{f.q}</div>
                <div className="collapse-content">
                  <p className="opacity-80 text-sm leading-relaxed pb-4">{f.a}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
