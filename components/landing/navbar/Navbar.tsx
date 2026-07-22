import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-extrabold text-xl tracking-tight text-[#0A2E1C]">
            Biolink<span className="text-[#22C55E]">.Market</span>
          </span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
          <Link
            href="#features"
            className="hover:text-[#22C55E] transition-colors"
          >
            Products
          </Link>
          <Link
            href="#showcase"
            className="hover:text-[#22C55E] transition-colors"
          >
            Showcase
          </Link>
          <Link href="#" className="hover:text-[#22C55E] transition-colors">
            Pricing
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="merchant/login"
            className="text-sm font-medium text-gray-600 hover:text-black"
          >
            Log in
          </Link>
          <Link
            href="merchant/signup"
            className="text-sm font-semibold text-white bg-[#22C55E] hover:bg-[#1A9F49] px-5 py-2.5 rounded-full transition-all"
          >
            Sign Free
          </Link>
        </div>
      </div>
    </nav>
  );
}
