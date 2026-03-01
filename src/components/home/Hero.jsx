import Container from "../ui/Container";
import { Link } from "react-router-dom";
import heroImg from "../../assets/Gradient Panel.png"; // zip এ আছে

export default function Hero() {
  return (
    <section className="section-pad">
      <Container className="">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          {/* Left */}
          <div className="text-base-content">
            <p className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold text-sm">
              🩸 Blood Donation Platform
            </p>

            <h1 className="mt-5 text-4xl md:text-5xl font-extrabold leading-tight text-base-content">
              Save Life. <span className="text-primary">Donate Blood</span>
              <br /> Find Donors in Minutes.
            </h1>

            <p className="mt-5 text-base md:text-lg opacity-85 max-w-xl">
              Clean, fast and trustworthy blood donation experience — focused on real needs, real people.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link to="/register" className="btn-brand">
                Join as a Donor →
              </Link>
              <Link to="/find-blood" className="btn-brand-outline">
                Search Donors
              </Link>
            </div>

            <div className="mt-8 flex items-center gap-4 text-sm opacity-75">
              <span className="badge badge-outline border-primary/40">Secure</span>
              <span className="badge badge-outline border-primary/40">Role Based</span>
              <span className="badge badge-outline border-primary/40">Fast Search</span>
            </div>
          </div>

          {/* Right */}
          <div className="relative">
            <div className="card-soft p-6 brand-shadow">
              <div className="rounded-3xl overflow-hidden">
                <img src={heroImg} alt="hero" className="w-full h-[380px] object-cover" />
              </div>

              <div className="mt-5 grid sm:grid-cols-2 gap-3">
                <div className="card-soft p-4">
                  <p className="text-sm opacity-70">Pending Requests</p>
                  <p className="text-2xl font-extrabold text-primary">24+</p>
                </div>
                <div className="card-soft p-4">
                  <p className="text-sm opacity-70">Active Donors</p>
                  <p className="text-2xl font-extrabold text-primary">120+</p>
                </div>
              </div>
            </div>

            <div className="absolute -z-10 -top-10 -right-10 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
          </div>
        </div>
      </Container>
    </section>
  );
}
