// ======================================================
// Library UI - DOM Manipulation
// ======================================================

import Member from "../models/Member.js";
import Book from "../models/Book.js";
import DigitalBook from "../models/DigitalBook.js";

let catalogueContainer;
let searchInput;
let filterDropdown;

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
  createBookForm();
  loadCatalogue();
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

  bookList.forEach((book) => {
    const bookCard = document.createElement("div");
    bookCard.className = "book-card";
    
    bookCard.dataset.isbn = book.isbn;
    const bookType = book instanceof DigitalBook ? "Digital" : "Physical";

    bookCard.innerHTML = `
      <img
        src="${book.coverImage || 'images/default-book.jpg'}"
        alt="${book.title}"
        class="book-cover"
      >
      <h3>${book.title}</h3>
      <p><strong>Author:</strong> ${book.author}</p>
      <p><strong>Category:</strong> ${book.category}</p>
      <p><strong>Published:</strong> ${book.year}</p>
      <p><strong>Type:</strong> ${bookType}</p>
      <p><strong>Available:</strong> ${book.availableCopies}/${book.totalCopies}</p>
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
    const success = borrowBook(memberId, isbn);

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

/**
 * Handles clicks on book cards.
 *
 * @param {Event} event
 */
function handleBookClick(event) {
  const card = event.target.closest(".book-card");
  if (!card) {
    return;
  }

  const { isbn } = card.dataset;
  if (isbn) {
    displayBookDetails(isbn);
  }
}

/**
 * Filters books using the search box.
 *
 * @param {Event} event
 */
function handleSearch(event) {
  const searchTerm = event.target.value.trim();

  if (!searchTerm) {
    renderBookCatalogue(getAllBooks());
    return;
  }

  const search = searchTerm.toLowerCase();
  const results = getAllBooks().filter((book) =>
    book.title.toLowerCase().includes(search) ||
    book.author.toLowerCase().includes(search) ||
    book.category.toLowerCase().includes(search) ||
    book.isbn.toLowerCase().includes(search)
  );

  renderBookCatalogue(results);
}

/**
 * Filters books by category.
 */
function handleFilterChange() {
  const selectedCategory = filterDropdown.value;
  const category = selectedCategory.trim().toLowerCase();

  if (category === "all") {
    renderBookCatalogue(getAllBooks());
    return;
  }

  const filtered = getAllBooks().filter(
    (book) => book.category.trim().toLowerCase() === category
  );

  renderBookCatalogue(filtered);
}

/**
 * Displays detailed information about a selected book.
 *
 * @param {string} isbn
 */
function displayBookDetails(isbn) {
  if (typeof isbn !== "string" || !isbn.trim()) {
    return;
  }

  const book = findBookByISBN(isbn);
  if (!book) {
    console.error("Book not found.");
    return;
  }

  const detailsContainer = document.getElementById("book-details");
  if (!detailsContainer) {
    return;
  }

  detailsContainer.innerHTML = `
    <div class="book-details">
      <h2>${book.title}</h2>
      <p><strong>Author:</strong> ${book.author}</p>
      <p><strong>ISBN:</strong> ${book.isbn}</p>
      <p><strong>Year:</strong> ${book.year}</p>
      <p><strong>Category:</strong> ${book.category}</p>
      <p><strong>Type:</strong> ${book instanceof DigitalBook ? "Digital" : "Physical"}</p>
      <p><strong>Available Copies:</strong> ${book.availableCopies} / ${book.totalCopies ?? book.availableCopies}</p>
    </div>
  `;
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

/**
 * Creates the member registration form and hooks up registration logic.
 */
function createMemberForm() {
  const formContainer = document.getElementById("member-form");
  if (!formContainer) {
    return;
  }

  formContainer.innerHTML = "";
  const form = document.createElement("form");
  form.id = "new-member-form";

  form.innerHTML = `
    <label for="member-id">Member ID</label>
    <input type="text" id="member-id" placeholder="e.g. M004" required>
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

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const memberId = document.getElementById("member-id").value.trim();
    const firstName = document.getElementById("first-name").value.trim();
    const lastName = document.getElementById("last-name").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();

    try {
      const member = new Member(memberId, firstName, lastName, email, phone);

      const added = window.addMember(member);
      if (!added) {
        alert("Member with this ID already exists.");
        return;
      }

      form.reset();
      updateStatisticsDisplay();
      alert("Member added successfully!");
    } catch (error) {
      alert(error.message);
    }
  });

  formContainer.appendChild(form);
}

function createBookForm() {
  const formContainer =
    document.getElementById("book-form");

  if (!formContainer) {
    return;
  }

  formContainer.innerHTML = "";

  const form =
    document.createElement("form");

  form.id = "new-book-form";

  form.innerHTML = `
    <label>ISBN</label>
    <input
      type="text"
      id="book-isbn"
      required
    >

    <label>Title</label>
    <input
      type="text"
      id="book-title"
      required
    >

    <label>Author</label>
    <input
      type="text"
      id="book-author"
      required
    >

    <label>Year</label>
    <input
      type="number"
      id="book-year"
      required
    >

    <label>Copies</label>
    <input
      type="number"
      id="book-copies"
      value="1"
      required
    >

    <label>Category</label>
    <input
      type="text"
      id="book-category"
      value="General"
    >

    <label>Cover Image</label>
    <input
      type="text"
      id="book-image"
      placeholder="./assets/books/example.jpg"
    >

    <label>Book Type</label>
    <select id="book-type">
      <option value="physical">
        Physical
      </option>

      <option value="digital">
        Digital
      </option>
    </select>

    <button type="submit">
      Add Book
    </button>
  `;
    form.addEventListener(
    "submit",
    (event) => {

      event.preventDefault();

      const isbn =
        document.getElementById("book-isbn").value.trim();

      const title =
        document.getElementById("book-title").value.trim();

      const author =
        document.getElementById("book-author").value.trim();

      const year =
        Number(
          document.getElementById("book-year").value
        );

      const copies =
        Number(
          document.getElementById("book-copies").value
        );

      const category =
        document.getElementById("book-category").value.trim();

      const image =
        document.getElementById("book-image").value.trim();

      const type =
        document.getElementById("book-type").value;

      let book;

      if (type === "digital") {

        book = new DigitalBook(
          isbn,
          title,
          author,
          year,
          copies,
          category,
          image,
          "PDF",
          0
        );

      } else {

        book = new Book(
          isbn,
          title,
          author,
          year,
          copies,
          category,
          image
        );

      }

      const added =
        window.addBook(book);

      if (!added) {
        alert(
          "Book already exists."
        );

        return;
      }

      form.reset();

      loadCatalogue();

      alert(
        "Book added successfully!"
      );
    }
  );

  formContainer.appendChild(form);
}

/**
 * Loads the catalogue and updates the statistics.
 */
function loadCatalogue() {
  renderBookCatalogue(getAllBooks());
  updateStatisticsDisplay();
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