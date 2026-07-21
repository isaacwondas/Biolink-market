"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import PhoneFrame from "./PhoneFrame";
import DemoCursor from "./DemoCursor";

const BUSINESS_NAME = "Ada Fashion Hub";
const HANDLE = "@adafashion";
const PHONE = "08031234567";
const ACCOUNT = "1234567890";

const TYPING_SPEED = 70;
const STEP_DELAY = 1200;

export default function OnboardingDemo() {
  const [step, setStep] = useState(0);

  const [business, setBusiness] = useState("");
  const [handle, setHandle] = useState("");
  const [phone, setPhone] = useState("");
  const [account, setAccount] = useState("");

  const [verified, setVerified] = useState(false);
  const [cursor, setCursor] = useState({
    x: 210,
    y: 430,
  });

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
    }, 2000);
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
        }, 600);
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
            duration: 0.45,
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
      <h2 className="font-bold text-xl">Create your store</h2>

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
      <h2 className="font-bold text-xl">WhatsApp</h2>

      <div className="mt-8">
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
      <h2 className="font-bold text-xl">Bank Account</h2>

      <div className="mt-8 space-y-4">
        <Input label="Account Number" value={account} />

        <motion.div
          animate={{
            opacity: verified ? 1 : 0,
            y: verified ? 0 : 10,
          }}
          className="rounded-xl bg-green-50 p-4 border border-green-200"
        >
          <div className="font-semibold text-green-700">✓ Ada Fashion Hub</div>

          <div className="text-sm text-green-600">Account verified</div>
        </motion.div>

        <ContinueButton />
      </div>
    </div>
  );
}

function SuccessStep() {
  return (
    <div className="flex h-full items-center justify-center">
      <motion.div
        initial={{
          scale: 0.6,
          opacity: 0,
        }}
        animate={{
          scale: 1,
          opacity: 1,
        }}
        className="text-center"
      >
        <div className="text-6xl">🎉</div>

        <h2 className="mt-5 text-2xl font-bold">Store Live</h2>

        <p className="mt-2 text-gray-500">Your BioLink Market page is ready.</p>
      </motion.div>
    </div>
  );
}

function DashboardStep() {
  return (
    <div className="p-6">
      <h2 className="font-bold text-xl">Dashboard</h2>

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
      <label className="text-sm text-gray-500">{label}</label>

      <div className="mt-2 h-12 rounded-xl border px-4 flex items-center font-medium">
        {value}

        <motion.span
          animate={{
            opacity: [0, 1, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 0.8,
          }}
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
        scale: [1, 0.97, 1],
      }}
      transition={{
        repeat: Infinity,
        duration: 1.8,
      }}
      className="w-full rounded-xl bg-emerald-600 py-3 text-white font-semibold"
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
        scale: 1.03,
      }}
      whileTap={{
        scale: 0.98,
      }}
      transition={{
        type: "spring",
        stiffness: 300,
      }}
      className="rounded-2xl border p-4"
    >
      <div className="text-sm text-gray-500">{title}</div>

      <div className="mt-2 text-2xl font-bold">{value}</div>
    </motion.div>
  );
}
