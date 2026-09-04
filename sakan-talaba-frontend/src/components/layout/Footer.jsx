import { Link } from "react-router-dom";
import { Home, Mail, Phone, MapPin, ArrowUpRight } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">

        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">

          {/* About */}
          <div>
            <Link
              to="/"
              className="inline-flex items-center gap-2"
              aria-label="Sakan Talaba Home"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
                <Home size={19} />
              </div>

              <span className="text-xl font-bold tracking-tight text-slate-900">
                Sakan Talaba
              </span>
            </Link>

            <p className="mt-4 max-w-sm text-sm leading-6 text-slate-500">
              Connecting students with verified, affordable housing near their
              universities across Egypt.
            </p>

            {/* Social Links */}
            <div className="mt-5 flex items-center gap-2">

              {/* Facebook */}
              <a
                href="#"
                aria-label="Facebook"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-blue-600 hover:bg-blue-600 hover:text-white"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-[18px] w-[18px]"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M14 8h3V4h-3c-3.31 0-6 2.69-6 6v2H5v4h3v4h4v-4h3l1-4h-4v-2c0-1.1.9-2 2-2z" />
                </svg>
              </a>

              {/* Instagram */}
              <a
                href="#"
                aria-label="Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-blue-600 hover:bg-blue-600 hover:text-white"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-[18px] w-[18px]"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </a>

              {/* Twitter / X */}
              <a
                href="#"
                aria-label="Twitter"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-blue-600 hover:bg-blue-600 hover:text-white"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-[18px] w-[18px]"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817-5.964 6.817H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
                </svg>
              </a>

              {/* LinkedIn */}
              <a
                href="#"
                aria-label="LinkedIn"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-blue-600 hover:bg-blue-600 hover:text-white"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-[18px] w-[18px]"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M6.5 8.5A2.5 2.5 0 1 0 6.5 3.5a2.5 2.5 0 0 0 0 5ZM4 10h5v10H4V10Zm7.5 0h4.8v1.36h.07c.67-1.27 2.31-1.86 3.63-1.86 3.88 0 4.6 2.55 4.6 5.87V20h-5v-4.08c0-.97-.02-2.22-1.35-2.22-1.35 0-1.56 1.05-1.56 2.15V20h-5V10Z" />
                </svg>
              </a>

            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              Quick Links
            </h3>

            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <Link
                  to="/"
                  className="text-slate-500 transition hover:text-blue-600"
                >
                  Home
                </Link>
              </li>

              <li>
                <Link
                  to="/housing"
                  className="text-slate-500 transition hover:text-blue-600"
                >
                  Find Housing
                </Link>
              </li>

              <li>
                <Link
                  to="/favorites"
                  className="text-slate-500 transition hover:text-blue-600"
                >
                  Favorites
                </Link>
              </li>

              <li>
                <Link
                  to="/bookings"
                  className="text-slate-500 transition hover:text-blue-600"
                >
                  My Bookings
                </Link>
              </li>

              <li>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-1 text-slate-500 transition hover:text-blue-600"
                >
                  List Your Property
                  <ArrowUpRight size={14} />
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              Support
            </h3>

            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <Link
                  to="/contact"
                  className="text-slate-500 transition hover:text-blue-600"
                >
                  Contact Us
                </Link>
              </li>

              <li>
                <Link
                  to="/contact"
                  className="text-slate-500 transition hover:text-blue-600"
                >
                  Send an Inquiry
                </Link>
              </li>

              <li>
                <Link
                  to="/housing"
                  className="text-slate-500 transition hover:text-blue-600"
                >
                  Browse Listings
                </Link>
              </li>

              <li>
                <Link
                  to="/universities"
                  className="text-slate-500 transition hover:text-blue-600"
                >
                  Universities
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              Contact
            </h3>

            <ul className="mt-4 space-y-4 text-sm text-slate-500">

              <li className="flex items-start gap-3">
                <Mail
                  size={17}
                  className="mt-0.5 shrink-0 text-blue-600"
                />

                <a
                  href="mailto:support@sakantalaba.com"
                  className="transition hover:text-blue-600"
                >
                  support@sakantalaba.com
                </a>
              </li>

              <li className="flex items-start gap-3">
                <Phone
                  size={17}
                  className="mt-0.5 shrink-0 text-blue-600"
                />

                <a
                  href="tel:+201000000000"
                  className="transition hover:text-blue-600"
                >
                  +20 100 000 0000
                </a>
              </li>

              <li className="flex items-start gap-3">
                <MapPin
                  size={17}
                  className="mt-0.5 shrink-0 text-blue-600"
                />

                <span>New Cairo, Cairo, Egypt</span>
              </li>

            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 flex flex-col gap-3 border-t border-slate-100 pt-6 text-center text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between sm:text-left">
          <p>
            © {year} Sakan Talaba. All rights reserved.
          </p>

          <div className="flex items-center justify-center gap-5 sm:justify-end">
            <Link
              to="/privacy"
              className="transition hover:text-blue-600"
            >
              Privacy Policy
            </Link>

            <Link
              to="/terms"
              className="transition hover:text-blue-600"
            >
              Terms of Service
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}