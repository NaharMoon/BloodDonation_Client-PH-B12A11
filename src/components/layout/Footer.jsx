import Container from "../ui/Container";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="mt-16 bg-primary">
      <div className="glass border-t">
        <Container className="py-10">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2">
                <div className="h-9 w-9 rounded-full grid place-items-center brand-grad">
                  <span className="text-white">🩸</span>
                </div>
                <p className="font-extrabold text-lg text-secondary">Blood<span className="text-primary">Bond</span></p>
              </div>
              <p className="text-sm opacity-75 mt-3">
                A simple, fast and reliable blood donation platform.
              </p>
            </div>

            <div>
              <p className="font-bold text-lg mb-3 text-secondary">Quick Links</p>
              <div className="flex flex-col gap-2 text-sm">
                <Link to="/donation-requests" className="hover:underline hover:text-primary">Donation Requests</Link>
                <Link to="/find-blood" className="hover:underline hover:text-primary">Search Donors</Link>
                <Link to="/about" className="hover:underline hover:text-primary">About</Link>
              </div>
            </div>

            <div>
              <p className="font-bold text-lg mb-3 text-secondary">Contact</p>
              <p className="text-sm opacity-75">Hotline: +880 1XXXXXXXXX</p>
              <p className="text-sm opacity-75">Email: support@bloodbond.com</p>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-base-300 text-sm opacity-70 flex flex-col md:flex-row gap-2 md:items-center md:justify-between">
            <p>© {new Date().getFullYear()} BloodBond. All rights reserved.</p>
            <p>Made with ❤️ in Lives.</p>
          </div>
        </Container>
      </div>
    </footer>
  );
}

//////////////////////////////////////////////
// export default function Footer() {
//   return (
//     <footer className="border-t border-base-200 bg-base-100">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
//         <div className="flex flex-col md:flex-row gap-6 md:items-center md:justify-between">
//           <div className="flex items-center gap-3">
//             <div className="w-10 h-10 rounded-2xl bg-base-200 flex items-center justify-center">
//               🩸
//             </div>
//             <div>
//               <h4 className="font-bold">BloodBond</h4>
//               <p className="text-sm opacity-70">Clean, fast & trustworthy donation platform.</p>
//             </div>
//           </div>

//           <p className="text-sm opacity-70">
//             © {new Date().getFullYear()} BloodBond — All rights reserved.
//           </p>
//         </div>
//       </div>
//     </footer>
//   );
// }
