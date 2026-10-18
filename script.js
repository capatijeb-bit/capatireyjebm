const events = [
  { id: 1, title: "City Run Challenge", category: "Running", date: "October 26, 2026", shortDate: "Oct 26, 2026", location: "Manila, Philippines", distances: ["5K", "10K", "21K"], price: 350, maxPrice: 1200, slots: 120, image: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=900&q=85", description: "Take on a city road race with distance options for first-time runners and experienced athletes.", soldOut: false },
  { id: 2, title: "Tour de Clark", category: "Cycling", date: "November 9, 2026", shortDate: "Nov 9, 2026", location: "Clark, Pampanga", distances: ["50K", "100K"], price: 800, maxPrice: 1500, slots: 80, image: "https://images.unsplash.com/photo-1541625602330-2277a4c46182?auto=format&fit=crop&w=900&q=85", description: "Ride through a scenic road course designed for recreational and competitive cyclists.", soldOut: false },
  { id: 3, title: "Lakeside Triathlon", category: "Duathlon & Triathlon", date: "November 23, 2026", shortDate: "Nov 23, 2026", location: "Laguna, Philippines", distances: ["750m / 20K / 5K", "Sprint"], price: 1500, maxPrice: 3000, slots: 60, image: "https://images.unsplash.com/photo-1534787238916-9ba6764efd4f?auto=format&fit=crop&w=900&q=85", description: "Combine swimming, cycling, and running in a multisport challenge for determined athletes.", soldOut: false },
  { id: 4, title: "Forest Edge Trail Run", category: "Trail Running", date: "December 7, 2026", shortDate: "Dec 7, 2026", location: "Tanay, Rizal", distances: ["5K", "12K", "25K"], price: 600, maxPrice: 1800, slots: 95, image: "https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=900&q=85", description: "Explore forest paths and rolling terrain in an outdoor trail running experience.", soldOut: false },
  { id: 5, title: "Urban Warrior Challenge", category: "Obstacle Course", date: "December 14, 2026", shortDate: "Dec 14, 2026", location: "Quezon City, Philippines", distances: ["3K", "8K"], price: 700, maxPrice: 1400, slots: 45, image: "https://images.unsplash.com/photo-1533561052604-c3beb6d55b8d?auto=format&fit=crop&w=900&q=85", description: "Test your strength, balance, and endurance with a series of fun outdoor obstacles.", soldOut: false },
  { id: 6, title: "Mountain Trail Challenge", category: "Trail Running", date: "November 16, 2026", shortDate: "Nov 16, 2026", location: "Mt. Pulag, Benguet", distances: ["12K", "25K", "50K"], price: 1200, maxPrice: 2500, slots: 320, image: "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=900&q=85", description: "Experience the beauty and challenge of mountain trails. Choose your distance and be part of an unforgettable race.", soldOut: false },
  { id: 7, title: "Pampanga Duathlon", category: "Duathlon & Triathlon", date: "January 11, 2027", shortDate: "Jan 11, 2027", location: "San Fernando, Pampanga", distances: ["Run-Bike-Run"], price: 950, maxPrice: 1800, slots: 0, image: "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=900&q=85", description: "A run-bike-run event built for athletes who enjoy switching between disciplines.", soldOut: true },
  { id: 8, title: "Sunrise 10K", category: "Running", date: "January 18, 2027", shortDate: "Jan 18, 2027", location: "Pasig, Metro Manila", distances: ["5K", "10K"], price: 450, maxPrice: 900, slots: 150, image: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=900&q=85", description: "Start your morning with a friendly road race made for new runners and seasoned racers alike.", soldOut: false }
];

const $ = (selector) => document.querySelector(selector);
const eventGrid = $("#eventGrid");
const searchInput = $("#eventSearch");
const categoryFilter = $("#categoryFilter");
const availabilityFilter = $("#availabilityFilter");
const emptyState = $("#emptyState");
const modalBackdrop = $("#modalBackdrop");
const modalContent = $("#modalContent");
const toast = $("#toast");
let toastTimer;

function getRegistrations() {
  try { return JSON.parse(localStorage.getItem("racegridRegistrations") || "[]"); }
  catch { return []; }
}
function saveRegistrations(registrations) {
  localStorage.setItem("racegridRegistrations", JSON.stringify(registrations));
  updateRegistrationCounts();
}
function updateRegistrationCounts() {
  const count = getRegistrations().length;
  $("#registrationCount").textContent = count;
  $("#statRegistrations").textContent = count;
}
function money(value) { return new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP", maximumFractionDigits: 0 }).format(value); }

function renderEvents() {
  const query = searchInput.value.trim().toLowerCase();
  const category = categoryFilter.value;
  const availability = availabilityFilter.value;
  const filtered = events.filter(event => {
    const matchesQuery = `${event.title} ${event.location} ${event.category} ${event.distances.join(" ")}`.toLowerCase().includes(query);
    const matchesCategory = category === "All" || event.category === category;
    const matchesAvailability = availability === "All" || (availability === "Available" ? !event.soldOut && event.slots > 0 : event.soldOut || event.slots === 0);
    return matchesQuery && matchesCategory && matchesAvailability;
  });
  eventGrid.innerHTML = filtered.map(event => `
    <article class="event-card">
      <div class="event-card-image">
        <img src="${event.image}" alt="${event.title}" loading="lazy">
        <span class="event-tag">${event.category}</span>
      </div>
      <div class="event-card-body">
        <h3>${event.title}</h3>
        <p class="event-detail"><span class="detail-icon">▦</span><span>${event.shortDate}</span></p>
        <p class="event-detail"><span class="detail-icon">⌖</span><span>${event.location}</span></p>
        <p class="event-detail"><span class="detail-icon">↗</span><span>${event.distances.join(" · ")}</span></p>
        <div class="event-card-bottom">
          <span class="event-price">${money(event.price)}${event.maxPrice !== event.price ? `–${money(event.maxPrice)}` : ""}</span>
          ${event.soldOut || event.slots === 0 ? '<span class="sold-out-label">SOLD OUT</span>' : `<button class="mini-button" data-open-event="${event.id}">VIEW EVENT ↗</button>`}
        </div>
        <div class="slots">${event.soldOut || event.slots === 0 ? "No slots available" : `${event.slots} sample slots available`}</div>
      </div>
    </article>`).join("");
  emptyState.hidden = filtered.length !== 0;
}

function showToast(message, isError = false) {
  toast.textContent = message;
  toast.classList.remove("show", "err");
  void toast.offsetWidth;
  toast.classList.add("show");
  if (isError) toast.classList.add("err");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show", "err"), 2800);
}

function launchConfetti() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const colors = ["#b6ff1a", "#d9ff66", "#ffffff", "#7dbb00", "#f59e0b"];
  for (let i = 0; i < 40; i++) {
    const piece = document.createElement("span");
    piece.className = "confetti";
    piece.style.left = Math.random() * 100 + "vw";
    piece.style.background = colors[i % colors.length];
    piece.style.setProperty("--dx", (Math.random() * 200 - 100) + "px");
    piece.style.animationDuration = (1.6 + Math.random() * 1.4) + "s";
    piece.style.animationDelay = Math.random() * 0.3 + "s";
    document.body.appendChild(piece);
    setTimeout(() => piece.remove(), 3500);
  }
}
function openModal(content) {
  modalContent.innerHTML = content;
  modalBackdrop.hidden = false;
  document.body.style.overflow = "hidden";
  $("#modalClose").focus();
}
function closeModal() {
  modalBackdrop.hidden = true;
  document.body.style.overflow = "";
}
function openEvent(id) {
  const event = events.find(item => item.id === Number(id));
  if (!event) return;
  if (event.soldOut || event.slots <= 0) {
    showToast("This sample event is sold out.", true);
    return;
  }
  const options = event.distances.map(distance => `<option value="${distance}">${distance}</option>`).join("");
  openModal(`
    <p class="modal-kicker">${event.category} · EVENT DETAILS</p>
    <img class="modal-hero" src="${event.image}" alt="${event.title}">
    <h2 id="modalTitle">${event.title}</h2>
    <p>${event.description}</p>
    <div class="modal-meta">
      <div class="meta-box"><small>DATE</small><strong>${event.date}</strong></div>
      <div class="meta-box"><small>LOCATION</small><strong>${event.location}</strong></div>
      <div class="meta-box"><small>DISTANCES</small><strong>${event.distances.join(", ")}</strong></div>
      <div class="meta-box"><small>REGISTRATION FEE</small><strong>${money(event.price)}${event.maxPrice !== event.price ? "–" + money(event.maxPrice) : ""}</strong></div>
    </div>
    <p class="form-note">${event.slots} sample slots currently available. This is a student demonstration using sample event data.</p>
    <button class="button button-primary" id="startRegistration">REGISTER FOR THIS EVENT <span>↗</span></button>
  `);
  $("#startRegistration").addEventListener("click", () => openRegistration(event.id));
}
function openRegistration(id) {
  const event = events.find(item => item.id === Number(id));
  if (!event || event.soldOut || event.slots <= 0) return;
  const options = event.distances.map(distance => `<option value="${distance}">${distance}</option>`).join("");
  openModal(`
    <p class="modal-kicker">RACEGRID REGISTRATION</p>
    <h2 id="modalTitle">Join ${event.title}</h2>
    <p>Enter your details below to create a sample registration.</p>
    <form id="registrationForm">
      <div class="form-grid">
        <div class="form-field full"><label for="participantName">Full name *</label><input id="participantName" name="participantName" autocomplete="name" required maxlength="80" placeholder="Enter your full name"></div>
        <div class="form-field"><label for="participantEmail">Email address *</label><input id="participantEmail" name="participantEmail" type="email" autocomplete="email" required maxlength="120" placeholder="you@example.com"></div>
        <div class="form-field"><label for="participantPhone">Contact number</label><input id="participantPhone" name="participantPhone" type="tel" autocomplete="tel" maxlength="25" placeholder="Optional"></div>
        <div class="form-field"><label for="raceDistance">Race category *</label><select id="raceDistance" name="raceDistance" required>${options}</select></div>
        <div class="form-field"><label for="participantCount">Participants *</label><select id="participantCount" name="participantCount"><option value="1">1 participant</option><option value="2">2 participants</option><option value="3">3 participants</option><option value="4">4 participants</option><option value="5">5 participants</option></select></div>
      </div>
      <p class="form-note">Demo only: no payment is collected and no information is sent to a server. Avoid entering sensitive personal information.</p>
      <button class="button button-primary" type="submit">CONFIRM REGISTRATION <span>↗</span></button>
    </form>
  `);
  $("#registrationForm").addEventListener("submit", (eventSubmit) => {
    eventSubmit.preventDefault();
    const form = new FormData(eventSubmit.currentTarget);
    const participants = Number(form.get("participantCount"));
    const current = getRegistrations();
    const usedSlots = current.filter(reg => reg.eventId === event.id).reduce((sum, reg) => sum + reg.participants, 0);
    if (event.slots - usedSlots < participants) {
      showToast("Not enough sample slots remain for that participant count.", true);
      return;
    }
    const registration = {
      reference: "RG-" + Math.random().toString(36).slice(2, 6).toUpperCase() + "-" + Date.now().toString().slice(-4),
      eventId: event.id,
      eventTitle: event.title,
      category: event.category,
      date: event.date,
      location: event.location,
      image: event.image,
      distance: form.get("raceDistance"),
      participants,
      name: String(form.get("participantName")).trim(),
      email: String(form.get("participantEmail")).trim(),
      phone: String(form.get("participantPhone")).trim(),
      createdAt: new Date().toISOString()
    };
    current.push(registration);
    saveRegistrations(current);
    renderEvents();
    openConfirmation(registration);
  });
}
function openConfirmation(registration) {
  openModal(`
    <div class="confirmation">
      <div class="confirmation-icon">✓</div>
      <p class="modal-kicker">REGISTRATION SAVED</p>
      <h2 id="modalTitle">You're on the grid!</h2>
      <p>Your sample registration for <strong>${registration.eventTitle}</strong> has been saved in this browser.</p>
      <div class="meta-box"><small>YOUR REFERENCE</small><code>${registration.reference}</code></div>
      <div class="modal-meta">
        <div class="meta-box"><small>PARTICIPANT</small><strong>${escapeHtml(registration.name)}</strong></div>
        <div class="meta-box"><small>RACE CATEGORY</small><strong>${escapeHtml(registration.distance)}</strong></div>
        <div class="meta-box"><small>EVENT DATE</small><strong>${registration.date}</strong></div>
        <div class="meta-box"><small>PARTICIPANTS</small><strong>${registration.participants}</strong></div>
      </div>
      <p>Keep your reference for this demo. This is not an official race entry.</p>
      <button class="button button-primary" id="confirmationDone">DONE <span>✓</span></button>
    </div>
  `);
  $("#confirmationDone").addEventListener("click", closeModal);
  showToast("Registration saved successfully.");
  launchConfetti();
}
function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[char]);
}
function openMyRaces() {
  const registrations = getRegistrations();
  if (!registrations.length) {
    openModal(`<p class="modal-kicker">YOUR RACE LIST</p><h2 id="modalTitle">My Races</h2><p>You have no saved registrations yet. Explore events and register for a race to see it here.</p><a class="button button-primary" href="#events" id="browseFromModal">EXPLORE EVENTS <span>↗</span></a>`);
    $("#browseFromModal").addEventListener("click", closeModal);
    return;
  }
  openModal(`<p class="modal-kicker">YOUR RACE LIST</p><h2 id="modalTitle">My Races</h2><p>Your registrations are saved locally in this browser.</p><div class="registration-list">${registrations.map(reg => `
    <article class="registration-item">
      <img src="${reg.image}" alt="">
      <div><strong>${escapeHtml(reg.eventTitle)}</strong><small>${escapeHtml(reg.distance)} · ${reg.date}</small><small>Ref: ${escapeHtml(reg.reference)} · ${reg.participants} participant(s)</small></div>
      <button data-remove-registration="${escapeHtml(reg.reference)}">Remove</button>
    </article>`).join("")}</div>`);
  modalContent.querySelectorAll("[data-remove-registration]").forEach(button => {
    button.addEventListener("click", () => {
      const ref = button.dataset.removeRegistration;
      saveRegistrations(getRegistrations().filter(reg => reg.reference !== ref));
      openMyRaces();
      renderEvents();
      showToast("Registration removed from this browser.");
    });
  });
}
function clearFilters() {
  searchInput.value = "";
  categoryFilter.value = "All";
  availabilityFilter.value = "All";
  document.querySelectorAll(".category-card").forEach(card => card.classList.remove("active"));
  renderEvents();
  $("#events").scrollIntoView({ behavior: "smooth" });
}

searchInput.addEventListener("input", renderEvents);
categoryFilter.addEventListener("change", () => {
  document.querySelectorAll(".category-card").forEach(card => card.classList.toggle("active", card.dataset.category === categoryFilter.value));
  renderEvents();
});
availabilityFilter.addEventListener("change", renderEvents);
$("#clearFilters").addEventListener("click", clearFilters);
document.querySelectorAll(".category-card").forEach(card => card.addEventListener("click", () => {
  categoryFilter.value = card.dataset.category;
  document.querySelectorAll(".category-card").forEach(item => item.classList.toggle("active", item === card));
  renderEvents();
  $("#events").scrollIntoView({ behavior: "smooth" });
}));
document.addEventListener("click", event => {
  const button = event.target.closest("[data-open-event]");
  if (button) openEvent(button.dataset.openEvent);
});
$("#myRacesButton").addEventListener("click", openMyRaces);
$("#footerMyRaces").addEventListener("click", openMyRaces);
$("#modalClose").addEventListener("click", closeModal);
modalBackdrop.addEventListener("click", event => { if (event.target === modalBackdrop) closeModal(); });
document.addEventListener("keydown", event => { if (event.key === "Escape" && !modalBackdrop.hidden) closeModal(); });
$("#menuToggle").addEventListener("click", () => {
  const nav = $("#mainNav");
  const isOpen = nav.classList.toggle("open");
  $("#menuToggle").setAttribute("aria-expanded", String(isOpen));
  $("#menuToggle").setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
});
$("#mainNav").querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
  $("#mainNav").classList.remove("open");
  $("#menuToggle").setAttribute("aria-expanded", "false");
}));
let lastCount = null;
function updateRegistrationCounts() {
  const count = getRegistrations().length;
  const badge = $("#registrationCount");
  badge.textContent = count;
  $("#statRegistrations").textContent = count;

  if (lastCount !== null && count > lastCount) {   // only pop when a race is added
    badge.classList.remove("pop");
    void badge.offsetWidth;                         // restart the animation
    badge.classList.add("pop");
  }
  lastCount = count;
}
renderEvents();
const siteHeader = document.querySelector(".site-header");
const progress = document.createElement("div");
progress.className = "scroll-progress";
document.body.appendChild(progress);

function onScroll() {
  siteHeader.classList.toggle("scrolled", window.scrollY > 60);
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + "%";
}
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

document.querySelectorAll(".hero-stats .stat-card strong:not(#statRegistrations)").forEach(el => {
  const target = parseInt(el.textContent, 10);
  const suffix = el.textContent.replace(/[0-9]/g, "");
  const duration = 1400, start = performance.now();
  (function tick(now) {
    const t = Math.min((now - start) / duration, 1);
    el.textContent = Math.round(target * (1 - Math.pow(1 - t, 3))) + suffix; // ease-out
    if (t < 1) requestAnimationFrame(tick);
  })(start);
});

const revealEls = document.querySelectorAll(".section-heading, .featured-copy, .how-intro, .step");
revealEls.forEach(el => el.classList.add("reveal"));
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("in");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
revealEls.forEach(el => revealObserver.observe(el));

if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
    window.matchMedia("(hover: hover)").matches) {
  const addTilt = (container, selector) => {
    container.addEventListener("mousemove", e => {
      const card = e.target.closest(selector);
      if (!card) return;
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.setProperty("--rx", (-y * 8) + "deg");
      card.style.setProperty("--ry", (x * 8) + "deg");
    });
    container.addEventListener("mouseout", e => {
      const card = e.target.closest(selector);
      if (card && !card.contains(e.relatedTarget)) {
        card.style.setProperty("--rx", "0deg");
        card.style.setProperty("--ry", "0deg");
      }
    });
  };
  addTilt($("#eventGrid"), ".event-card");
  addTilt(document.querySelector(".category-grid"), ".category-card");
}

const renderEventsNow = renderEvents;
let skeletonTimer;
renderEvents = function () {
  clearTimeout(skeletonTimer);
  $("#emptyState").hidden = true;
  eventGrid.innerHTML = Array.from({ length: 4 }, () => `
    <article class="event-card skeleton-card" aria-hidden="true">
      <div class="event-card-image sk"></div>
      <div class="event-card-body">
        <div class="sk sk-title"></div>
        <div class="sk sk-line"></div>
        <div class="sk sk-line short"></div>
        <div class="sk sk-btn"></div>
      </div>
    </article>`).join("");
  skeletonTimer = setTimeout(renderEventsNow, 350);
};
const toTop = document.createElement("button");
toTop.className = "to-top";
toTop.setAttribute("aria-label", "Back to top");
toTop.textContent = "↑";
document.body.appendChild(toTop);
toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
window.addEventListener("scroll", () => toTop.classList.toggle("show", window.scrollY > 600), { passive: true });
const tickerTrack = document.querySelector(".ticker-track");
if (tickerTrack) tickerTrack.innerHTML += tickerTrack.innerHTML;   // duplicate for a seamless loop
document.querySelector(".hero-stats").addEventListener("mousemove", e => {
  const card = e.target.closest(".stat-card");
  if (!card) return;
  const r = card.getBoundingClientRect();
  card.style.setProperty("--mx", (e.clientX - r.left) + "px");
  card.style.setProperty("--my", (e.clientY - r.top) + "px");
});

const heroEl = document.querySelector(".hero");
if (heroEl && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const layer = document.createElement("div");
  layer.className = "hero-particles";
  layer.setAttribute("aria-hidden", "true");
  for (let i = 0; i < (window.innerWidth < 700 ? 10 : 28); i++) {
    const dot = document.createElement("i");
    const size = 2 + Math.random() * 4;
    dot.style.cssText =
      `left:${Math.random() * 100}%;width:${size}px;height:${size}px;` +
      `animation-duration:${6 + Math.random() * 8}s;animation-delay:${-Math.random() * 12}s;` +
      `--drift:${Math.random() * 80 - 40}px`;
    layer.appendChild(dot);
  }
  heroEl.appendChild(layer);
}

if (heroEl) {
  heroEl.addEventListener("mousemove", e => {
    const r = heroEl.getBoundingClientRect();
    heroEl.style.setProperty("--px", ((e.clientX - r.left) / r.width - 0.5).toFixed(3));
    heroEl.style.setProperty("--py", ((e.clientY - r.top) / r.height - 0.5).toFixed(3));
  });
  heroEl.addEventListener("mouseleave", () => {
    heroEl.style.setProperty("--px", 0);
    heroEl.style.setProperty("--py", 0);
  });
}

(function () {
  const KEY = "racegridSaved";
  const grid = document.getElementById("eventGrid");
  const getSaved = () => { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { return []; } };
  const setSaved = list => { try { localStorage.setItem(KEY, JSON.stringify(list)); } catch (e) {} };

  const count = document.createElement("p");
  count.className = "result-count";
  grid.before(count);

  function decorate() {
    if (grid.querySelector(".skeleton-card")) return;
    const total = grid.querySelectorAll(".event-card").length;
    count.textContent = total ? `Showing ${total} event${total > 1 ? "s" : ""}` : "";
    const saved = getSaved();

    grid.querySelectorAll(".event-card:not([data-decorated])").forEach(card => {
      card.dataset.decorated = "1";
      const img = card.querySelector(".event-card-image");
      const title = card.querySelector("h3").textContent.trim();

      const dateText = card.querySelector(".event-detail span:last-child")?.textContent || "";
      const m = dateText.match(/([A-Za-z]{3})\w*\s+(\d{1,2})/);
      if (m) img.insertAdjacentHTML("beforeend", `<span class="date-badge"><b>${m[2]}</b>${m[1].toUpperCase()}</span>`);

      const left = parseInt(card.querySelector(".slots")?.textContent, 10);
      if (left > 0 && left <= 60) img.insertAdjacentHTML("beforeend", `<span class="urgent">Only ${left} left</span>`);

      const on = saved.includes(title);
      img.insertAdjacentHTML("beforeend",
        `<button type="button" class="heart${on ? " on" : ""}" aria-pressed="${on}" aria-label="Save ${title}">♥</button>`);
    });
  }

  grid.addEventListener("click", e => {
    const heart = e.target.closest(".heart");
    if (!heart) return;
    const title = heart.closest(".event-card").querySelector("h3").textContent.trim();
    let saved = getSaved();
    const on = !saved.includes(title);
    saved = on ? [...saved, title] : saved.filter(t => t !== title);
    setSaved(saved);
    heart.classList.toggle("on", on);
    heart.setAttribute("aria-pressed", on);
    showToast(on ? "Saved to your wishlist." : "Removed from your wishlist.");
  });

  new MutationObserver(decorate).observe(grid, { childList: true });
  decorate();
})();

document.querySelectorAll(".category-card").forEach(card => {
  const n = events.filter(ev => ev.category === card.dataset.category).length;
  card.insertAdjacentHTML("beforeend", `<span class="cat-count">${n} event${n !== 1 ? "s" : ""}</span>`);
});

(function () {
  const KEY = "racegridSaved";
  const getSaved = () => { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { return []; } };
  const setSaved = list => { try { localStorage.setItem(KEY, JSON.stringify(list)); } catch (e) {} };

  // --- Nav button ---
  const nav = document.getElementById("mainNav");
  const racesBtn = document.getElementById("myRacesButton");
  const wishBtn = document.createElement("button");
  wishBtn.type = "button";
  wishBtn.id = "wishlistButton";
  wishBtn.className = "nav-wish";
  wishBtn.setAttribute("aria-label", "Open saved races");
  wishBtn.innerHTML = '<span class="wish-label">Saved</span><span class="wish-count" id="wishCount">0</span>';
  nav.insertBefore(wishBtn, racesBtn);

  let lastCount = null;
  function updateCount() {
    const count = getSaved().length;
    const badge = document.getElementById("wishCount");
    badge.textContent = count;
    wishBtn.classList.toggle("has", count > 0);
    if (lastCount !== null && count > lastCount) {
      badge.classList.remove("pop");
      void badge.offsetWidth;
      badge.classList.add("pop");
    }
    lastCount = count;
  }

  // keep card hearts in sync with the saved list
  function syncHearts() {
    const saved = getSaved();
    document.querySelectorAll("#eventGrid .heart").forEach(h => {
      const title = h.closest(".event-card").querySelector("h3").textContent.trim();
      const on = saved.includes(title);
      h.classList.toggle("on", on);
      h.setAttribute("aria-pressed", on);
    });
  }

  // --- Wishlist panel ---
  function openWishlist() {
    const items = getSaved().map(t => events.find(ev => ev.title === t)).filter(Boolean);
    if (!items.length) {
      openModal(`<p class="modal-kicker">YOUR WISHLIST</p><h2 id="modalTitle">Saved Races</h2>
        <p>You haven't saved any races yet. Tap the ♥ on an event card to keep it here.</p>
        <a class="button button-primary" href="#events" id="wishBrowse">EXPLORE EVENTS <span>↗</span></a>`);
      document.getElementById("wishBrowse").addEventListener("click", closeModal);
      return;
    }
    openModal(`<p class="modal-kicker">YOUR WISHLIST</p><h2 id="modalTitle">Saved Races</h2>
      <p>${items.length} race${items.length > 1 ? "s" : ""} saved in this browser.</p>
      <div class="registration-list">${items.map(ev => {
        const sold = ev.soldOut || ev.slots <= 0;
        const price = money(ev.price) + (ev.maxPrice !== ev.price ? "–" + money(ev.maxPrice) : "");
        return `<article class="registration-item wish-item">
          <img src="${ev.image}" alt="">
          <div><strong>${escapeHtml(ev.title)}</strong>
            <small>${ev.shortDate} · ${escapeHtml(ev.location)}</small>
            <small>${ev.distances.join(" · ")} · ${price}</small></div>
          <div class="wish-actions">
            ${sold ? '<span class="sold-out-label">SOLD OUT</span>'
                   : `<button type="button" class="mini-button" data-wish-view="${ev.id}">VIEW ↗</button>`}
            <button type="button" class="wish-remove" data-wish-remove="${ev.id}">Remove</button>
          </div>
        </article>`;
      }).join("")}</div>`);
  }

  // One delegated listener for View / Remove inside the modal
  modalContent.addEventListener("click", e => {
    const view = e.target.closest("[data-wish-view]");
    if (view) { openEvent(view.dataset.wishView); return; }
    const remove = e.target.closest("[data-wish-remove]");
    if (remove) {
      const ev = events.find(item => item.id === Number(remove.dataset.wishRemove));
      if (!ev) return;
      setSaved(getSaved().filter(t => t !== ev.title));
      updateCount();
      syncHearts();
      openWishlist();
      showToast("Removed from your wishlist.");
    }
  });

  wishBtn.addEventListener("click", () => {
    nav.classList.remove("open");
    document.getElementById("menuToggle").setAttribute("aria-expanded", "false");
    openWishlist();
  });

  // Badge follows heart clicks on the cards (runs after the card's own handler)
  eventGrid.addEventListener("click", e => { if (e.target.closest(".heart")) updateCount(); });
  window.addEventListener("storage", () => { updateCount(); syncHearts(); }); // other tabs
  updateCount();
})();