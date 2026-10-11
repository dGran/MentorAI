(function () {
  "use strict";

  const MentorAI = (window.MentorAI = window.MentorAI || {});

  const UNDO_WINDOW_MS = 8000;
  const UNDO_LABEL = "Deshacer";
  const OPEN_CLASS = "is-open";

  let region = null;
  let pendingTimer = null;
  let pendingUndo = null;

  const messageOf = () => region.querySelector(".undo-toast__message");
  const actionOf = () => region.querySelector(".undo-toast__action");

  function ensureRegion() {
    if (region?.isConnected) return;

    region = document.createElement("div");
    region.className = "undo-toast";
    region.innerHTML = `<span class="undo-toast__message" role="status"></span><button type="button" class="undo-toast__action" hidden>${UNDO_LABEL}</button>`;
    actionOf().addEventListener("click", undo);
    region.addEventListener("focusin", pauseTimer);
    region.addEventListener("mouseenter", pauseTimer);
    region.addEventListener("focusout", startTimer);
    region.addEventListener("mouseleave", startTimer);
    document.body.appendChild(region);
  }

  function moveFocusToHeading() {
    const heading = document.querySelector("h1");

    if (!heading) return;

    heading.tabIndex = -1;
    heading.focus();
  }

  function pauseTimer() {
    clearTimeout(pendingTimer);
    pendingTimer = null;
  }

  function startTimer() {
    pauseTimer();

    if (!pendingUndo) return;

    const isInside = region.contains(document.activeElement) || region.matches(":hover");

    if (isInside) return;

    pendingTimer = setTimeout(dismiss, UNDO_WINDOW_MS);
  }

  function dismiss() {
    pauseTimer();
    pendingUndo = null;

    if (!region) return;

    const hadFocus = region.contains(document.activeElement);

    region.classList.remove(OPEN_CLASS);
    actionOf().hidden = true;
    messageOf().textContent = "";

    if (hadFocus) moveFocusToHeading();
  }

  function undo() {
    const onUndo = pendingUndo;

    dismiss();
    onUndo?.();
  }

  function offerUndo(message, onUndo) {
    ensureRegion();
    dismiss();
    pendingUndo = onUndo;
    region.classList.add(OPEN_CLASS);
    actionOf().hidden = false;
    requestAnimationFrame(() => (messageOf().textContent = message));
    actionOf().focus();
    pendingTimer = setTimeout(dismiss, UNDO_WINDOW_MS);
  }

  MentorAI.offerUndo = offerUndo;
})();
