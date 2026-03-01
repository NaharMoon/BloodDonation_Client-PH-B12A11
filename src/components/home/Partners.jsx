import SectionTitle from "../ui/SectionTitle";
import Container from "../ui/Container";
import heartSpring from "../../assets/Ellipse 8.png"

const PARTNERS = [
  "City Hospital",
  "Red Crescent",
  "HealthCare BD",
  "Blood Bank",
  "Emergency Wing",
  "KUET Medical Center",
];

export default function Partners() {
  return (
    <section className="section-pad">
      <SectionTitle
        badge="🏥 Trusted"
        title="Supported by"
        highlight="organizations"
        subtitle="A simple partner strip — you can replace these names with real hospitals/NGOs later."
        align="center"
      />

      <Container>
        <div className="mt-10 card-soft p-8 md:p-10">
          <div className="flex flex-wrap items-center justify-center gap-3">
            {PARTNERS.map((p) => (
              <div
                key={p}
                className="px-5 py-3 rounded-2xl bg-base-200/70 border border-base-300 text-sm font-semibold"
              >
                <img className="h-10" src={heartSpring} alt="" />
                {p}
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-3xl p-6 bg-primary/10 border border-primary/15">
            <p className="text-sm md:text-base opacity-85 text-center">
              Want to collaborate? Add your organization and help connect more donors with people in need.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
