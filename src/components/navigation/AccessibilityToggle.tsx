"use client";

import { useState } from "react";

export function AccessibilityToggle() {
  const [enabled, setEnabled] = useState(false);

  function toggleTextSize() {
    const next = !enabled;
    setEnabled(next);
    document.body.classList.toggle("kit-large-text", next);

    const status = document.getElementById("accessibility-status");
    if (status) {
      status.textContent = next
        ? "Texto ampliado. Acione novamente para restaurar."
        : "Tamanho do texto restaurado.";
    }
  }

  return (
    <button
      className="accessibility"
      type="button"
      aria-label={enabled ? "Restaurar tamanho do texto" : "Ampliar tamanho do texto"}
      aria-pressed={enabled}
      onClick={toggleTextSize}
    >
      A+ <span>Ampliar texto</span>
    </button>
  );
}
