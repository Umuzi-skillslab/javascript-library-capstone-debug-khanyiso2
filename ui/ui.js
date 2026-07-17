// ======================================================
// Library UI - DOM Manipulation
// ======================================================

import Member from "../models/Member.js";
import Book from "../models/Book.js";
import DigitalBook from "../models/DigitalBook.js";

let catalogueContainer;
let searchInput;
let filterDropdown;
let currentPage = 1;
const booksPerPage = 8;

/**
 * Initializes the UI once the DOM has loaded.
 */
function initializeUI() {
  catalogueContainer = document.getElementById("catalogue-list");
  searchInput = document.getElementById("search");
  filterDropdown = document.getElementById("filter-category");

  if (!catalogueContainer || !searchInput || !filterDropdown) {
    console.error("Required UI elements could not be found.");
    return;
  }

  setupEventListeners();
  createMemberForm();
  loadCatalogue();
  setupPagination();
}

/**
 * Registers all UI event listeners.
 */
function setupEventListeners() {
  searchInput.addEventListener("input", handleSearch);
  filterDropdown.addEventListener("change", handleFilterChange);

  const borrowForm = document.getElementById("borrow-form");
  if (borrowForm) {
    borrowForm.addEventListener("submit", handleBorrowSubmit);
  }

  const returnButton = document.getElementById("return-btn");

  if (returnButton) {
     returnButton.addEventListener("click", handleReturnBook);
    }

  // Event delegation
  catalogueContainer.addEventListener("click", handleBookClick);
  catalogueContainer.addEventListener("mouseout", handleBookMouseOut);
  catalogueContainer.addEventListener("mouseover", handleBookHover);

  const catalogueTab = document.getElementById("catalogue-tab");
  const membersTab = document.getElementById("members-tab");
  const statisticsTab = document.getElementById("statistics-tab");

  if (catalogueTab) catalogueTab.addEventListener("click", showCatalogueSection);
  if (membersTab) membersTab.addEventListener("click", showMemberSection);
  if (statisticsTab) statisticsTab.addEventListener("click", showStatisticsSection);

  const closeModal =
  document.getElementById("close-modal");

 if (closeModal) {
   closeModal.addEventListener("click", () => {
     document
       .getElementById("book-modal")
       .classList.add("hidden");
   });
  }

  window.addEventListener("resize", updateStatisticsDisplay);

}

/**
 * Displays all books.
 *
 * @param {Array} bookList
 */
function renderBookCatalogue(bookList) {
  if (!catalogueContainer) {
    return;
  }

  catalogueContainer.innerHTML = "";

  if (!Array.isArray(bookList) || bookList.length === 0) {
    catalogueContainer.innerHTML = "<p>No books found.</p>";
    return;
  }

  const fragment = document.createDocumentFragment();

  const start =
    (currentPage - 1) * booksPerPage;

  const end =
    start + booksPerPage;

  const booksToShow =
    bookList.slice(start, end);

booksToShow.forEach(book => {
    const bookCard = document.createElement("div");
    bookCard.className = "book-card";
    
    bookCard.dataset.isbn = book.isbn;
    const bookType = book instanceof DigitalBook ? "Digital" : "Physical";

  bookCard.innerHTML = `
    <img
        src="${book.coverImage || "./assets/books/default-book.jpg"}"
        alt="${book.title}"
        class="book-cover"
    >

    <div class="book-info">

        <h3 class="book-title">
            ${book.title}
        </h3>

        <p class="book-author">
            ${book.author}
        </p>

        <p class="book-category">
            ${book.category}
        </p>

        <p class="book-type">
            ${bookType}
        </p>

        <p class="book-status">
            ${
              book.availableCopies > 0
                ? "✅ Available"
                : "❌ Borrowed Out"
            }
        </p>

        <button
            class="details-btn"
            data-isbn="${book.isbn}"
        >
            View Details
        </button>

    </div>
`;

    fragment.appendChild(bookCard);
  });

  catalogueContainer.appendChild(fragment);
}

/**
 * Handles borrowing a book.
 *
 * @param {Event} event
 */
function handleBorrowSubmit(event) {
  event.preventDefault();

  const memberIdInput = document.getElementById("member-id");
  const isbnInput = document.getElementById("isbn");

  if (!memberIdInput || !isbnInput) {
    return;
  }

  const memberId = memberIdInput.value.trim();
  const isbn = isbnInput.value.trim();

  if (!memberId || !isbn) {
    alert("Please complete all fields.");
    return;
  }

  try {
    const success = window.borrowBook(memberId, isbn);

    if (success) {
      alert("Book borrowed successfully.");
      event.target.reset();
      loadCatalogue();
    } else {
      alert("Unable to borrow the selected book.");
    }
  } catch (error) {
    console.error("Borrow error:", error);
    alert("An unexpected error occurred while borrowing the book.");
  }
}

function handleReturnBook() {
  const memberId =
    document.getElementById("member-id").value.trim();

  const isbn =
    document.getElementById("isbn").value.trim();

  if (!memberId || !isbn) {
    alert("Please complete all fields.");
    return;
  }

  const success =
    returnBook(memberId, isbn);

  if (success) {
    alert("Book returned successfully.");
    loadCatalogue();

    document
      .getElementById("borrow-form")
      .reset();
  } else {
    alert("Unable to return the book.");
  }
}

/**
 * Handles clicks on book cards.
 *
 * @param {Event} event
 */
function handleBookClick(event) {

  const button = event.target.closest(".details-btn");

  if (!button) {
    return;
  }

  displayBookDetails(button.dataset.isbn);

}

/**
 * Filters books using the search box.
 *
 * @param {Event} event
 */
function handleSearch(event) {
  const searchTerm = event.target.value.trim();

  if (!searchTerm) {

    currentPage = 1;

    renderBookCatalogue(getAllBooks());

    const page = document.getElementById("page-number");

    if (page) {
      page.textContent = `Page ${currentPage}`;
    }

    return;

  }

  const search = searchTerm.toLowerCase();
  const results = window.getAllBooks().filter((book) =>
    book.title.toLowerCase().includes(search) ||
    book.author.toLowerCase().includes(search) ||
    book.category.toLowerCase().includes(search) ||
    book.isbn.toLowerCase().includes(search)
  );
  currentPage = 1;

  renderBookCatalogue(results);
  const page = document.getElementById("page-number");

  if (page) {
    page.textContent = `Page ${currentPage}`;
  }
  
}

/**
 * Filters books by category.
 */
function handleFilterChange() {
  currentPage = 1;
  const selectedCategory = filterDropdown.value;
  const category = selectedCategory.trim().toLowerCase();
 
 if (category === "all") {

   renderBookCatalogue(window.getAllBooks());
   const page = document.getElementById("page-number");

   if (page) {
     page.textContent = `Page ${currentPage}`;
    }
   return;

 }

  const filtered = window.getAllBooks().filter(
    (book) => book.category.trim().toLowerCase() === category
  );

  renderBookCatalogue(filtered);
  const page = document.getElementById("page-number");

  if (page) {
    page.textContent = `Page ${currentPage}`;
  }
}

/**
 * Displays detailed information about a selected book.
 *
 * @param {string} isbn
 */
function displayBookDetails(isbn) {

    const book = window.findBookByISBN(isbn);

    if (!book) return;

    const modal = document.getElementById("book-modal");
    const modalContent = document.getElementById("modal-content");

    modalContent.innerHTML = `
        <img src="${book.coverImage}" class="book-details-cover">

        <h2>${book.title}</h2>

        <p><strong>Author:</strong> ${book.author}</p>

        <p><strong>Category:</strong> ${book.category}</p>

        <p><strong>Year:</strong> ${book.year}</p>

        <p><strong>ISBN:</strong> ${book.isbn}</p>

        <p><strong>Copies:</strong>
        ${book.availableCopies}/${book.totalCopies}
        </p>

        <button class="borrow-btn">Borrow</button>

        <button class="return-btn">Return</button>
    `;

    modal.classList.remove("hidden");
}

/**
 * Updates the statistics displayed on the page.
 */
function updateStatisticsDisplay() {
  const stats = getStatistics() || {};

  const totalBooksEl = document.querySelector(".total-books");
  const totalMembersEl = document.querySelector(".total-members");
  const availableBooksEl = document.querySelector(".available-books");

if (totalBooksEl) {
  totalBooksEl.textContent =
    stats.totalBooks ?? 0;
}

if (totalMembersEl) {
  totalMembersEl.textContent =
    stats.totalMembers ?? 0;
}

if (availableBooksEl) {
  availableBooksEl.textContent =
    stats.availableBooks ?? 0;
}
}

function createMemberForm() {
  const formContainer = document.getElementById("member-form");

  if (!formContainer) {
    return;
  }

  formContainer.innerHTML = "";

  const form = document.createElement("form");

  form.innerHTML = `
    <label for="new-member-id">Member ID</label>
    <input type="text" id="new-member-id" required>

    <label for="first-name">First Name</label>
    <input type="text" id="first-name" required>

    <label for="last-name">Last Name</label>
    <input type="text" id="last-name" required>

    <label for="email">Email</label>
    <input type="email" id="email" required>

    <label for="phone">Phone</label>
    <input type="text" id="phone" required>

    <button type="submit">Add Member</button>
  `;

  formContainer.appendChild(form);

  form.addEventListener("submit", (event) => {
  event.preventDefault();

  const member = new Member(
    document.getElementById("new-member-id").value,
    document.getElementById("first-name").value,
    document.getElementById("last-name").value,
    document.getElementById("email").value,
    document.getElementById("phone").value
  );

  const success = window.addMember(member);

  if (success) {
    alert("Member added successfully.");
    form.reset();
  } else {
    alert("Member already exists.");
  }
});
}

function setupPagination() {

  const previous =
    document.getElementById("previous-page");

  const next =
    document.getElementById("next-page");

  const pageNumber =
    document.getElementById("page-number");

  if (!previous || !next || !pageNumber) {
    return;
  }

  previous.addEventListener("click", () => {

    if (currentPage > 1) {

      currentPage--;

      loadCatalogue();

    }

  });

  next.addEventListener("click", () => {

    const totalPages =
      Math.ceil(
        window.getAllBooks().length / booksPerPage
      );

    if (currentPage < totalPages) {

      currentPage++;

      loadCatalogue();

    }

  });

  pageNumber.textContent =
    `Page ${currentPage}`;

}

/**
 * Loads the catalogue and updates the statistics.
 */
function loadCatalogue() {

  const books =
    window.getAllBooks();

  renderBookCatalogue(books);

  updateStatisticsDisplay();

  const page =
    document.getElementById("page-number");

  if (page) {

    page.textContent =
      `Page ${currentPage}`;

  }

}

function handleBookHover(event) {
  const card = event.target.closest(".book-card");
  if (!card) {
    return;
  }
  card.classList.add("hovered");
}

function handleBookMouseOut(event) {
  const card = event.target.closest(".book-card");
  if (!card) {
    return;
  }
  card.classList.remove("hovered");
}

function showCatalogueSection() {
  document.getElementById("catalogue-section")?.classList.remove("hidden");
  document.getElementById("member-section")?.classList.add("hidden");
  document.getElementById("statistics-section")?.classList.add("hidden");
}

function showMemberSection() {
  document.getElementById("catalogue-section")?.classList.add("hidden");
  document.getElementById("member-section")?.classList.remove("hidden");
  document.getElementById("statistics-section")?.classList.add("hidden");
  createMemberForm();
}

function showStatisticsSection() {
  document.getElementById("catalogue-section")?.classList.add("hidden");
  document.getElementById("member-section")?.classList.add("hidden");
  document.getElementById("statistics-section")?.classList.remove("hidden");
  updateStatisticsDisplay();
}

/**
 * Wait until the DOM has fully loaded before initializing.
 */
document.addEventListener("DOMContentLoaded", initializeUI);