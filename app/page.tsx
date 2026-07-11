import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-[#111827] antialiased selection:bg-[#22C55E]/20">
      {/* ── Navigation ── */}
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

      {/* ── Hero Section ── */}
      <section className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6 text-left">
            <span className="inline-block bg-[#22C55E]/10 text-[#1A9F49] text-xs font-bold px-3 py-1.5 rounded-full">
              Free for local small businesses
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-[#0A2E1C] leading-[1.1]">
              One link to help you{" "}
              <span className="text-[#22C55E]">share everything</span> you
              create, curate, and sell across all your social profiles
            </h1>
            <p className="text-base text-gray-600 max-w-xl">
              Create and customize your BioLink page in minutes. Connect all
              your networks—Instagram, TikTok, and WhatsApp—and automatically
              accept direct bank transfers.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="merchant/signup"
                className="px-6 py-3.5 bg-[#22C55E] hover:bg-[#1A9F49] text-white font-bold rounded-full text-sm transition-all shadow-md shadow-[#22C55E]/20"
              >
                Claim Your Custom Bio Link
              </Link>
              <Link
                href="#showcase"
                className="px-6 py-3.5 border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold rounded-full text-sm transition-all"
              >
                See Live Examples
              </Link>
            </div>
            {/* Tiny social text */}
            <div className="flex items-center gap-2 pt-4 text-xs text-gray-400">
              <div className="flex -space-x-2">
                <div
                  className="w-10 h-10 rounded-full bg-primary-fixed border-2 border-white"
                  style={{
                    backgroundImage:
                      "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDeFsQ1hBVUA2THKeauYvmRpd3_CYQfnJALLAYcdCDyHdKfn_Etip4lHFxH1fvoARrEUSlX5zUO2K1hZf-5JQdPh0cxu2BWxFBZZPDtt8IJrr9K9PkL-ZsIItaUiAfsX-9Y9s4-o6cx8vEZid4x_pISqX_Jv22zYqzmtejXikh4bgde-0cmc7LHrAwSdCYcmQgBZKCZocXXOzf241tmAoF0TWE0z97Vde-6J4fv7wXvAkZT9T1PpIuL')",
                    backgroundSize: "cover",
                  }}
                ></div>
                <div
                  className="w-10 h-10 rounded-full bg-primary-fixed border-2 border-white"
                  style={{
                    backgroundImage:
                      "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBNQt6fNF0D0Cz-vgpommuK2KW6Ym9hZG5ZpvRiEC1XFYosyXZoCzGNhW4X-yqAfi8mj8PLLvtgqksGiDbzE0BubEk0suJpWk5gH0SIUQgaDvsdHxvECD7EPhP0DqU6kY2dAJN7tp2OfB6moYxJM1mL8cOjen12nMXbhmDI-tFWetLNamy12iBCD0KSAyaAPPVfrO5V9Qnsb-ZrFX6vV2qetvqltBw-sVZ-J4P9jk5KggID-c7WYHUw')",
                    backgroundSize: "cover",
                  }}
                ></div>
                <div
                  className="w-10 h-10 rounded-full bg-primary-fixed border-2 border-white"
                  style={{
                    backgroundImage:
                      "url('https://lh3.googleusercontent.com/aida-public/AB6AXuC5kd2NNiNssLkORwiCXP6RWopXNFoHfrNr2hFKySb5c0dzQiIFX66S1l9Q3evtsp4ZbRb0nmWI9AG2AKbXULMG1DSzYx4ydcPnDbspvsEdjVAUphMiF0PTRNQcZ0LGViLiPKpSmDP2DU0ioO_quOll6oboFErXrTtsMzbWNI7b5LGpg_ND5sYf93M3elbmdN6_2mVcxtqEfTyif92fPbJl3eM-MQNX13dJVdZtrTxmE13iFdCokA9k')",
                    backgroundSize: "cover",
                  }}
                ></div>
              </div>
              <span>Trusted by 14,000+ active creators and local sellers</span>
            </div>
          </div>

          {/* Right Hero Image Layout using exact market asset */}
          <div className="lg:col-span-5 relative">
            <div className="rounded-3xl overflow-hidden shadow-2xl relative group border border-gray-100">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCz29Z9xqZI1_f_P33NuASHBSB2v0Orj90jtlPaFlRKVXrV6i1aGPfBdvzXP-p6E2eg_gw60cEMbnPPiyMsfOz_mjrvQRCQUZMwDY-G-qvPPsv1FhbKVPnEG8rDnt9wSXjsF5Kdu_34pzMnGduICPFKwkx331wL1YDEV8rKmSX86a0jLnALGUM_eRVxDhFcrTIcXHWdAWIpechKr0sjJo5tFFSHR6RZKJaT_kG_Q3raH58-vuHZNWGF"
                alt="Adire by Kobi market bank transfer checkout"
                className="w-full h-[440px] object-cover"
              />
              {/* Floating Status Notification overlay from the mockup */}
              <div className="absolute bottom-5 left-5 right-5 bg-white/95 backdrop-blur-sm p-3.5 rounded-2xl border border-white/40 shadow-lg flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#22C55E] flex items-center justify-center text-white text-xs">
                  ✓
                </div>
                <div>
                  <p className="text-xs font-bold text-[#0A2E1C]">
                    Adire By Kobi Boutique
                  </p>
                  <p className="text-[10px] text-gray-500">
                    Bank Transfer Accepted instantly
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features Block Section (Asymmetric Image Layout) ── */}
      <section
        id="features"
        className="py-20 px-6 max-w-7xl mx-auto space-y-12"
      >
        <div className="text-center space-y-3">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#0A2E1C]">
            Everything you need, nothing you don't
          </h2>
          <p className="text-sm text-gray-400 max-w-lg mx-auto">
            Built specifically to help merchants and social creators turn simple
            social content link clicks into real revenue channels.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Block - Bio Link Phone Graphic Custom Layout */}
          <div className="lg:col-span-7 bg-[#FAFAFA] rounded-3xl border border-gray-100 p-8 flex flex-col justify-between overflow-hidden relative min-h-[440px]">
            <div className="space-y-3 max-w-md text-left">
              <div className="w-8 h-8 bg-[#22C55E]/10 text-[#22C55E] rounded-lg flex items-center justify-center text-sm">
                🔗
              </div>
              <h3 className="text-xl font-bold text-[#0A2E1C]">
                One bio link = A complete store
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Add links, embed your custom inventory catalogue, process quick
                checkouts, and gather customer shipping details inside a
                beautiful single interface.
              </p>
            </div>

            {/* Replaced with your exact BioLink 3D Phone Mockup */}
            <div className="mt-6 flex justify-center items-end">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAnx9tBoTBDHcnvJAOeBmORMRGqtedTAlzEcRaPlsb9Q8xbD6V7BniyLSfRV587aHY2lsU8M8qyGKD1Gn5OH5ULJr6-Ap5t8vFsamNCW36zrecBcdccAd6DWg54k4FhN-bfNSlLCxJGNeAhu4y16sLZkyChIdk-eRlM7yg0UEsADtoDPn0Rhof14ksO4YnasVyjMcLzcBSb2-VDLSkMHMqsvHyRoyGkqN-priClXTCzjWK0yYbrhK3H"
                alt="BioLink App Mockup showing Instagram, TikTok and WhatsApp integration"
                className="w-full max-w-sm object-contain object-bottom h-60 transform translate-y-2"
              />
            </div>
          </div>

          {/* Right Block - Dark Forest Green Analytics Panel */}
          <div className="lg:col-span-5 bg-[#0A2E1C] text-white rounded-3xl p-8 flex flex-col justify-between text-left">
            <div className="space-y-4">
              <div className="w-8 h-8 bg-[#22C55E] rounded-lg flex items-center justify-center text-sm">
                📊
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">Powerful Analytics</h3>
                <p className="text-xs text-gray-300 leading-relaxed">
                  Understand traffic instantly. Monitor conversion performance
                  loops, link clicks, device data profiles, and geographical
                  hubs.
                </p>
              </div>
            </div>

            {/* UI Data Chart Simulation matching the layout */}
            <div className="mt-8 space-y-3 bg-[#072013] p-5 rounded-2xl border border-white/5">
              <div className="flex justify-between text-[11px] text-gray-400 font-medium">
                <span>Traffic Origins Analytics</span>
                <span className="text-[#22C55E] font-bold">+24%</span>
              </div>
              <div className="space-y-2.5 pt-1">
                <div>
                  <div className="flex justify-between text-[10px] mb-1 text-gray-300">
                    <span>Instagram Profile</span>
                    <span>74%</span>
                  </div>
                  <div className="h-1 w-full bg-white/10 rounded-full">
                    <div className="h-full w-[74%] bg-[#22C55E] rounded-full" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[10px] mb-1 text-gray-300">
                    <span>WhatsApp Status</span>
                    <span>18%</span>
                  </div>
                  <div className="h-1 w-full bg-white/10 rounded-full">
                    <div className="h-full w-[18%] bg-[#22C55E] rounded-full" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[10px] mb-1 text-gray-300">
                    <span>TikTok Bio</span>
                    <span>8%</span>
                  </div>
                  <div className="h-1 w-full bg-white/10 rounded-full">
                    <div className="h-full w-[8%] bg-gray-600 rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Horizontal Layout Banner - QR Generation */}
        <div className="bg-[#22C55E] rounded-3xl text-white p-8 lg:p-12 grid grid-cols-1 md:grid-cols-12 gap-8 items-center text-left">
          <div className="md:col-span-8 space-y-4">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center text-sm">
              🔲
            </div>
            <h3 className="text-2xl font-bold">
              Offline-to-Online QR Integration
            </h3>
            <p className="text-sm text-white/90 max-w-xl leading-relaxed">
              Share your bio store profile at offline pop-ups and retail spaces.
              Customers can seamlessly scan a printed flyer code to settle
              purchases instantly.
            </p>
            <button className="px-5 py-2.5 bg-white text-[#22C55E] font-bold text-xs rounded-full shadow-sm transition-transform active:scale-95">
              Generate Your QR Code
            </button>
          </div>
          <div className="md:col-span-4 flex justify-center md:justify-end">
            <div className="w-28 h-28 bg-white rounded-2xl p-4 shadow-xl flex items-center justify-center text-[#22C55E]">
              {/* Clean QR placeholder asset design matching layout style */}
              <svg
                className="w-full h-full stroke-current"
                fill="none"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <rect x="2" y="2" width="6" height="6" rx="1" />
                <rect x="16" y="2" width="6" height="6" rx="1" />
                <rect x="2" y="16" width="6" height="6" rx="1" />
                <path d="M16 16h2v2h-2zm4 4h2v2h-2zm-4 4h2v-2h-2zm4-4h2v-2h-2z" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* ── Customer Showcase Section with the specific portraits ── */}
      <section
        id="showcase"
        className="py-20 px-6 max-w-7xl mx-auto space-y-12"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 text-left">
          <div className="space-y-2">
            <h2 className="text-3xl font-extrabold text-[#0A2E1C]">
              Meet the Market Leaders
            </h2>
            <p className="text-sm text-gray-500">
              The software ecosystem engineered directly around real operational
              African store workflows.
            </p>
          </div>
          <span className="text-xs font-bold text-[#22C55E] cursor-pointer hover:underline flex items-center gap-1">
            Browse active list →
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Merchant Card 1 - Chioma */}
          <div className="bg-white text-left group transition-all duration-300">
            <div className="h-80 overflow-hidden relative rounded-2xl shadow-sm">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCo8wwEAt-qV7xxhswy8Msyu4b4-GhJK7ELzIHFjSuhCGhiyNpkz0H4A_P8VJP1RgXZeuCo1PNzKY5si-YSgB6xtCxHYH9IkRIdR-WbmXrAPY6Q4GfPrsPtDy40IM3OodorEd6iSfj2qoZ-I13hV7_ZdH3CDQoiBABzkBLZ3YxdRVcXUpM6TTKhudYBWPX4R15Id7O_w_hBI_9oEc8DUZJ7MnM626zufdlQ3ArCvbmwlg_RBWm48OQi"
                alt="Chioma N. at Zaza Hair salon boutique"
                className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
              />
              <span className="absolute bottom-3 left-3 bg-white/95 text-[10px] font-bold px-2 py-1 rounded-md text-[#0A2E1C] tracking-wide">
                ✦ ACTIVE STORE
              </span>
            </div>
            <div className="py-4 space-y-0.5">
              <h4 className="font-extrabold text-base text-[#0A2E1C]">
                Chioma N.
              </h4>
              <p className="text-xs text-gray-500 font-medium">
                Zaza Hair & Beauty
              </p>
              <p className="text-[10px] text-[#22C55E] font-bold tracking-wider uppercase pt-1">
                Lagos • Beauty
              </p>
            </div>
          </div>

          {/* Merchant Card 2 - Amara */}
          <div className="bg-white text-left group transition-all duration-300">
            <div className="h-80 overflow-hidden relative rounded-2xl shadow-sm">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuACFcmHAi01gFEqxyAtiLtCJWPV1vs3CORdqu0GjnhbqZlMspBXyuPaTIJYxCYVVQMVVMCxG9gx1iE6FrHyeTbOTdlQq8fcszYSp04QEIwwcYwGT_l0TEm2PacEY_wkSfefN2AAtWa2PUUYYCZ5PScrvV2oiK-_LM_2URLAsnTgsRKJgrwSbO6S55Z8EfRuov1u2hA7mt_iO2mOD1xPU9iTvbf-f0x0Ms4YfVf-VP_KyUa-EYMVYdGG"
                alt="Amara E. sculpting clay ceramics"
                className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
              />
              <span className="absolute bottom-3 left-3 bg-white/95 text-[10px] font-bold px-2 py-1 rounded-md text-[#0A2E1C] tracking-wide">
                ✦ ACTIVE STORE
              </span>
            </div>
            <div className="py-4 space-y-0.5">
              <h4 className="font-extrabold text-base text-[#0A2E1C]">
                Amara E.
              </h4>
              <p className="text-xs text-gray-500 font-medium">
                The Clay Studio
              </p>
              <p className="text-[10px] text-[#22C55E] font-bold tracking-wider uppercase pt-1">
                Nairobi • Crafts
              </p>
            </div>
          </div>

          {/* Merchant Card 3 - Femi */}
          <div className="bg-white text-left group transition-all duration-300">
            <div className="h-80 overflow-hidden relative rounded-2xl shadow-sm">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCDX3bIALfbO7xFVdLIsJYgCS3YJ-tKjtu_U1e7tsezpvBmqZBwEOpaDY-doV6JTuLvVFiOIoe2BFQsI8yeBAXXSJoUj0KGo_xrcfu6eIt0B-LWNOjHH6w6j91DIRGsHT5JPKX8wwxOqW6KA7FAsJDg8itwWYeY-VllHaKl_JPj9TqRz1OLjw5aLuKj7h1KFNifrv5x0BFIBE5WjKgBupKo6qZ5SO7E25ZlP-5Uw6AHoDnLKJK-Ek6c"
                alt="Femi K. standing near street graffiti wall art"
                className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
              />
              <span className="absolute bottom-3 left-3 bg-white/95 text-[10px] font-bold px-2 py-1 rounded-md text-[#0A2E1C] tracking-wide">
                ✦ ACTIVE STORE
              </span>
            </div>
            <div className="py-4 space-y-0.5">
              <h4 className="font-extrabold text-base text-[#0A2E1C]">
                Femi K.
              </h4>
              <p className="text-xs text-gray-500 font-medium">
                Vntg Warehouse
              </p>
              <p className="text-[10px] text-[#22C55E] font-bold tracking-wider uppercase pt-1">
                Abuja • Apparel
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonials Dark Feature Block Section ── */}
      <section className="py-20 px-6 bg-[#041E12] text-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center text-left">
          <div className="lg:col-span-7 space-y-6">
            <span className="text-xs font-bold text-[#22C55E] uppercase tracking-widest">
              What our sellers say
            </span>

            {/* Stacked Layout Columns matching your diagram design */}
            <div className="space-y-4 max-w-xl">
              {[
                {
                  text: "The checkout flow is incredible. Direct transfer logic means I don't pay 3% transactional handling commissions on every drop.",
                  user: "Ada O.",
                  sub: "House of Ada Apparel",
                },
                {
                  text: "Clean mobile layout styling templates. Store setup was completely finalized within my standard afternoon work breaks.",
                  user: "Chidi M.",
                  sub: "Artisan Leather Crafts",
                },
              ].map((t, idx) => (
                <div
                  key={idx}
                  className="bg-[#0A2E1C] border border-white/5 p-6 rounded-2xl space-y-2.5"
                >
                  <div className="flex text-amber-400 text-xs gap-0.5">
                    ★★★★★
                  </div>
                  <p className="text-xs text-gray-300 leading-relaxed italic">
                    "{t.text}"
                  </p>
                  <p className="text-xs font-bold text-[#22C55E]">
                    {t.user}{" "}
                    <span className="text-gray-500 font-normal">— {t.sub}</span>
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Circle Graphic Feature Representation */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-64 h-64 rounded-full border border-white/10 flex flex-col items-center justify-center p-8 text-center relative bg-gradient-to-br from-[#0A2E1C] to-transparent">
              <div className="w-9 h-9 bg-[#22C55E] rounded-full flex items-center justify-center font-bold text-xs mb-2">
                📈
              </div>
              <h3 className="text-3xl font-black tracking-tight">24/7</h3>
              <p className="text-xs font-semibold text-[#22C55E] uppercase tracking-wider mt-0.5">
                Revenue Tracking
              </p>
              <p className="text-[11px] text-gray-400 mt-2 max-w-[180px] leading-relaxed">
                Automated transaction financial status pipelines mapped directly
                straight into your profile timeline logs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Call To Action Banner ── */}
      <section className="py-20 px-6 max-w-5xl mx-auto">
        <div className="bg-gradient-to-tr from-[#1A9F49] to-[#22C55E] rounded-3xl p-12 text-center text-white space-y-5">
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Ready to launch inside your bio?
            </h2>
            <p className="text-sm text-white/90 max-w-sm mx-auto leading-relaxed">
              Join thousands of scale-driven growth merchants utilizing BioLink
              to streamline client checkouts seamlessly.
            </p>
          </div>
          <div>
            <Link
              href="merchant/signup"
              className="inline-block px-7 py-3 bg-white text-[#1A9F49] font-bold rounded-full text-xs shadow-md hover:scale-[1.01] transition-transform"
            >
              Start Your Free Store Now
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-gray-100 bg-white py-12 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-left text-xs text-gray-500">
          <div className="space-y-3">
            <p className="font-bold text-sm text-[#0A2E1C]">Biolink.Market</p>
            <p className="leading-relaxed">
              Empowering live autonomous independent commerce streams right out
              of social bio setups.
            </p>
          </div>
          <div className="space-y-2">
            <p className="font-bold text-[#0A2E1C]">Product</p>
            <p className="hover:text-[#22C55E] cursor-pointer">Features</p>
            <p className="hover:text-[#22C55E] cursor-pointer">Pricing</p>
          </div>
          <div className="space-y-2">
            <p className="font-bold text-[#0A2E1C]">Company</p>
            <p className="hover:text-[#22C55E] cursor-pointer">About Us</p>
            <p className="hover:text-[#22C55E] cursor-pointer">Privacy Terms</p>
          </div>
          <div className="space-y-2">
            <p className="font-bold text-[#0A2E1C]">Connect</p>
            <p className="hover:text-[#22C55E] cursor-pointer">Instagram</p>
            <p className="hover:text-[#22C55E] cursor-pointer">Twitter</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
