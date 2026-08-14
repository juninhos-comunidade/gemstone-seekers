// lib/hooks/useLoadingMessages.ts
"use client";

import { useEffect, useState } from "react";

const DEFAULT_MESSAGES = [
  { delay: 0, text: "Entrando..." },
  { delay: 4000, text: "Ainda entrando..." },
  { delay: 8000, text: "O servidor está iniciando, aguarde..." },
  { delay: 20000, text: "Quase lá, isso pode levar até 1 minuto..." },
];

export function useLoadingMessages(
  isActive: boolean,
  messages: { delay: number; text: string }[] = DEFAULT_MESSAGES,
) {
  const [message, setMessage] = useState(messages[0]?.text ?? "");

  useEffect(() => {
    if (!isActive) return;

    const timers = messages.map(({ delay, text }) =>
      setTimeout(() => setMessage(text), delay),
    );

    return () => timers.forEach(clearTimeout);
  }, [isActive]); // eslint-disable-line react-hooks/exhaustive-deps

  return message;
}
