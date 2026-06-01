
// API დამატება
const API_URL = "https://randomuser.me/api/?results=10&nat=us,gb,fr,de,es";

// ქართული შეფასებების ტექსტები - ვირჩევთ შემთხვევითად
const REVIEW_TEXTS = [
  "სწრაფი, ეფექტური და მეგობრული მომსახურება. ძალიან კმაყოფილი დავრჩი.",
  "მოწესრიგებული და პროფესიონალი გუნდი. ავეჯის გადატანა უპრობლემოდ მოხდა.",
  "ტვირთის გადაზიდვისთვის ვისარგებლე — დროულად ჩააბარეს ყველაფერი.",
  "ჩემს ოფისს გადატანა სჭირდებოდა — რეკომენდაციას ვუწევ ყველას!",
  "ძალიან ფრთხილად ექცევიან ავეჯს. არანაირი დაზიანება არ ყოფილა.",
  "შესანიშნავი გუნდი — ყურადღებიანები და მოწესრიგებულები. მადლობა!",
  "ავეჯის გადატანა სწრაფად მოხდა. ნამდვილად რეკომენდაციას ვუწევ.",
  "მაღალი დონის სერვისი, ფასი მისაღებია და მომსახურება სანდოა.",
  "ნივთები კარგად შეფუთეს და ძალიან ფრთხილად მოექცნენ.",
  "მძიმე ნივთები მარტივად და უსაფრთხოდ გადაიტანეს. დიდი მადლობა!"
];

let allReviews = [];

// ბურგერი

function initBurger() {
  const burger = document.querySelector(".burger");
  const navMenu = document.querySelector("nav ul");

  burger.addEventListener("click", function () {
    navMenu.classList.toggle("active");
    burger.classList.toggle("active");
  });
}



// პოპაპი

function initPopup() {
  const popup = document.querySelector("#popup");
  const openButtons = document.querySelectorAll(".popup-open");
  const closeButton = document.querySelector(".popup-close");

  if (!popup) {
    return;
  }

  for (let i = 0; i < openButtons.length; i++) {
    openButtons[i].addEventListener("click", function (event) {
      event.preventDefault();
      popup.classList.add("active");
    });
  }

  if (closeButton) {
    closeButton.addEventListener("click", function () {
      popup.classList.remove("active");
    });
  }
}



// აკორდიონი

function initAccordion() {
  const items = document.querySelectorAll(".accordion-item");

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const header = item.querySelector(".accordion-header");

    if (!header) {
      continue;
    }

    header.addEventListener("click", function () {
      const isOpen = item.classList.contains("active");

      for (let j = 0; j < items.length; j++) {
        items[j].classList.remove("active");
      }

      if (!isOpen) {
        item.classList.add("active");
      }
    });
  }
}



//ლოადერი და ერორი

function showLoader() {
  const loader = document.querySelector("#loader");
  if (loader) {
    loader.style.display = "flex";
  }
}

function hideLoader() {
  const loader = document.querySelector("#loader");
  if (loader) {
    loader.style.display = "none";
  }
}

function showError(message) {
  const errorBox = document.querySelector("#reviews-error");
  if (errorBox) {
    errorBox.textContent = message;
    errorBox.style.display = "block";
  }
}


// API მონაცემები
function buildReviews(users) {
  const reviews = [];

  for (let i = 0; i < users.length; i++) {
    const user = users[i];

    const review = {
      name: user.name.first + " " + user.name.last,
      photo: user.picture.large,
      location: user.location.city + ", " + user.location.country,
      rating: Math.floor(Math.random() * 2) + 4,
      text: REVIEW_TEXTS[i % REVIEW_TEXTS.length]
    };

    reviews.push(review);
  }

  return reviews;
}


// ძებნა
function filterReviews(reviews, query) {
  if (query.trim() === "") {
    return reviews;
  }

  const lowerQuery = query.trim().toLowerCase();
  const result = [];

  for (let i = 0; i < reviews.length; i++) {
    const name = reviews[i].name.toLowerCase();
    if (name.indexOf(lowerQuery) !== -1) {
      result.push(reviews[i]);
    }
  }

  return result;
}



// სორტირება

function sortReviews(reviews, sortKey) {
  const sorted = reviews.slice();

  if (sortKey === "rating-desc") {
    sorted.sort(function (a, b) {
      return b.rating - a.rating;
    });
  } else if (sortKey === "rating-asc") {
    sorted.sort(function (a, b) {
      return a.rating - b.rating;
    });
  } else if (sortKey === "alphabet") {
    sorted.sort(function (a, b) {
      return a.name.localeCompare(b.name);
    });
  }

  return sorted;
}



// ვარსკვლავები
function renderStars(rating) {
  let stars = "";
  for (let i = 0; i < 5; i++) {
    if (i < rating) {
      stars = stars + "★";
    } else {
      stars = stars + "☆";
    }
  }
  return stars;
}



function renderReviews(reviews) {
  const grid = document.querySelector("#reviews-grid");
  if (!grid) {
    return;
  }

  if (reviews.length === 0) {
    grid.innerHTML = '<p class="empty-message">ვერავინ მოიძებნა.</p>';
    return;
  }

  let html = "";
  for (let i = 0; i < reviews.length; i++) {
    const r = reviews[i];
    html = html +
      '<div class="review-card">' +
        '<img src="' + r.photo + '" alt="' + r.name + '" class="review-avatar">' +
        '<div class="stars">' + renderStars(r.rating) + '</div>' +
        '<p class="review-text">"' + r.text + '"</p>' +
        '<div class="review-author">' + r.name + '</div>' +
        '<div class="review-location"><i class="fas fa-map-marker-alt"></i> ' + r.location + '</div>' +
      '</div>';
  }

  grid.innerHTML = html;
}



// ფილტრი და სორტირება

function applyFiltersAndRender() {
  const searchInput = document.querySelector("#search-input");
  const sortSelect = document.querySelector("#sort-select");

  let query = "";
  if (searchInput) {
    query = searchInput.value;
  }

  let sortKey = "default";
  if (sortSelect) {
    sortKey = sortSelect.value;
  }

  const filtered = filterReviews(allReviews, query);
  const sorted = sortReviews(filtered, sortKey);

  renderReviews(sorted);
}


function initSearchAndSort() {
  const searchInput = document.querySelector("#search-input");
  const sortSelect = document.querySelector("#sort-select");

  if (searchInput) {
    searchInput.addEventListener("input", applyFiltersAndRender);
  }

  if (sortSelect) {
    sortSelect.addEventListener("change", applyFiltersAndRender);
  }
}


// API - მონაცემები
async function loadReviews() {
  showLoader();

  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error("HTTP შეცდომა: " + response.status);
    }

    const data = await response.json();

    allReviews = buildReviews(data.results);
    applyFiltersAndRender();

  } catch (error) {
    showError("მონაცემების ჩატვირთვა ვერ მოხერხდა. შეამოწმეთ ინტერნეტ კავშირი.");
    console.log("შეცდომა:", error);
  } finally {
    hideLoader();
  }
}


document.addEventListener("DOMContentLoaded", function () {
  initBurger();
  initPopup();
  initAccordion();
  initSearchAndSort();
  loadReviews();
});
