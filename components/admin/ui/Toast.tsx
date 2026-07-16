"use client";

interface ToastProps {
  msg: {
    type: "success" | "error";
    text: string;
  } | null;
}

export default function Toast({ msg }: ToastProps) {
  if (!msg) return null;

  return (
    <div
      className={`px-4 py-3 rounded-xl text-xs font-medium border ${
        msg.type === "success"
          ? "bg-green-50 border-green-200 text-green-700"
          : "bg-red-50 border-red-200 text-red-700"
      }`}
    >
      {msg.text}
    </div>
  );
}
