import Container from "../ui/Container";

const items = [
  { title: "Fast Search", desc: "Find donors by blood group & location." },
  { title: "Verified Flow", desc: "Request → Confirm → In Progress → Done." },
  { title: "Role Based", desc: "Admin, Volunteer and Donor dashboard." },
];

export default function Stats() {
  return (
    <section className="pb-10">
      <Container>
        <div className="grid md:grid-cols-3 gap-5">
          {items.map((x) => (
            <div key={x.title} className="card-soft p-6">
              <p className="text-lg font-bold text-primary">{x.title}</p>
              <p className="mt-2 text-sm opacity-75">{x.desc}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
