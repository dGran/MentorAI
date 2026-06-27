/* ============================================================
   MentorAI — Página de tutorial: audio, progreso y navegación de ruta
   Sin dependencias. Funciona por file://. Parte de window.MentorAI.
   ============================================================ */

(function () {
  "use strict";

  var MentorAI = (window.MentorAI = window.MentorAI || {});

  /* ---------- Página de tutorial: audio, progreso y ruta ----------
     Mejoras inyectadas por JS según el slug del fichero, para no editar
     a mano cada tutorial: lector por voz (Web Speech), marca de
     completado (Progress) y navegación dentro de la ruta de aprendizaje. */
  function initTutorialPage() {
    const prose = document.querySelector("article.prose");

    if (!prose) {
      return;
    }

    const slug = MentorAI.currentTutorialSlug();

    injectTutorialActions(slug, prose);
    injectCourseCrumb(slug);
    injectRouteNav(slug, prose);
    initTocToggle();
  }

  function courseOfSlug(slug) {
    const sequence = courseSequence();

    for (let index = 0; index < sequence.length; index += 1) {
      if (sequence[index].slug === slug) {
        return sequence[index].course;
      }
    }

    return null;
  }

  function injectCourseCrumb(slug) {
    const breadcrumb = document.querySelector(".breadcrumb");

    if (!breadcrumb) {
      return;
    }

    const course = courseOfSlug(slug);
    const topicSpan = breadcrumb.querySelector("span");
    const separator = breadcrumb.querySelector("svg");

    if (!course || !topicSpan || !separator) {
      return;
    }

    const link = document.createElement("a");
    link.href = "../curso.html?slug=" + encodeURIComponent(course.slug);
    link.textContent = course.title;

    breadcrumb.insertBefore(link, topicSpan);
    breadcrumb.insertBefore(separator.cloneNode(true), topicSpan);
  }

  function escapeAttr(text) {
    return String(text)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  MentorAI.currentTutorialSlug = function () {
    const path = window.location.pathname;
    const file = path.substring(path.lastIndexOf("/") + 1);

    return file.replace(/\.html$/, "");
  }

  function basename(href) {
    return String(href || "").substring(String(href || "").lastIndexOf("/") + 1);
  }

  const PLAY_SVG =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="6 4 20 12 6 20 6 4"/></svg>';
  const STOP_SVG =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="6" width="12" height="12" rx="2"/></svg>';
  const PAUSE_SVG =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="9" y1="4" x2="9" y2="20"/><line x1="15" y1="4" x2="15" y2="20"/></svg>';
  const DONE_SVG =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';
  const CLOSE_SVG =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';
  const RESET_SVG =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-4.5"/></svg>';
  const CHEVRON_SVG =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>';

  function initTocToggle() {
    const toc = document.querySelector(".toc");

    if (!toc) {
      return;
    }

    const title = toc.querySelector(".toc__title");
    const list = toc.querySelector(".toc__list");

    if (!title || !list) {
      return;
    }

    const toggle = document.createElement("button");
    toggle.className = "toc__toggle";
    toggle.innerHTML = title.textContent + CHEVRON_SVG;
    toc.insertBefore(toggle, title);
    title.hidden = true;

    toggle.addEventListener("click", function () {
      toc.classList.toggle("is-open");
    });
  }

  function buildResetButton(slug, doneBtn) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "tutorial-action tutorial-action--reset";
    button.innerHTML = RESET_SVG + "<span>Reiniciar</span>";

    button.addEventListener("click", function () {
      MentorAI.Progress.remove([slug]);
      MentorAI.Reading.clear([slug]);
      doneBtn.click();

      if (MentorAI.Progress.has(slug)) {
        doneBtn.click();
      }
    });

    return button;
  }

  function injectTutorialActions(slug, prose) {
    const host = document.querySelector(".tutorial-hero .container");

    if (!host) {
      return;
    }

    const actions = document.createElement("div");
    actions.className = "tutorial-actions";

    const hasSpeech = "speechSynthesis" in window;
    const audioBtn = hasSpeech ? buildAudioButton(prose) : null;
    const doneBtn = buildDoneButton(slug);
    const resetBtn = buildResetButton(slug, doneBtn);

    if (audioBtn) {
      actions.appendChild(audioBtn);
    }

    actions.appendChild(doneBtn);
    actions.appendChild(resetBtn);
    host.appendChild(actions);

    const progress = buildCourseProgress(slug);

    if (progress) {
      host.appendChild(progress.el);
      doneBtn.addEventListener("click", progress.update);
      resetBtn.addEventListener("click", progress.update);
    }
  }

  function courseLessons(course) {
    if (Array.isArray(course.modules)) {
      return course.modules.reduce(function (all, module) {
        return all.concat(module.lessons || []);
      }, []);
    }

    return course.lessons || [];
  }

  function buildCourseProgress(slug) {
    const course = courseOfSlug(slug);

    if (!course) {
      return null;
    }

    const manifest = manifestBySlug();
    const published = courseLessons(course).filter(function (lessonSlug) {
      return isPublishedTutorial(manifest[lessonSlug]);
    });

    if (published.length === 0) {
      return null;
    }

    const el = document.createElement("div");
    el.className = "tutorial-progress";
    el.innerHTML =
      '<div class="tutorial-progress__bar"><span></span></div>' +
      '<span class="tutorial-progress__label"></span>';

    const fill = el.querySelector(".tutorial-progress__bar span");
    const label = el.querySelector(".tutorial-progress__label");

    const update = function () {
      const done = published.filter(function (lessonSlug) {
        return MentorAI.Progress.has(lessonSlug);
      }).length;
      const percent = Math.round((done / published.length) * 100);

      fill.style.width = percent + "%";
      label.textContent =
        percent + "% del curso · " + done + " / " + published.length + " completadas";
    };

    update();

    return { el: el, update: update };
  }

  function speechChunks(prose) {
    const sources = [];
    const title = document.querySelector(".tutorial-hero__title");
    const lead = document.querySelector(".tutorial-hero__lead");

    if (title) {
      sources.push(title);
    }

    if (lead) {
      sources.push(lead);
    }

    prose.querySelectorAll("h2, p, li").forEach(function (node) {
      sources.push(node);
    });

    return sources
      .map(function (node) {
        return node.textContent.replace(/\s+/g, " ").trim();
      })
      .filter(function (text) {
        return text.length > 0;
      });
  }

  function pickSpanishVoice() {
    const voices = window.speechSynthesis.getVoices();

    return voices.filter(function (voice) {
      return voice.lang && voice.lang.toLowerCase().indexOf("es") === 0;
    })[0];
  }

  function buildAudioButton(prose) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "tutorial-action";

    let panel = null;
    let toggleButton = null;
    let barFill = null;
    let trackButton = null;
    let percentLabel = null;
    let statusLabel = null;

    let chunks = [];
    let offsets = [];
    let totalChars = 0;
    let completedChars = 0;
    let currentChars = 0;
    let isPaused = false;
    let playToken = 0;

    const setIdle = function () {
      button.classList.remove("is-playing");
      button.innerHTML = PLAY_SVG + "<span>Escuchar</span>";
    };

    const setPlaying = function () {
      button.classList.add("is-playing");
      button.innerHTML = STOP_SVG + "<span>Detener</span>";
    };

    setIdle();

    const renderPercent = function () {
      const ratio = totalChars
        ? Math.min(1, (completedChars + currentChars) / totalChars)
        : 0;
      const percent = Math.round(ratio * 100);

      if (barFill) {
        barFill.style.width = percent + "%";
      }

      if (percentLabel) {
        percentLabel.textContent = percent + "%";
      }
    };

    const removePanel = function () {
      if (panel) {
        panel.remove();
        panel = null;
        toggleButton = null;
        barFill = null;
        trackButton = null;
        percentLabel = null;
        statusLabel = null;
      }
    };

    const stop = function () {
      playToken += 1;
      window.speechSynthesis.cancel();
      completedChars = 0;
      currentChars = 0;
      isPaused = false;
      setIdle();
      removePanel();
    };

    const setToggleLabel = function () {
      if (toggleButton) {
        toggleButton.innerHTML = isPaused
          ? PLAY_SVG + "<span>Reanudar</span>"
          : PAUSE_SVG + "<span>Pausa</span>";
      }

      if (statusLabel) {
        statusLabel.textContent = isPaused ? "Pausado" : "Escuchando";
      }
    };

    const togglePause = function () {
      if (isPaused) {
        window.speechSynthesis.resume();
        isPaused = false;
        setToggleLabel();
        return;
      }

      window.speechSynthesis.pause();
      isPaused = true;
      setToggleLabel();
    };

    const buildPanel = function () {
      panel = document.createElement("div");
      panel.className = "audio-bar";

      toggleButton = document.createElement("button");
      toggleButton.type = "button";
      toggleButton.className = "audio-bar__toggle";

      const meta = document.createElement("div");
      meta.className = "audio-bar__meta";
      meta.innerHTML =
        '<div class="audio-bar__label"><span class="audio-bar__status">Escuchando</span>' +
        '<span class="audio-bar__percent">0%</span></div>' +
        '<button type="button" class="audio-bar__track" aria-label="Avanzar o retroceder"><span></span></button>';
      statusLabel = meta.querySelector(".audio-bar__status");
      percentLabel = meta.querySelector(".audio-bar__percent");
      trackButton = meta.querySelector(".audio-bar__track");
      barFill = trackButton.querySelector("span");

      const closeButton = document.createElement("button");
      closeButton.type = "button";
      closeButton.className = "audio-bar__close";
      closeButton.setAttribute("aria-label", "Cerrar");
      closeButton.innerHTML = CLOSE_SVG;

      panel.appendChild(toggleButton);
      panel.appendChild(meta);
      panel.appendChild(closeButton);
      document.body.appendChild(panel);

      toggleButton.addEventListener("click", togglePause);
      closeButton.addEventListener("click", stop);
      trackButton.addEventListener("click", function (event) {
        const rect = trackButton.getBoundingClientRect();

        if (rect.width === 0) {
          return;
        }

        seekToRatio((event.clientX - rect.left) / rect.width);
      });
      setToggleLabel();
    };

    const speakFrom = function (startIndex) {
      const token = (playToken += 1);
      const voice = pickSpanishVoice();

      window.speechSynthesis.cancel();
      completedChars = offsets[startIndex] || 0;
      currentChars = 0;
      isPaused = false;
      renderPercent();
      setToggleLabel();

      for (let index = startIndex; index < chunks.length; index += 1) {
        const text = chunks[index];
        const length = text.length;
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "es-ES";
        utterance.rate = 1;

        if (voice) {
          utterance.voice = voice;
        }

        utterance.onboundary = function (event) {
          if (token !== playToken) {
            return;
          }

          currentChars = event.charIndex || 0;
          renderPercent();
        };

        utterance.onend = function () {
          if (token !== playToken) {
            return;
          }

          completedChars += length;
          currentChars = 0;
          renderPercent();

          if (index === chunks.length - 1) {
            stop();
          }
        };

        window.speechSynthesis.speak(utterance);
      }
    };

    const seekToRatio = function (ratio) {
      if (chunks.length === 0) {
        return;
      }

      const targetChar = Math.max(0, Math.min(1, ratio)) * totalChars;
      let index = 0;

      while (index < chunks.length - 1 && offsets[index + 1] <= targetChar) {
        index += 1;
      }

      speakFrom(index);
    };

    const play = function () {
      chunks = speechChunks(prose);

      if (chunks.length === 0) {
        return;
      }

      offsets = [];
      totalChars = 0;

      chunks.forEach(function (text) {
        offsets.push(totalChars);
        totalChars += text.length;
      });

      buildPanel();
      speakFrom(0);
      setPlaying();
    };

    button.addEventListener("click", function () {
      if (button.classList.contains("is-playing")) {
        stop();
        return;
      }

      play();
    });

    window.addEventListener("beforeunload", function () {
      window.speechSynthesis.cancel();
    });

    return button;
  }

  function buildDoneButton(slug) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "tutorial-action tutorial-action--done";

    const paint = function (isDone) {
      button.classList.toggle("is-done", isDone);
      button.innerHTML = isDone
        ? DONE_SVG + "<span>Completado</span>"
        : DONE_SVG + "<span>Marcar como completado</span>";
    };

    paint(MentorAI.Progress.has(slug));

    button.addEventListener("click", function () {
      paint(MentorAI.Progress.toggle(slug));
    });

    return button;
  }

  function courseSequence() {
    const sequence = [];

    (window.MENTORAI_COURSES || []).forEach(function (course) {
      const modules = Array.isArray(course.modules)
        ? course.modules
        : [{ title: "", lessons: course.lessons || [] }];

      modules.forEach(function (module) {
        (module.lessons || []).forEach(function (slug, position) {
          sequence.push({
            slug: slug,
            course: course,
            module: module,
            position: position,
          });
        });
      });
    });

    return sequence;
  }

  function manifestBySlug() {
    const map = {};

    (window.ACADEMIA_TUTORIALS || []).forEach(function (tutorial) {
      map[tutorial.slug] = tutorial;
    });

    return map;
  }

  function isPublishedTutorial(tutorial) {
    return Boolean(tutorial) && tutorial.status !== "soon";
  }

  function neighborLink(manifest, sequence, fromIndex, direction) {
    for (let index = fromIndex + direction; index >= 0 && index < sequence.length; index += direction) {
      const tutorial = manifest[sequence[index].slug];

      if (isPublishedTutorial(tutorial)) {
        return tutorial;
      }
    }

    return null;
  }

  function relatedInModule(manifest, module, slug) {
    return (module.lessons || [])
      .filter(function (lessonSlug) {
        return lessonSlug !== slug && isPublishedTutorial(manifest[lessonSlug]);
      })
      .map(function (lessonSlug) {
        return manifest[lessonSlug];
      });
  }

  function buildRouteNav(manifest, sequence, index) {
    const current = sequence[index];
    const course = current.course;
    const module = current.module;
    const prev = neighborLink(manifest, sequence, index, -1);
    const next = neighborLink(manifest, sequence, index, 1);

    const moduleLabel = module.title
      ? escapeAttr(course.title) + " · " + escapeAttr(module.title)
      : escapeAttr(course.title);
    const crumb =
      '<p class="route-nav__crumb"><a href="../curso.html?slug=' +
      encodeURIComponent(course.slug) +
      '">' +
      moduleLabel +
      "</a> · lección " +
      (current.position + 1) +
      " de " +
      (module.lessons || []).length +
      "</p>";

    const prevLink = prev
      ? '<a href="' +
        escapeAttr(basename(prev.href)) +
        '"><small>← Anterior</small><b>' +
        escapeAttr(prev.title) +
        "</b></a>"
      : "";

    const nextLink = next
      ? '<a href="' +
        escapeAttr(basename(next.href)) +
        '" class="next"><small>Siguiente →</small><b>' +
        escapeAttr(next.title) +
        "</b></a>"
      : '<a href="../curso.html?slug=' +
        encodeURIComponent(course.slug) +
        '" class="next"><small>Fin del curso →</small><b>Volver al curso</b></a>';

    const related = relatedInModule(manifest, module, current.slug);

    const relatedBlock =
      related.length === 0
        ? ""
        : '<div class="route-related"><p class="route-related__title">Más en «' +
          escapeAttr(module.title || course.title) +
          '»</p><ul>' +
          related
            .map(function (tutorial) {
              return (
                '<li><a href="' +
                escapeAttr(basename(tutorial.href)) +
                '">' +
                escapeAttr(tutorial.title) +
                '<span>' +
                escapeAttr(tutorial.minutes) +
                " min</span></a></li>"
              );
            })
            .join("") +
          "</ul></div>";

    return (
      '<nav class="route-nav">' +
      crumb +
      '<div class="tutorial-nav">' +
      prevLink +
      nextLink +
      "</div>" +
      relatedBlock +
      "</nav>"
    );
  }

  function injectRouteNav(slug, prose) {
    const sequence = courseSequence();
    const index = sequence
      .map(function (step) {
        return step.slug;
      })
      .indexOf(slug);

    if (index === -1) {
      return;
    }

    const manifest = manifestBySlug();
    const manualNav = prose.querySelector(".tutorial-nav");
    const html = buildRouteNav(manifest, sequence, index);

    if (manualNav) {
      manualNav.insertAdjacentHTML("beforebegin", html);
      manualNav.remove();
      return;
    }

    prose.insertAdjacentHTML("beforeend", html);
  }

  MentorAI.initTutorialPage = initTutorialPage;
})();
