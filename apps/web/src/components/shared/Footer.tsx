import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-950/50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="h-6 w-6 rounded bg-slate-900 dark:bg-slate-50" />
              <span className="text-lg font-bold text-slate-900 dark:text-slate-50">
                PU Convocation
              </span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 max-w-md">
              Digital platform for managing convocation ceremonies at Parul University. 
              Streamlining registration, seat allocation, and ceremonial processes.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-slate-50 mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-50"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/ceremonies"
                  className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-50"
                >
                  Ceremonies
                </Link>
              </li>
              <li>
                <Link
                  href="/guidelines"
                  className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-50"
                >
                  Guidelines
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-50"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-slate-50 mb-4">
              Support
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/help"
                  className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-50"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-50"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-50"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-50"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <hr className="my-8 border-slate-200 dark:border-slate-800" />

        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-slate-600 dark:text-slate-400 text-sm">
            © 2025 Parul University. All rights reserved.
          </p>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <span className="text-slate-600 dark:text-slate-400 text-sm">
              Built with ❤️ by Kaustubh Bagale for PU Community
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
