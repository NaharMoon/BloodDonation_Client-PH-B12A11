import Swal from "sweetalert2";
import Container from "../ui/Container";
import heartSpring from "../../assets/pngwing 1.png"
import { toast } from "react-toastify";

export default function ContactUs() {
  const handleContact = (e) => {
    e.preventDefault();
    // alert("contact!");
    toast('Please stay tuned. Thank You!');
  }
  return (
    <section className="pb-20">
      <Container>
        <div className="grid lg:grid-cols-2 gap-8 items-stretch">
          <div className="card-soft p-8">
            <h3 className="text-2xl font-extrabold">Contact Us</h3>
            <p className="mt-2 opacity-75">Have questions or need urgent support? Send a message.</p>

            <form onSubmit={handleContact}
              className="mt-6 space-y-3">
              <input className="input-brand" placeholder="Your Name" />
              <input className="input-brand" placeholder="Your Email" />
              <textarea className="input-brand min-h-32" placeholder="Message" />
              <button type="submit" className="btn-brand w-full">Send Message</button>
            </form>
          </div>

          <div className="card-soft p-8">
            <h3 className="text-2xl font-extrabold">Hotline</h3>
            <p className="mt-2 opacity-75">We respond quickly for emergency cases.</p>

            <div className="mt-6 space-y-3">
              <div className="p-5 rounded-3xl bg-primary/5 border border-primary/15">
                <p className="text-sm opacity-70">Phone</p>
                <p className="text-xl font-extrabold text-primary">+880 1XXXXXXXXX</p>
              </div>
              <div className="p-5 rounded-3xl bg-primary/5 border border-primary/15">
                <p className="text-sm opacity-70">Email</p>
                <p className="text-xl font-extrabold text-primary">support@bloodbond.com</p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
