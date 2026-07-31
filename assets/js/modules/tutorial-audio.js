/* ============================================================
   MentorAI — Lector por voz del tutorial (Web Speech)
   Sin dependencias. Funciona por file://. Parte de window.MentorAI.
   ============================================================ */

(function () {
  "use strict";

  const MentorAI = (window.MentorAI = window.MentorAI || {});

  /* ---------- Iconos ---------- */

  const PLAY_SVG =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="6 4 20 12 6 20 6 4"/></svg>';
  const STOP_SVG =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="6" width="12" height="12" rx="2"/></svg>';
  const PAUSE_SVG =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="9" y1="4" x2="9" y2="20"/><line x1="15" y1="4" x2="15" y2="20"/></svg>';
  const CLOSE_SVG =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';

  /* ---------- Texto a leer ---------- */

  function speechChunks(prose) {
    const hero = [
      document.querySelector(".tutorial-hero__title"),
      document.querySelector(".tutorial-hero__lead"),
    ].filter(Boolean);

    const body = Array.from(prose.querySelectorAll("h2, p, li"));

    return [...hero, ...body]
      .map((node) => node.textContent.replace(/\s+/g, " ").trim())
      .filter((text) => text.length > 0);
  }

  function pickSpanishVoice() {
    return window.speechSynthesis
      .getVoices()
      .find((voice) => voice.lang?.toLowerCase().startsWith("es"));
  }

  /* ---------- Barra flotante ---------- */

  function createPanel({ onToggle, onClose, onSeek }) {
    const panel = document.createElement("div");
    panel.className = "audio-bar";

    const toggleButton = document.createElement("button");
    toggleButton.type = "button";
    toggleButton.className = "audio-bar__toggle";

    const meta = document.createElement("div");
    meta.className = "audio-bar__meta";
    meta.innerHTML = `
      <div class="audio-bar__label">
        <span class="audio-bar__status">Escuchando</span>
        <span class="audio-bar__percent">0%</span>
      </div>
      <button type="button" class="audio-bar__track" aria-label="Avanzar o retroceder"><span></span></button>`;

    const closeButton = document.createElement("button");
    closeButton.type = "button";
    closeButton.className = "audio-bar__close";
    closeButton.setAttribute("aria-label", "Cerrar");
    closeButton.innerHTML = CLOSE_SVG;

    panel.append(toggleButton, meta, closeButton);
    document.body.appendChild(panel);

    const trackButton = meta.querySelector(".audio-bar__track");

    toggleButton.addEventListener("click", onToggle);
    closeButton.addEventListener("click", onClose);
    trackButton.addEventListener("click", (event) => {
      const rect = trackButton.getBoundingClientRect();

      if (rect.width === 0) return;

      onSeek((event.clientX - rect.left) / rect.width);
    });

    return {
      el: panel,
      toggleButton,
      trackButton,
      barFill: trackButton.querySelector("span"),
      statusLabel: meta.querySelector(".audio-bar__status"),
      percentLabel: meta.querySelector(".audio-bar__percent"),
    };
  }

  /* ---------- Botón y reproducción ---------- */

  function buildAudioButton(prose) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "tutorial-action";

    let panel = null;
    let chunks = [];
    let offsets = [];
    let totalChars = 0;
    let completedChars = 0;
    let currentChars = 0;
    let isPaused = false;
    let playToken = 0;

    const setIdle = () => {
      button.classList.remove("is-playing");
      button.innerHTML = `${PLAY_SVG}<span>Escuchar</span>`;
    };

    const setPlaying = () => {
      button.classList.add("is-playing");
      button.innerHTML = `${STOP_SVG}<span>Detener</span>`;
    };

    const renderPercent = () => {
      if (!panel) return;

      const ratio = totalChars
        ? Math.min(1, (completedChars + currentChars) / totalChars)
        : 0;
      const percent = Math.round(ratio * 100);

      panel.barFill.style.width = `${percent}%`;
      panel.percentLabel.textContent = `${percent}%`;
    };

    const renderToggle = () => {
      if (!panel) return;

      panel.toggleButton.innerHTML = isPaused
        ? `${PLAY_SVG}<span>Reanudar</span>`
        : `${PAUSE_SVG}<span>Pausa</span>`;
      panel.statusLabel.textContent = isPaused ? "Pausado" : "Escuchando";
    };

    const stop = () => {
      playToken += 1;
      window.speechSynthesis.cancel();
      completedChars = 0;
      currentChars = 0;
      isPaused = false;
      setIdle();

      panel?.el.remove();
      panel = null;
    };

    const togglePause = () => {
      isPaused = !isPaused;

      if (isPaused) {
        window.speechSynthesis.pause();
      } else {
        window.speechSynthesis.resume();
      }

      renderToggle();
    };

    const speakFrom = (startIndex) => {
      const token = (playToken += 1);
      const voice = pickSpanishVoice();

      window.speechSynthesis.cancel();
      completedChars = offsets[startIndex] ?? 0;
      currentChars = 0;
      isPaused = false;
      renderPercent();
      renderToggle();

      chunks.slice(startIndex).forEach((text, offset) => {
        const isLast = startIndex + offset === chunks.length - 1;
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "es-ES";
        utterance.rate = 1;

        if (voice) utterance.voice = voice;

        utterance.onboundary = (event) => {
          if (token !== playToken) return;

          currentChars = event.charIndex || 0;
          renderPercent();
        };

        utterance.onend = () => {
          if (token !== playToken) return;

          completedChars += text.length;
          currentChars = 0;
          renderPercent();

          if (isLast) stop();
        };

        window.speechSynthesis.speak(utterance);
      });
    };

    const seekToRatio = (ratio) => {
      if (chunks.length === 0) return;

      const targetChar = Math.max(0, Math.min(1, ratio)) * totalChars;
      const index = offsets.findLastIndex((offset) => offset <= targetChar);

      speakFrom(Math.max(0, index));
    };

    const play = () => {
      chunks = speechChunks(prose);

      if (chunks.length === 0) return;

      offsets = [];
      totalChars = 0;

      for (const text of chunks) {
        offsets.push(totalChars);
        totalChars += text.length;
      }

      panel = createPanel({
        onToggle: togglePause,
        onClose: stop,
        onSeek: seekToRatio,
      });

      speakFrom(0);
      setPlaying();
      renderToggle();
    };

    setIdle();

    button.addEventListener("click", () => {
      if (button.classList.contains("is-playing")) {
        stop();
        return;
      }

      play();
    });

    window.addEventListener("beforeunload", () => window.speechSynthesis.cancel());

    return button;
  }

  /* ---------- API pública ---------- */

  MentorAI.TutorialAudio = {
    isSupported: () => "speechSynthesis" in window,
    build: buildAudioButton,
  };
})();
