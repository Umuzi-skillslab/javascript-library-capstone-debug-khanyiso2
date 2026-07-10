/**
 * app.js
 * Entry point for the Library Management System.
 */

import Book from "../models/Book.js";
import DigitalBook from "../models/DigitalBook.js";
import Member from "../models/Member.js";
import PremiumMember from "../models/PremiumMember.js";
import LibraryManager from "./services/LibraryManager.js";
import Storage from "./services/Storage.js";

const library = new LibraryManager();
const storage = new Storage();

/**
 * Creates sample library data.
 */
function createSampleLibrary() {
  library.addBook(
    new Book(
      "9780132350884",
      "Clean Code",
      "Robert C. Martin",
      2008,
      5,
      "Programming",
      "./assets/books/clean-code.jpg"
    )
  );

  library.addBook(
    new Book(
      "9781593279509",
      "Eloquent JavaScript",
      "Marijn Haverbeke",
      2018,
      4,
      "Programming",
      "./assets/books/eloquent-javascript.jpg"
    )
  );

  library.addBook(
    new Book(
      "9780596517748",
      "JavaScript: The Good Parts",
      "Douglas Crockford",
      2008,
      3,
      "Programming",
      "./assets/books/javascript-good-parts.jpg"
    )
  );

  library.addBook(
    new Book(
      "9780134494166",
      "Clean Architecture",
      "Robert C. Martin",
      2017,
      4,
      "Programming",
      "./assets/books/clean-architecture.jpg"
    )
  );

  library.addBook(
    new Book(
      "9780201616224",
      "The Pragmatic Programmer",
      "Andrew Hunt",
      1999,
      3,
      "Programming",
      "./assets/books/pragmatic-programmer.jpg"
    )
  );

  library.addBook(
    new Book(
      "9780131103627",
      "The C Programming Language",
      "Brian W. Kernighan",
      1988,
      2,
      "Programming",
      "./assets/books/c-programming-language.jpg"
    )
  );

  library.addBook(
   new DigitalBook(
     "9781492052203",
     "Learning JavaScript Design Patterns",
     "Addy Osmani",
     2023,
     1,
     "Programming",
     "./assets/books/javascript-design-patterns.jpg",
     "PDF",
     13
    )
  );

  library.addMember(
    new Member(
      "M001",
      "Thingolwethu",
      "Qwabe",
      "lwethu.t@gmail.com",
      "0824681097"
    )
  );

  library.addMember(
    new Member(
      "M002",
      "Cwenga",
      "Msesiwe",
      "cwenga.m@gmail.com",
      "0835798642"
    )
  );

  library.addMember(
    new Member(
      "M003",
      "Olwethu",
      "Diamond",
      "olwethu.d@gmail.com",
      "0815711317"
    )
  );
  
  library.addMember(
  new PremiumMember(
    "PM001",
    "Sinentlahla",
    "Mkhize",
    "sine.m@gmail.com",
    "0841234567"
  )
);
  storage.saveLibrary(library);
}

/**
 * Loads the library from localStorage.
 *
 * @returns {LibraryManager}
 */
function initializeLibrary() {
  try {
    if (storage.hasSavedLibrary()) {
      return storage.loadLibrary();
    }
  } catch (error) {
    console.error(
      "Failed to load saved library:",
      error
    );
  }
  
  createSampleLibrary();

  console.log(
    "Sample library created."
  );

  return library;
}

let libraryManager = initializeLibrary();

/**
 * Makes the LibraryManager available globally
 * so the UI can access it.
 */
window.libraryManager = libraryManager;

/**
 * Saves the current library.
 */
function saveLibrary() {
  storage.saveLibrary(libraryManager);
}

/**
 * Adds a new book.
 *
 * @param {Book|DigitalBook} book
 */
function addBook(book) {
  if (libraryManager.addBook(book)) {
    saveLibrary();

    console.log(
      "Book added successfully."
    );

    return true;
  }

  console.warn(
    "Book already exists."
  );

  return false;
}

/**
 * Adds a new member.
 *
 * @param {Member|PremiumMember} member
 */
function addMember(member) {
  if (libraryManager.addMember(member)) {
    saveLibrary();
    console.log("Member added successfully.");
    return true;
  }

  console.warn("Member already exists.");
  return false;
}

/**
 * Borrows a book.
 *
 * @param {string} memberId
 * @param {string} isbn
 *
 * @returns {boolean}
 */
function borrowBook(memberId, isbn) {
  if (
    typeof memberId !== "string" ||
    typeof isbn !== "string"
  ) {
    return false;
  }

  if (
    !memberId.trim() ||
    !isbn.trim()
  ) {
    return false;
  }

  const success =
    libraryManager.borrowBook(
      memberId,
      isbn
    );

  if (success) {
    saveLibrary();
  }

  return success;
}

/**
 * Returns a borrowed book.
 *
 * @param {string} memberId
 * @param {string} isbn
 *
 * @returns {boolean}
 */
function returnBook(memberId, isbn) {
  if (
    typeof memberId !== "string" ||
    typeof isbn !== "string"
  ) {
    return false;
  }

  if (
    !memberId.trim() ||
    !isbn.trim()
  ) {
    return false;
  }

  const success =
    libraryManager.returnBook(
      memberId,
      isbn
    );

  if (success) {
    saveLibrary();
  }

  return success;
}
/**
 * Finds a book by ISBN.
 *
 * @param {string} isbn
 * @returns {Book|DigitalBook|null}
 */
function findBookByISBN(isbn) {
  return libraryManager.findBook(isbn);
}

/**
 * Finds a member by ID.
 *
 * @param {string} memberId
 * @returns {Member|PremiumMember|null}
 */
function findMemberById(memberId) {
  return libraryManager.findMember(memberId);
}

/**
 * Returns all books.
 *
 * @returns {Array}
 */
function getAllBooks() {
  return libraryManager.getAllBooks();
}

/**
 * Returns all members.
 *
 * @returns {Array}
 */
function getAllMembers() {
  return libraryManager.getAllMembers();
}

/**
 * Returns library statistics.
 *
 * @returns {Object}
 */
function getStatistics() {
  return libraryManager.getStatistics();
}

/**
 * Exports the library as JSON.
 *
 * @returns {string}
 */
function exportLibrary() {
  return storage.exportLibrary(
    libraryManager
  );
}

/**
 * Imports a library from JSON.
 *
 * @param {string} jsonData
 */
function importLibrary(jsonData) {
  try {
    libraryManager =
      storage.importLibrary(
        jsonData
      );

    window.libraryManager =
      libraryManager;

    console.log(
      "Library imported successfully."
    );
  } catch (error) {
    console.error(
      "Failed to import library:",
      error
    );
  }
}

/**
 * Clears all library data.
 */
function clearLibrary() {
  try {
    libraryManager.clearLibrary();

    storage.clearLibrary();

    console.log(
      "Library cleared successfully."
    );
  } catch (error) {
    console.error(
      "Failed to clear library:",
      error
    );
  }
}

/**
 * Expose helper functions globally
 * so the UI can access them.
 */
window.addBook = addBook;
window.addMember = addMember;
window.borrowBook = borrowBook;
window.returnBook = returnBook;

window.findBookByISBN =
  findBookByISBN;

window.findMemberById =
  findMemberById;

window.getAllBooks =
  getAllBooks;

window.getAllMembers =
  getAllMembers;

window.getStatistics =
  getStatistics;

window.exportLibrary =
  exportLibrary;

window.importLibrary =
  importLibrary;

window.clearLibrary =
  clearLibrary;

/**
 * Initialize the application.
 */
document.addEventListener(
  "DOMContentLoaded",
  () => {
    console.log(
      "Library Management System initialized."
    );

    console.log(
      "Library statistics:",
      getStatistics()
    );
  }
);