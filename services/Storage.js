/**
 * Storage.js
 * Handles saving and loading the Library Management System
 * using browser localStorage.
 */

import Book from "../models/Book.js";
import DigitalBook from "../models/DigitalBook.js";
import Member from "../models/Member.js";
import PremiumMember from "../models/PremiumMember.js";
import LibraryManager from "./LibraryManager.js";

/**
 * Local Storage key used to persist library data.
 *
 * @type {string}
 */
const STORAGE_KEY = "library-management-system";

export default class Storage {
  /**
   * Creates a new Storage service.
   */
  constructor() {
    this.storageKey = STORAGE_KEY;
  }

  /**
   * Saves the current library to localStorage.
   *
   * @param {LibraryManager} libraryManager
   * @returns {boolean}
   */
  saveLibrary(libraryManager) {
    if (!(libraryManager instanceof LibraryManager)) {
      throw new Error("LibraryManager must be an instance of LibraryManager.");
    }

    try {
      const data = {
        books: libraryManager.getAllBooks().map((book) => book.getDetails()),

        members: libraryManager
          .getAllMembers()
          .map((member) => member.getDetails()),
      };

      localStorage.setItem(this.storageKey, JSON.stringify(data));

      return true;
    } catch (error) {
      console.error("Failed to save library:", error);

      return false;
    }
  }

  /**
   * Loads the library from localStorage.
   *
   * Recreates class instances so methods
   * and inheritance are preserved.
   *
   * @returns {LibraryManager}
   */
  loadLibrary() {
    const libraryManager = new LibraryManager();

    try {
      const savedData = localStorage.getItem(this.storageKey);

      if (!savedData) {
        return libraryManager;
      }

      const data = JSON.parse(savedData);

      if (!data || typeof data !== "object") {
        return libraryManager;
      }

      // ============================
      // Restore Books
      // ============================

      if (Array.isArray(data.books)) {
        data.books.forEach((bookData) => {
          let book;

          if (bookData.bookType === "Digital") {
            book = new DigitalBook(
              bookData.isbn,
              bookData.title,
              bookData.author,
              bookData.year,
              bookData.totalCopies,
              bookData.category,
              bookData.coverImage,
              bookData.fileSize,
            );

            book.downloadCount = bookData.downloadCount ?? 0;
          } else {
            book = new Book(
              bookData.isbn,
              bookData.title,
              bookData.author,
              bookData.year,
              bookData.totalCopies,
              bookData.category,
              bookData.coverImage,
            );
          }

          book.availableCopies = bookData.availableCopies ?? book.totalCopies;

          if (book instanceof DigitalBook) {
            book.availableCopies = book.totalCopies;
          }

          book.borrowedBy = Array.isArray(bookData.borrowedBy)
            ? bookData.borrowedBy.map((record) => ({
                memberId: record.memberId,
                borrowDate: record.borrowDate,
                dueDate: record.dueDate,
              }))
            : [];

          libraryManager.addBook(book);
        });
      }

      // ============================
      // Restore Members
      // ============================

      if (Array.isArray(data.members)) {
        data.members.forEach((memberData) => {
          let member;

          if (memberData.memberLevel === "Premium") {
            member = new PremiumMember(
              memberData.memberId,
              memberData.firstName,
              memberData.lastName,
              memberData.email,
              memberData.phone,
              new Date(memberData.joinDate),
              memberData.membershipType,
            );
          } else {
            member = new Member(
              memberData.memberId,
              memberData.firstName,
              memberData.lastName,
              memberData.email,
              memberData.phone,
              new Date(memberData.joinDate),
            );
          }

          member.borrowedBooks = Array.isArray(memberData.borrowedBooks)
            ? [...memberData.borrowedBooks]
            : [];

          if (typeof memberData.maxBooks === "number") {
            member.setBorrowingLimit(memberData.maxBooks);
          }

          libraryManager.addMember(member);
        });
      }

      return libraryManager;
    } catch (error) {
      console.error("Failed to load library:", error);

      return new LibraryManager();
    }
  }

  /**
   * Removes saved library data.
   *
   * @returns {boolean}
   */
  clearLibrary() {
    try {
      localStorage.removeItem(this.storageKey);

      return true;
    } catch (error) {
      console.error("Failed to clear library:", error);

      return false;
    }
  }

  /**
   * Checks whether saved data exists.
   *
   * @returns {boolean}
   */
  hasSavedLibrary() {
    try {
      return localStorage.getItem(this.storageKey) !== null;
    } catch (error) {
      console.error("Failed to check storage:", error);

      return false;
    }
  }

  /**
   * Exports library data as JSON.
   *
   * @param {LibraryManager} libraryManager
   * @returns {string}
   */
  exportLibrary(libraryManager) {
    if (!(libraryManager instanceof LibraryManager)) {
      throw new Error("LibraryManager must be an instance of LibraryManager.");
    }

    const data = {
      books: libraryManager.getAllBooks().map((book) => book.getDetails()),

      members: libraryManager
        .getAllMembers()
        .map((member) => member.getDetails()),
    };

    return JSON.stringify(data, null, 2);
  }

  /**
   * Imports library JSON data.
   *
   * @param {string} jsonData
   * @returns {LibraryManager}
   */
  importLibrary(jsonData) {
    if (typeof jsonData !== "string" || !jsonData.trim()) {
      throw new Error("JSON data must be a non-empty string.");
    }

    try {
      const data = JSON.parse(jsonData);

      if (!data || typeof data !== "object") {
        throw new Error("Invalid library data.");
      }

      localStorage.setItem(this.storageKey, jsonData);

      return this.loadLibrary();
    } catch (error) {
      console.error("Failed to import library:", error);

      throw new Error("Invalid JSON data.");
    }
  }
}
