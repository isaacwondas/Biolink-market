"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import PhoneFrame from "./PhoneFrame";
import DemoCursor from "./DemoCursor";
import { colors, radius, typography } from "@/app/lib/design-tokens";

const BUSINESS_NAME = "Ada Fashion Hub";
const HANDLE = "@adafashion";
const PHONE = "08031234567";
const ACCOUNT = "1234567890";

const TYPING_SPEED = 100; // Slower typing rate
const STEP_DELAY = 3500; // Slower step transition pace (3.5s per screen)

export default function OnboardingDemo() {
  const [step, setStep] = useState(0);

  const [business, setBusiness] = useState("");
  const [handle, setHandle] = useState("");
  const [phone, setPhone] = useState("");
  const [account, setAccount] = useState("");

  const [verified, setVerified] = useState(false);

  // Floating Cursor Position State
  const [cursor, setCursor] = useState({ x: 210, y: 430 });
  const [clicking, setClicking] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (step < 4) {
        setStep((prev) => prev + 1);
      } else {
        resetDemo();
      }
    }, STEP_DELAY);

    return () => clearTimeout(timer);
  }, [step]);

  function resetDemo() {
    setTimeout(() => {
      setBusiness("");
      setHandle("");
      setPhone("");
      setAccount("");
      setVerified(false);
      setStep(0);
    }, 2500);
  }

  useTyping(BUSINESS_NAME, setBusiness, step === 0);
  useTyping(HANDLE, setHandle, step === 0);
  useTyping(PHONE, setPhone, step === 1);

  useTyping(
    ACCOUNT,
    (value) => {
      setAccount(value);

      if (value === ACCOUNT) {
        setTimeout(() => {
          setVerified(true);
        }, 800);
      }
    },
    step === 2,
  );

  const screen = useMemo(() => {
    switch (step) {
      case 0:
        return <StoreStep business={business} handle={handle} />;
      case 1:
        return <WhatsappStep phone={phone} />;
      case 2:
        return <PaymentStep account={account} verified={verified} />;
      case 3:
        return <SuccessStep />;
      default:
        return <DashboardStep />;
    }
  }, [step, business, handle, phone, account, verified]);

  return (
    <PhoneFrame
      overlay={<DemoCursor x={cursor.x} y={cursor.y} clicking={clicking} />}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{
            opacity: 0,
            x: 40,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          exit={{
            opacity: 0,
            x: -40,
          }}
          transition={{
            duration: 0.6,
            ease: "easeInOut",
          }}
          className="h-full"
        >
          {screen}
        </motion.div>
      </AnimatePresence>
    </PhoneFrame>
  );
}

function useTyping(
  text: string,
  setter: (v: string) => void,
  enabled: boolean,
) {
  useEffect(() => {
    if (!enabled) return;

    setter("");
    let i = 0;

    const interval = setInterval(() => {
      i++;
      setter(text.slice(0, i));

      if (i >= text.length) {
        clearInterval(interval);
      }
    }, TYPING_SPEED);

    return () => clearInterval(interval);
  }, [enabled, setter, text]);
}

function StoreStep({ business, handle }: { business: string; handle: string }) {
  return (
    <div className="p-6">
      <h2 className="font-extrabold text-xl text-slate-900">
        Create your store
      </h2>

      <div className="mt-8 space-y-5">
        <Input label="Business Name" value={business} />
        <Input label="Store Handle" value={handle} />
        <ContinueButton />
      </div>
    </div>
  );
}

function WhatsappStep({ phone }: { phone: string }) {
  return (
    <div className="p-6">
      <h2 className="font-extrabold text-xl text-slate-900">WhatsApp</h2>

      <div className="mt-8 space-y-5">
        <Input label="Phone Number" value={phone} />
        <ContinueButton />
      </div>
    </div>
  );
}

function PaymentStep({
  account,
  verified,
}: {
  account: string;
  verified: boolean;
}) {
  return (
    <div className="p-6">
      <h2 className="font-extrabold text-xl text-slate-900">Bank Account</h2>

      <div className="mt-8 space-y-4">
        <Input label="Account Number" value={account} />

        <motion.div
          animate={{
            opacity: verified ? 1 : 0,
            y: verified ? 0 : 10,
          }}
          className={`rounded-xl ${colors.badge} p-4 border border-emerald-200`}
        >
          <div className="font-bold text-emerald-700">✓ Ada Fashion Hub</div>
          <div className="text-xs text-emerald-600">Account verified</div>
        </motion.div>

        <ContinueButton />
      </div>
    </div>
  );
}

function SuccessStep() {
  return (
    <div className="flex h-full items-center justify-center p-6">
      <motion.div
        initial={{
          scale: 0.6,
          opacity: 0,
        }}
        animate={{
          scale: 1,
          opacity: 1,
        }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <div className="text-6xl">🎉</div>
        <h2 className="mt-5 text-2xl font-extrabold text-slate-900">
          Store Live
        </h2>
        <p className={`${typography.caption} mt-2`}>
          Your BioLink Market page is ready.
        </p>
      </motion.div>
    </div>
  );
}

function DashboardStep() {
  return (
    <div className="p-6">
      <h2 className="font-extrabold text-xl text-slate-900">Dashboard</h2>

      <div className="mt-6 grid gap-4">
        <Card title="Today's Orders" value="24" />
        <Card title="Revenue" value="₦84,000" />
        <Card title="Visitors" value="328" />
      </div>
    </div>
  );
}

function Input({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <label className={typography.caption}>{label}</label>

      <div
        className={`mt-2 h-12 rounded-xl border ${colors.border} bg-slate-50 px-4 flex items-center font-medium text-slate-900 text-sm`}
      >
        {value}
        <motion.span
          animate={{
            opacity: [0, 1, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 0.8,
          }}
          className={`${colors.brandText} ml-0.5 font-bold`}
        >
          |
        </motion.span>
      </div>
    </div>
  );
}

function ContinueButton() {
  return (
    <motion.button
      whileTap={{
        scale: 0.96,
      }}
      animate={{
        scale: [1, 0.98, 1],
      }}
      transition={{
        repeat: Infinity,
        duration: 2.2,
      }}
      className={`w-full ${radius.md} ${colors.brand} ${colors.brandHover} py-3.5 text-white font-semibold shadow-sm transition-all text-sm`}
    >
      Continue
    </motion.button>
  );
}

function Card({ title, value }: { title: string; value: string }) {
  return (
    <motion.div
      whileHover={{
        y: -4,
        scale: 1.02,
      }}
      whileTap={{
        scale: 0.98,
      }}
      transition={{
        type: "spring",
        stiffness: 300,
      }}
      className={`rounded-2xl border ${colors.border} bg-white p-4 shadow-sm`}
    >
      <div className={typography.caption}>{title}</div>
      <div className={`mt-1 text-2xl font-extrabold ${colors.brandText}`}>
        {value}
      </div>
    </motion.div>
  );
}
