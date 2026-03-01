import Hero from "../components/home/Hero";
import Stats from "../components/home/Stats";
import HowItWorks from "../components/home/HowItWorks";
import UrgentRequests from "../components/home/UrgentRequests";
import Featured from "../components/home/Featured";
import Testimonials from "../components/home/Testimonials";
import FAQ from "../components/home/FAQ";
import Partners from "../components/home/Partners";
import ContactUs from "../components/home/ContactUs";
import HeartSpring from "../components/home/HeartSpring";

export default function Home() {
  return (
    <div className="page-bg">
      <Hero />
      <Stats />
      <HowItWorks />
      <HeartSpring></HeartSpring>
      <UrgentRequests />
      <Featured />
      <Testimonials />
      <FAQ />
      <Partners />
      <ContactUs />
    </div>
  );
}
