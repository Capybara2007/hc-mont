
const SUPABASE_URL = "https://iijebacrroyhazwclgtg.supabase.co";
const SUPABASE_KEY = "sb_publishable_WME-nAIH0HpaEzmziyJVGw_qmnU4XVs";

const menuToggle = document.getElementById("menuToggle");
const nav = document.getElementById("nav");
const form = document.getElementById("bookingForm");
const serviceSelect = document.getElementById("service");
const dateInput = document.getElementById("date");
const timeSelect = document.getElementById("time");
const formMessage = document.getElementById("formMessage");
const submitButton = form.querySelector('[type="submit"]');


document.getElementById("year").textContent = new Date().getFullYear();

const headers = {
  apikey: SUPABASE_KEY,
  Authorization: `Bearer ${SUPABASE_KEY}`,
  "Content-Type": "application/json"
};

// Datum u lokalnoj vremenskoj zoni, bez mogućnosti biranja prošlosti.
function localDateString(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

dateInput.min = localDateString();

menuToggle.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.textContent = isOpen ? "✕" : "☰";
});

nav.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.textContent = "☰";
  });
});

document.querySelectorAll("[data-service]").forEach(card => {
  card.addEventListener("click", () => {
    serviceSelect.value = card.dataset.service;
    document.getElementById("zakazivanje").scrollIntoView({
      behavior: "smooth"
    });
    serviceSelect.focus({ preventScroll: true });
  });
});

function showMessage(message, isError = false) {
  formMessage.textContent = message;
  formMessage.classList.add("show");
  formMessage.style.color = isError ? "#c62828" : "";
  formMessage.scrollIntoView({
    behavior: "smooth",
    block: "nearest"
  });
}

// Učitava zauzete termine iz Supabase baze.
async function getAppointments() {
  const params = new URLSearchParams({
    select: "datum_termina,status",
    status: 'in.("Na čekanju","Potvrđen")',
    datum_termina: `gte.${new Date().toISOString()}`,
    order: "datum_termina.asc"
  });

  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/termini?${params}`,
    { headers }
  );

  if (!response.ok) {
    throw new Error("Nije moguće učitati raspoložive termine.");
  }

  return response.json();
}

function sameLocalDateTime(isoDate, date, time) {
  const appointment = new Date(isoDate);

  return (
    localDateString(appointment) === date &&
    String(appointment.getHours()).padStart(2, "0") +
      ":" +
      String(appointment.getMinutes()).padStart(2, "0") === time
  );
}

// Onemogućava zauzete termine i prošla vremena.
async function updateAvailableTimes() {
  const selectedDate = dateInput.value;

  for (const option of timeSelect.options) {
    if (option.value) {
      option.disabled = false;
    }
  }

  if (!selectedDate) return;

  try {
    const appointments = await getAppointments();
    const now = new Date();

    for (const option of timeSelect.options) {
      if (!option.value) continue;

      const requestedDateTime = new Date(
        `${selectedDate}T${option.value}:00`
      );

      const isPast = requestedDateTime <= now;

      const isBooked = appointments.some(appointment =>
        sameLocalDateTime(
          appointment.datum_termina,
          selectedDate,
          option.value
        )
      );

      option.disabled = isPast || isBooked;
    }

    if (timeSelect.selectedOptions[0]?.disabled) {
      timeSelect.value = "";
    }
  } catch (error) {
    showMessage(
      "Ne možemo trenutno da proverimo slobodne termine. Pokušajte ponovo.",
      true
    );
  }
}


const recenzije = [
    {
        ime: "Nikola Krstic",
        komentar: "Сарадња, комуникација и приступ. Свака част, одушевљена сам. 🙂",
        vreme: "Пре 8 месеци"
    },
    {
        ime: "Bulajic R.",
        komentar: "Свака част, све похвале.",
        vreme: "Пре 8 месеци"
    },
    {
        ime: "Dalibor Gavrilovic",
        komentar: "Одлично, мајсторе, тааако одлично, и да вам саветује и да вам да идеје за боље коришћење, све у свему мајстор за сваку препоруку.",
        vreme: "Пре 2 месеца"
    },
    {
        ime: "Aleksandar Laketa",
        komentar: "Професионално, брзо за сваку препоруку.",
        vreme: "Пре 2 месеца"
    },
    {
        ime: "Slavoljub Ristanovic",
        komentar: "Добра компанија за сваку препоруку. Инсталирали су ми два клима уређаја и одржавају их већ неколико година.",
        vreme: "Пре 3 месеца"
    },
    {
        ime: "Branka Jovic",
        komentar: "Професионализам на највишем нивоу! Тим је тачан, брз и изузетно посвећен. Све препоруке!",
        vreme: "Пре 3 месеца"
    },
    {
        ime: "Radasin Maksimovic",
        komentar: "За сваку препоруку.",
        vreme: "Пре 4 месеца"
    },
    {
        ime: "Biljana Živković",
        komentar: "Брзо, професионално, вредно сваке препоруке! Надам се да ћемо поново сарађивати!",
        vreme: "Пре 3 месеца"
    },
    {
        ime: "Miljana Parovic",
        komentar: "Више пута је потврђено да су момци одлични. Тачни, професионални, услужни и поштени. Свака препорука.",
        vreme: "Пре 5 месеци"
    },
    {
        ime: "Slobodanka Petrović",
        komentar: "Браво! Вредни и одговорни момци. 👍 Честитам! 👏",
        vreme: "Пре 3 месеца"
    }
];


const reviewName = document.getElementById("reviewName");
const reviewAvatar = document.getElementById("reviewAvatar");
const reviewStars = document.getElementById("reviewStars");
const reviewComment = document.getElementById("reviewComment");
const reviewNumber = document.getElementById("reviewNumber");
const reviewDots = document.getElementById("reviewDots");
const reviewCard = document.getElementById("reviewCard");

let trenutnaRecenzija = 0;
let reviewTimer;
let animacijaUToku = false;

function postaviRecenziju(index) {
    const r = recenzije[index];

    reviewName.textContent = r.ime;
    reviewAvatar.textContent = r.ime.trim().charAt(0).toUpperCase();
    reviewStars.textContent = "★★★★★";
    reviewStars.setAttribute("aria-label", "Ocena 5 od 5");
    reviewComment.textContent = r.komentar;
    reviewNumber.textContent = `${index + 1} / ${recenzije.length}`;

    reviewDots.querySelectorAll(".review-dot").forEach((dot, i) => {
        dot.classList.toggle("active", i === index);
    });
}

function prikaziRecenziju(index, smer = 1) {
    if (animacijaUToku || !recenzije.length) return;

    const noviIndex = (index + recenzije.length) % recenzije.length;
    if (noviIndex === trenutnaRecenzija) return;

    animacijaUToku = true;

    reviewCard.classList.remove(
        "slide-in-left",
        "slide-in-right",
        "slide-out-left",
        "slide-out-right"
    );

    // Trenutna kartica odlazi u izabranom smeru.
    reviewCard.classList.add(
        smer === 1 ? "slide-out-left" : "slide-out-right"
    );

    setTimeout(() => {
        trenutnaRecenzija = noviIndex;
        postaviRecenziju(trenutnaRecenzija);

        // Postavljamo novu početnu poziciju bez animacije.
        reviewCard.classList.remove("slide-out-left", "slide-out-right");
        reviewCard.style.animation = "none";
        reviewCard.style.transform =
            smer === 1 ? "translateX(100%)" : "translateX(-100%)";

        // Prisilno osvežavanje pre pokretanja ulazne animacije.
        void reviewCard.offsetWidth;

        reviewCard.style.animation = "";
        reviewCard.style.transform = "";

        reviewCard.classList.add(
            smer === 1 ? "slide-in-right" : "slide-in-left"
        );

        setTimeout(() => {
            reviewCard.classList.remove("slide-in-left", "slide-in-right");
            animacijaUToku = false;
        }, 380);

    }, 300);
}

function pokreniSlajder() {
    clearInterval(reviewTimer);

    reviewTimer = setInterval(() => {
        prikaziRecenziju(trenutnaRecenzija + 1, 1);
    }, 5000);
}

// Napravi tačkice samo jednom.
reviewDots.innerHTML = "";

recenzije.forEach((_, index) => {
    const dot = document.createElement("button");
    dot.className = "review-dot";
    dot.type = "button";
    dot.setAttribute("aria-label", `Prikaži recenziju ${index + 1}`);

    dot.addEventListener("click", () => {
        if (index === trenutnaRecenzija || animacijaUToku) return;

        const smer = index > trenutnaRecenzija ? 1 : -1;
        prikaziRecenziju(index, smer);
        pokreniSlajder();
    });

    reviewDots.appendChild(dot);
});

// Prethodna recenzija — klizi udesno.
document.getElementById("prevReview").addEventListener("click", () => {
    prikaziRecenziju(trenutnaRecenzija - 1, -1);
    pokreniSlajder();
});

// Sledeća recenzija — klizi ulevo.
document.getElementById("nextReview").addEventListener("click", () => {
    prikaziRecenziju(trenutnaRecenzija + 1, 1);
    pokreniSlajder();
});

// Početna recenzija.
postaviRecenziju(0);
pokreniSlajder();

// Slanje zahteva u Supabase.
form.addEventListener("submit", async event => {
  event.preventDefault();

  if (!form.reportValidity()) return;

  const date = dateInput.value;
  const time = timeSelect.value;

  if (!date || !time) {
    showMessage("Izaberite datum i vreme.", true);
    return;
  }

  const selectedDateTime = new Date(`${date}T${time}:00`);

  if (selectedDateTime <= new Date()) {
    showMessage("Izaberite budući termin.", true);
    return;
  }

  submitButton.disabled = true;
  submitButton.textContent = "Slanje zahteva...";

  try {
    // Ponovna provera neposredno pre slanja.
    const appointments = await getAppointments();

    const alreadyBooked = appointments.some(appointment =>
      sameLocalDateTime(appointment.datum_termina, date, time)
    );

    if (alreadyBooked) {
      showMessage(
        "Ovaj termin je upravo zauzet. Izaberite drugi.",
        true
      );
      await updateAvailableTimes();
      return;
    }

    const payload = {
      ime_klijenta: document.getElementById("name").value.trim(),
      email: document.getElementById("email").value.trim(),
      telefon: document.getElementById("phone").value.trim(),
      adresa: document.getElementById("address").value.trim(),
      usluga: serviceSelect.value,
      datum_termina: selectedDateTime.toISOString(),
      detalji: document.getElementById("details").value.trim()
    };

    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/termini`,
      {
        method: "POST",
        headers: {
          ...headers,
          Prefer: "return=minimal"
        },
        body: JSON.stringify(payload)
      }
    );

    if (response.status === 409) {
      showMessage(
        "Termin je već zauzet. Izaberite drugi datum ili vreme.",
        true
      );
      await updateAvailableTimes();
      return;
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Supabase greška:", errorText);
      throw new Error("Zahtev nije sačuvan.");
    }

    showMessage(
      "Uspešno ste poslali zahtev! Termin je na čekanju dok ga servis ne potvrdi."
    );

    form.reset();
    dateInput.min = localDateString();
    timeSelect.value = "";
  } catch (error) {
    console.error(error);
    showMessage(
      "Slanje nije uspelo. Proverite internet vezu i pokušajte ponovo.",
      true
    );
  } finally {
    submitButton.disabled = false;
    submitButton.innerHTML =
      'Pošalji zahtev <span aria-hidden="true">➤</span>';
  }
});
