import Link from "next/link";
import Image from "next/image";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-[#111827] antialiased">
      {/* ── Navigation ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#E5E7EB]">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#22C55E] rounded-lg flex items-center justify-center">
              <span className="text-white font-black text-sm">B</span>
            </div>
            <span className="font-bold text-lg text-[#111827]">
              Biolink Market
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/merchant/login"
              className="text-xs font-semibold text-[#374151] hover:text-[#111827] transition-colors"
            >
              Log In
            </Link>
            <Link
              href="/merchant/signup"
              className="text-xs font-semibold text-white bg-[#22C55E] hover:bg-[#15803D] px-4 py-2.5 rounded-lg transition-colors"
            >
              Sign Up Free
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero Section ── */}
      <section className="pt-32 pb-20 px-4 md:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight">
              Sell directly to your customers
            </h1>
            <p className="text-lg text-[#374151] max-w-2xl mx-auto">
              Get your own online storefront in minutes. Accept payments, manage
              inventory, and grow your business — all in one place.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/merchant/signup"
              className="px-8 py-4 bg-[#22C55E] hover:bg-[#15803D] text-white font-semibold rounded-xl text-sm transition-colors shadow-lg hover:shadow-xl"
            >
              Create Free Storefront
            </Link>
            <Link
              href="#features"
              className="px-8 py-4 border border-[#E5E7EB] hover:bg-gray-50 text-[#111827] font-semibold rounded-xl text-sm transition-colors"
            >
              Learn More
            </Link>
          </div>

          {/* Showcase image placeholder */}
          <div className="mt-12 rounded-2xl bg-gradient-to-b from-[#22C55E]/10 to-gray-50 border border-[#E5E7EB] h-96 flex items-center justify-center">
            <div className="text-center">
              <svg
                className="w-24 h-24 text-[#22C55E] mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              <p className="text-sm text-[#374151]">
                Your storefront preview will appear here
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features Section ── */}
      <section id="features" className="py-20 px-4 md:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-2">
            <h2 className="text-3xl md:text-4xl font-black">
              Everything you need
            </h2>
            <p className="text-lg text-[#374151]">
              Built for African businesses, optimized for growth
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "🛍️",
                title: "Your Own Storefront",
                desc: "Get a custom URL (biomarket.com/yourstore) to share with customers.",
              },
              {
                icon: "💳",
                title: "Payment Collection",
                desc: "Accept payments via OPay, PalmPay, Moniepoint, and bank transfers.",
              },
              {
                icon: "📱",
                title: "QR Code Checkout",
                desc: "Generate QR codes for instant mobile payments — no card needed.",
              },
              {
                icon: "📊",
                title: "Sales Analytics",
                desc: "Track views, clicks, and sales in real-time from your dashboard.",
              },
              {
                icon: "🔗",
                title: "Social Media Links",
                desc: "Link to Instagram, TikTok, WhatsApp, and drive traffic to your store.",
              },
              {
                icon: "⚡",
                title: "Fast & Reliable",
                desc: "Built on enterprise infrastructure. Your store is always online.",
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 border border-[#E5E7EB] hover:border-[#22C55E] hover:shadow-lg transition-all space-y-3"
              >
                <div className="text-3xl">{feature.icon}</div>
                <h3 className="font-bold text-lg">{feature.title}</h3>
                <p className="text-sm text-[#374151]">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="py-20 px-4 md:px-8">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-2">
            <h2 className="text-3xl md:text-4xl font-black">
              Get started in 3 steps
            </h2>
            <p className="text-lg text-[#374151]">
              From signup to first sale takes just minutes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Sign Up",
                desc: "Create your free account with just your email.",
              },
              {
                step: "2",
                title: "Set Up Store",
                desc: "Add your business name, products, and payment info.",
              },
              {
                step: "3",
                title: "Start Selling",
                desc: "Share your link and accept payments instantly.",
              },
            ].map((item, idx) => (
              <div key={idx} className="text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-[#22C55E]/20 flex items-center justify-center mx-auto">
                  <span className="text-2xl font-black text-[#22C55E]">
                    {item.step}
                  </span>
                </div>
                <div className="space-y-2">
                  <h3 className="font-bold text-lg">{item.title}</h3>
                  <p className="text-sm text-[#374151]">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing Section ── */}
      <section className="py-20 px-4 md:px-8 bg-gray-50">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <div className="space-y-2">
            <h2 className="text-3xl md:text-4xl font-black">
              Simple, transparent pricing
            </h2>
            <p className="text-lg text-[#374151]">
              No hidden fees. No setup costs. Just pay when you get paid.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-8 space-y-6">
            <div className="space-y-2">
              <div className="text-5xl font-black text-[#22C55E]">Free</div>
              <p className="text-[#374151]">
                Everything included, forever free
              </p>
            </div>
            <ul className="space-y-3 text-left">
              {[
                "Unlimited products & listings",
                "Analytics dashboard",
                "Custom storefront URL",
                "QR code payments",
                "Social media links",
                "Email support",
              ].map((item, idx) => (
                <li key={idx} className="flex items-center gap-3">
                  <svg
                    className="w-5 h-5 text-[#22C55E]"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-[#374151]">{item}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/merchant/signup"
              className="w-full px-8 py-4 bg-[#22C55E] hover:bg-[#15803D] text-white font-semibold rounded-xl text-sm transition-colors"
            >
              Get Started Free
            </Link>
          </div>

          <p className="text-sm text-[#374151]">
            🚀 Launch your store today. No credit card required.
          </p>
        </div>
      </section>

      {/* ── Testimonials / Social Proof ── */}
      <section className="py-20 px-4 md:px-8">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-2">
            <h2 className="text-3xl md:text-4xl font-black">
              Built for African entrepreneurs
            </h2>
            <p className="text-lg text-[#374151]">
              Trusted by sellers across Nigeria
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                quote:
                  "I launched my store and made my first sale within a week. This is exactly what I needed.",
                author: "Ada O.",
                role: "Fashion Designer, Lagos",
              },
              {
                quote:
                  "No complicated setup. Just create account, add products, share link. That's it!",
                author: "Chidi M.",
                role: "Artisan, Abuja",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-gradient-to-br from-[#22C55E]/5 to-transparent rounded-2xl border border-[#E5E7EB] p-6 space-y-4"
              >
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-lg">
                      ⭐
                    </span>
                  ))}
                </div>
                <p className="text-[#374151] italic">"{item.quote}"</p>
                <div>
                  <p className="font-bold text-[#111827]">{item.author}</p>
                  <p className="text-xs text-[#374151]">{item.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section className="py-20 px-4 md:px-8 bg-[#22C55E]">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-black text-white">
              Ready to sell online?
            </h2>
            <p className="text-lg text-white/90">
              Join hundreds of sellers already using Biolink Market.
            </p>
          </div>
          <Link
            href="/merchant/signup"
            className="inline-block px-8 py-4 bg-white hover:bg-gray-100 text-[#22C55E] font-semibold rounded-xl text-sm transition-colors shadow-lg"
          >
            Create Your Free Store
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-[#E5E7EB] py-12 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 bg-[#22C55E] rounded-lg flex items-center justify-center">
                  <span className="text-white font-black text-xs">B</span>
                </div>
                <span className="font-bold text-[#111827]">Biolink Market</span>
              </div>
              <p className="text-xs text-[#374151]">
                Empowering African entrepreneurs to sell online.
              </p>
            </div>
            <div>
              <p className="font-bold text-xs text-[#374151] uppercase mb-3">
                Product
              </p>
              <ul className="space-y-2 text-xs text-[#374151]">
                <li>
                  <Link href="#features" className="hover:text-[#22C55E]">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-[#22C55E]">
                    Pricing
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <p className="font-bold text-xs text-[#374151] uppercase mb-3">
                Company
              </p>
              <ul className="space-y-2 text-xs text-[#374151]">
                <li>
                  <Link href="#" className="hover:text-[#22C55E]">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-[#22C55E]">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <p className="font-bold text-xs text-[#374151] uppercase mb-3">
                Legal
              </p>
              <ul className="space-y-2 text-xs text-[#374151]">
                <li>
                  <Link href="#" className="hover:text-[#22C55E]">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-[#22C55E]">
                    Terms
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-[#E5E7EB] pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-[#374151]">
              © 2025 Biolink Market. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <Link href="#" className="text-[#374151] hover:text-[#22C55E]">
                Twitter
              </Link>
              <Link href="#" className="text-[#374151] hover:text-[#22C55E]">
                Instagram
              </Link>
              <Link href="#" className="text-[#374151] hover:text-[#22C55E]">
                LinkedIn
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
