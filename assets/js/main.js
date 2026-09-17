// Circoletto FASF — script condiviso

document.addEventListener("DOMContentLoaded", function () {
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // menu a schermo intero
  var toggle = document.querySelector(".nav-toggle");
  var overlay = document.querySelector(".nav-overlay");
  if (toggle && overlay) {
    var setMenuOpen = function (open) {
      overlay.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      document.body.classList.toggle("nav-open", open);
    };
    toggle.addEventListener("click", function () {
      setMenuOpen(!overlay.classList.contains("open"));
    });
    overlay.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () { setMenuOpen(false); });
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") setMenuOpen(false);
    });
  }

  // evidenzia voce di menu attiva
  var current = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a").forEach(function (a) {
    var href = a.getAttribute("href");
    if (href === current) a.classList.add("active");
  });

  // header: sfondo piu marcato dopo lo scroll
  var header = document.querySelector(".site-header");
  if (header) {
    var onHeaderScroll = function () {
      header.classList.toggle("scrolled", window.scrollY > 30);
    };
    onHeaderScroll();
    window.addEventListener("scroll", onHeaderScroll, { passive: true });
  }

  // ---------- barra di progresso scroll ----------
  if (!reduceMotion) {
    var progressBar = document.createElement("div");
    progressBar.className = "scroll-progress";
    progressBar.setAttribute("aria-hidden", "true");
    document.body.appendChild(progressBar);
    var updateProgress = function () {
      var docHeight = document.documentElement.scrollHeight - window.innerHeight;
      var pct = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
      progressBar.style.width = Math.min(100, Math.max(0, pct)) + "%";
    };
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
    updateProgress();
  }

  // ---------- reveal on scroll: un ingresso diverso per ogni tipo di elemento ----------
  if (!reduceMotion && "IntersectionObserver" in window) {
    var revealConfig = [
      { selector: "h2", cls: "reveal-mask" },
      { selector: ".card, .sponsor-card, .event-card", cls: "reveal-pop" },
      { selector: ".program-row, .spazi-list li, .info-strip .item, .menu-list li", cls: "reveal-slide" },
      { selector: "blockquote, .timeline-item, .gallery-item", cls: "reveal" }
    ];
    var allRevealEls = [];
    revealConfig.forEach(function (cfg) {
      document.querySelectorAll(cfg.selector).forEach(function (el, i) {
        el.classList.add(cfg.cls);
        el.style.animationDelay = (Math.min(i % 7, 6) * 0.07) + "s";
        allRevealEls.push(el);
      });
    });

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    allRevealEls.forEach(function (el) { io.observe(el); });
  }

  // ---------- numeri che contano verso l'alto quando entrano in vista ----------
  if (!reduceMotion && "IntersectionObserver" in window) {
    var counters = document.querySelectorAll(".floating-badge strong");
    var ioCounter = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var target = parseInt(el.textContent, 10);
        if (isNaN(target)) return;
        var startVal = Math.max(0, target - 60);
        var start = null;
        var duration = 1300;
        function step(ts) {
          if (!start) start = ts;
          var progress = Math.min((ts - start) / duration, 1);
          var eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.round(startVal + (target - startVal) * eased);
          if (progress < 1) requestAnimationFrame(step);
          else el.textContent = target;
        }
        requestAnimationFrame(step);
        ioCounter.unobserve(el);
      });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { ioCounter.observe(el); });
  }

  // ---------- bordo "spotlight" sulle card al passaggio del mouse ----------
  if (!reduceMotion && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    document.querySelectorAll(".card").forEach(function (card) {
      card.addEventListener("mousemove", function (e) {
        var rect = card.getBoundingClientRect();
        card.style.setProperty("--spot-x", (e.clientX - rect.left) + "px");
        card.style.setProperty("--spot-y", (e.clientY - rect.top) + "px");
      });
    });
  }

  // ---------- titolo hero: rivelazione parola per parola ----------
  var headline = document.querySelector(".hero h1, .page-hero h1");
  if (headline && !reduceMotion) {
    (function wrapWords(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (child) {
        if (child.nodeType === 3) {
          var text = child.textContent;
          if (!text.replace(/\s/g, "").length) return;
          var frag = document.createDocumentFragment();
          text.split(/(\s+)/).forEach(function (part) {
            if (part.trim() === "") {
              if (part.length) frag.appendChild(document.createTextNode(part));
            } else {
              var span = document.createElement("span");
              span.className = "word";
              span.textContent = part;
              frag.appendChild(span);
            }
          });
          node.replaceChild(frag, child);
        } else if (child.nodeType === 1 && child.tagName !== "BR") {
          wrapWords(child);
        }
      });
    })(headline);

    headline.classList.add("word-split");
    var words = headline.querySelectorAll(".word");
    words.forEach(function (w, i) {
      w.style.animationDelay = (i * 0.05) + "s";
    });
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        headline.classList.add("in-view");
      });
    });
  }

  // ---------- parallax scroll ----------
  if (!reduceMotion) {
    var parallaxGroups = [
      { selector: ".hero-logo", speed: 0.10 },
      { selector: ".page-hero > img", speed: 0.10 },
      { selector: ".two-col img", speed: 0.06 },
      { selector: ".map-wrap img", speed: 0.05 }
    ];
    var parallaxEls = [];
    parallaxGroups.forEach(function (g) {
      document.querySelectorAll(g.selector).forEach(function (el) {
        parallaxEls.push({ el: el, speed: g.speed });
      });
    });

    if (parallaxEls.length) {
      var ticking = false;
      var updateParallax = function () {
        var vh = window.innerHeight;
        parallaxEls.forEach(function (item) {
          var rect = item.el.getBoundingClientRect();
          var center = rect.top + rect.height / 2;
          var offset = (vh / 2 - center) * item.speed;
          offset = Math.max(-40, Math.min(40, offset));
          item.el.style.transform = "translateY(" + offset.toFixed(1) + "px)";
        });
        ticking = false;
      };
      window.addEventListener("scroll", function () {
        if (!ticking) {
          requestAnimationFrame(updateParallax);
          ticking = true;
        }
      }, { passive: true });
      window.addEventListener("resize", updateParallax);
      updateParallax();
    }
  }

  // ---------- parallax cinematico sulla foto dell'hero ----------
  var heroLayer = document.querySelector(".hero-photo .photo-layer");
  if (heroLayer && !reduceMotion) {
    var heroSection = document.querySelector(".hero-photo");
    var tickingHero = false;
    var updateHeroParallax = function () {
      var vh = window.innerHeight;
      var progress = Math.min(1, Math.max(0, window.scrollY / (heroSection.offsetHeight || vh)));
      var translate = progress * 50;
      var scale = 1 + progress * 0.14;
      heroLayer.style.transform = "translateY(" + translate.toFixed(1) + "px) scale(" + scale.toFixed(3) + ")";
      tickingHero = false;
    };
    window.addEventListener("scroll", function () {
      if (!tickingHero) {
        requestAnimationFrame(updateHeroParallax);
        tickingHero = true;
      }
    }, { passive: true });
    updateHeroParallax();
  }

  // ---------- hero a scorrimento automatico (foto casuali dalla galleria) ----------
  var slideshowLayer = document.querySelector(".hero-photo.hero-slideshow .photo-layer");
  if (slideshowLayer) {
    fetch("assets/img/galleria/manifest.json")
      .then(function (r) { return r.json(); })
      .then(function (manifest) {
        var files = manifest.files.slice();
        for (var i = files.length - 1; i > 0; i--) {
          var j = Math.floor(Math.random() * (i + 1));
          var tmp = files[i]; files[i] = files[j]; files[j] = tmp;
        }
        var chosen = files.slice(0, 8);
        chosen.forEach(function (name, i) {
          var img = document.createElement("img");
          img.className = "slide" + (i === 0 ? " active" : "");
          img.src = manifest.path + name;
          img.alt = "Sant'Egidio in Festa";
          img.loading = i === 0 ? "eager" : "lazy";
          slideshowLayer.appendChild(img);
        });

        if (!reduceMotion && chosen.length > 1) {
          var slides = slideshowLayer.querySelectorAll(".slide");
          var current = 0;
          setInterval(function () {
            slides[current].classList.remove("active");
            current = (current + 1) % slides.length;
            slides[current].classList.add("active");
          }, 4500);
        }
      })
      .catch(function () {});
  }

  // ---------- evidenzia la serata di oggi nel programma ----------
  (function () {
    var now = new Date();
    var todayStr = now.getFullYear() + "-" + String(now.getMonth() + 1).padStart(2, "0") + "-" + String(now.getDate()).padStart(2, "0");
    document.querySelectorAll(".program-row[data-date]").forEach(function (row) {
      if (row.getAttribute("data-date") === todayStr) {
        row.classList.add("today");
      }
    });
  })();

  // ---------- planimetria interattiva ----------
  document.querySelectorAll(".map-pin").forEach(function (pin) {
    pin.addEventListener("click", function () {
      var target = document.getElementById(pin.getAttribute("data-target"));
      if (!target) return;
      target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
      document.querySelectorAll(".spazi-list li.highlight").forEach(function (li) {
        li.classList.remove("highlight");
      });
      target.classList.add("highlight");
      setTimeout(function () { target.classList.remove("highlight"); }, 1800);
    });
  });

  // ---------- menu della festa: tab interattive ----------
  var menuTabs = document.querySelectorAll(".menu-tab");
  if (menuTabs.length) {
    menuTabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        var target = tab.getAttribute("data-menu-tab");

        menuTabs.forEach(function (t) {
          t.classList.remove("active");
          t.setAttribute("aria-selected", "false");
        });
        tab.classList.add("active");
        tab.setAttribute("aria-selected", "true");

        document.querySelectorAll(".menu-panel").forEach(function (panel) {
          var isTarget = panel.getAttribute("data-menu-panel") === target;
          panel.classList.toggle("active", isTarget);
          panel.hidden = !isTarget;
        });
      });
    });
  }

  // ---------- lightbox galleria ----------
  var lightbox = document.getElementById("lightbox");
  if (lightbox) {
    var lightboxImg = lightbox.querySelector(".lightbox-img");
    var lightboxCounter = lightbox.querySelector(".lightbox-counter");
    var currentSet = [];
    var currentIndex = 0;

    var showSlide = function () {
      var item = currentSet[currentIndex];
      lightboxImg.src = item.href;
      lightboxImg.alt = item.alt;
      lightboxCounter.textContent = (currentIndex + 1) + " / " + currentSet.length;
    };

    var openLightbox = function (set, index) {
      currentSet = set;
      currentIndex = index;
      showSlide();
      lightbox.classList.add("open");
      document.body.style.overflow = "hidden";
    };

    var closeLightbox = function () {
      lightbox.classList.remove("open");
      document.body.style.overflow = "";
    };

    var showNext = function () {
      currentIndex = (currentIndex + 1) % currentSet.length;
      showSlide();
    };

    var showPrev = function () {
      currentIndex = (currentIndex - 1 + currentSet.length) % currentSet.length;
      showSlide();
    };

    document.querySelectorAll(".night-block").forEach(function (block) {
      var links = Array.prototype.slice.call(block.querySelectorAll(".gallery-item"));
      var set = links.map(function (a) {
        return { href: a.getAttribute("href"), alt: a.querySelector("img") ? a.querySelector("img").alt : "" };
      });
      links.forEach(function (a, i) {
        a.addEventListener("click", function (e) {
          e.preventDefault();
          openLightbox(set, i);
        });
      });
    });

    lightbox.querySelector(".lightbox-close").addEventListener("click", closeLightbox);
    lightbox.querySelector(".lightbox-next").addEventListener("click", showNext);
    lightbox.querySelector(".lightbox-prev").addEventListener("click", showPrev);

    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener("keydown", function (e) {
      if (!lightbox.classList.contains("open")) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") showNext();
      if (e.key === "ArrowLeft") showPrev();
    });
  }

  // ---------- rivelazione a tendina delle immagini ----------
  if (!reduceMotion && "IntersectionObserver" in window) {
    var curtainEls = document.querySelectorAll(".two-col img, .map-wrap img, .photo-frame img");
    curtainEls.forEach(function (el) { el.classList.add("img-reveal"); });

    var ioImg = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            ioImg.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    curtainEls.forEach(function (el) { ioImg.observe(el); });
  }

  // ---------- cursore personalizzato ----------
  if (!reduceMotion && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    var dot = document.createElement("div");
    dot.className = "cursor-dot";
    var ring = document.createElement("div");
    ring.className = "cursor-ring";
    document.body.appendChild(dot);
    document.body.appendChild(ring);
    document.body.classList.add("custom-cursor");

    var mouseX = 0, mouseY = 0, ringX = 0, ringY = 0, cursorShown = false;

    window.addEventListener("mousemove", function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.left = mouseX + "px";
      dot.style.top = mouseY + "px";
      if (!cursorShown) {
        dot.classList.add("visible");
        ring.classList.add("visible");
        cursorShown = true;
      }
    });

    document.addEventListener("mouseleave", function () {
      dot.classList.remove("visible");
      ring.classList.remove("visible");
      cursorShown = false;
    });

    (function animateRing() {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      ring.style.left = ringX + "px";
      ring.style.top = ringY + "px";
      requestAnimationFrame(animateRing);
    })();

    var hoverSelector = "a, button, .btn, .card, .map-pin, .gallery-item, input, textarea, select";
    document.addEventListener("mouseover", function (e) {
      if (e.target.closest && e.target.closest(hoverSelector)) {
        dot.classList.add("hovering");
        ring.classList.add("hovering");
      }
    });
    document.addEventListener("mouseout", function (e) {
      if (e.target.closest && e.target.closest(hoverSelector)) {
        dot.classList.remove("hovering");
        ring.classList.remove("hovering");
      }
    });
  }

  // ---------- bottoni magnetici ----------
  if (!reduceMotion && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    document.querySelectorAll(".btn").forEach(function (btn) {
      btn.addEventListener("mousemove", function (e) {
        var r = btn.getBoundingClientRect();
        var x = e.clientX - (r.left + r.width / 2);
        var y = e.clientY - (r.top + r.height / 2);
        btn.style.transform = "translate(" + (x * 0.25).toFixed(1) + "px," + (y * 0.25).toFixed(1) + "px)";
      });
      btn.addEventListener("mouseleave", function () {
        btn.style.transform = "";
      });
    });
  }
});
