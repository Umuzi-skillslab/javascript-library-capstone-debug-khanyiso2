/**
 * Book.js
 * Represents a physical book in the Library Management System.
 * This class serves as the parent class for DigitalBook.
 */

export default class Book {
  /**
   * Creates a new Book.
   *
   * @param {string} isbn - Unique ISBN number.
   * @param {string} title - Book title.
   * @param {string} author - Book author.
   * @param {number} year - Publication year.
   * @param {number} totalCopies - Number of copies owned by the library.
   * @param {string} category - Book category.
   * @param {string} coverImage - Path to the book cover image.
   */
  constructor(
    isbn,
    title,
    author,
    year,
    totalCopies = 1,
    category = "General",
    coverImage = "images/default-book.jpg",
  ) {
    // Validate ISBN
    if (typeof isbn !== "string" || !isbn.trim()) {
      throw new Error("ISBN must be a non-empty string.");
    }

    // Validate title
    if (typeof title !== "string" || !title.trim()) {
      throw new Error("Title must be a non-empty string.");
    }

    // Validate author
    if (typeof author !== "string" || !author.trim()) {
      throw new Error("Author must be a non-empty string.");
    }

    // Validate publication year
    if (typeof year !== "number" || Number.isNaN(year) || year < 0) {
      throw new Error("Year must be a valid number.");
    }

    // Validate number of copies
    if (
      typeof totalCopies !== "number" ||
      Number.isNaN(totalCopies) ||
      totalCopies < 1
    ) {
      throw new Error("Total copies must be at least 1.");
    }

    // Validate category
    if (typeof category !== "string" || !category.trim()) {
      throw new Error("Category must be a non-empty string.");
    }

    // Validate cover image
    if (typeof coverImage !== "string") {
      throw new Error("Cover image must be a string.");
    }

    this.isbn = isbn.trim();
    this.title = title.trim();
    this.author = author.trim();
    this.year = year;
    this.category = category.trim();

    this.coverImage = coverImage.trim();

    this.totalCopies = totalCopies;
    this.availableCopies = totalCopies;

    // Stores borrowing records for members currently borrowing the book
    // Example:
    // {
    //   memberId: "M001",
    //   borrowDate: "2026-07-16",
    //   dueDate: "2026-07-30"
    // }
    this.borrowedBy = [];
  }

  /**
   * Returns true if the book has at least one available copy.
   *
   * @returns {boolean}
   */
  isAvailable() {
    return this.availableCopies > 0;
  }

  /**
   * Returns the availability status.
   *
   * @returns {string}
   */
  getStatus() {
    return this.isAvailable() ? "Available" : "Unavailable";
  }

  /**
   * Borrow a copy of the book.
   *
   * @param {string} memberId
   * @returns {boolean}
   */
  checkOut(memberId) {
    if (typeof memberId !== "string" || !memberId.trim()) {
      throw new Error("A valid member ID is required.");
    }

    if (!this.isAvailable()) {
      return false;
    }

    const borrowDate = new Date();

    const dueDate = new Date(borrowDate);

    dueDate.setDate(dueDate.getDate() + 14);

    this.borrowedBy.push({
      memberId: memberId.trim(),
      borrowDate: borrowDate.toISOString(),
      dueDate: dueDate.toISOString(),
    });

    this.availableCopies--;

    return true;
  }

  /**
   * Return a borrowed copy.
   *
   * @param {string} memberId
   * @returns {boolean}
   */
  returnBook(memberId) {
    if (typeof memberId !== "string" || !memberId.trim()) {
      return false;
    }

    const memberIndex = this.borrowedBy.findIndex(
      (record) => record.memberId === memberId.trim(),
    );

    if (memberIndex === -1) {
      return false;
    }

    this.borrowedBy.splice(memberIndex, 1);
    this.availableCopies++;

    return true;
  }

  /**
   * Add copies to the library.
   *
   * @param {number} amount
   */
  addCopies(amount) {
    if (typeof amount !== "number" || Number.isNaN(amount) || amount < 1) {
      throw new Error("Amount must be greater than zero.");
    }

    this.totalCopies += amount;
    this.availableCopies += amount;
  }

  /**
   * Returns the borrowing record for a member.
   *
   * @param {string} memberId
   * @returns {Object|null}
   */
  getBorrowRecord(memberId) {
    if (typeof memberId !== "string" || !memberId.trim()) {
      return null;
    }

    return (
      this.borrowedBy.find(
        (record) => record.memberId === memberId.trim()
      ) || null
    );
  }

  /**
   * Checks whether a borrowed book is overdue.
   *
   * @param {string} memberId
   * @returns {boolean}
   */
  isOverdue(memberId) {
    const record = this.getBorrowRecord(memberId);

    if (!record) {
      return false;
    }

    return new Date() > new Date(record.dueDate);
  }

  /**
   * Returns the number of days remaining
   * until the due date.
   *
   * @param {string} memberId
   * @returns {number|null}
   */
  getRemainingDays(memberId) {
    const record = this.getBorrowRecord(memberId);

    if (!record) {
      return null;
    }

    const today = new Date();

    const dueDate = new Date(record.dueDate);

    const milliseconds = dueDate - today;

    return Math.ceil(milliseconds / (1000 * 60 * 60 * 24));
  }

  /**
   * Remove copies from the library.
   *
   * @param {number} amount
   */
  removeCopies(amount) {
    if (typeof amount !== "number" || Number.isNaN(amount) || amount < 1) {
      throw new Error("Amount must be greater than zero.");
    }

    if (this.totalCopies - amount < this.borrowedBy.length) {
      throw new Error("Cannot remove borrowed copies.");
    }

    this.totalCopies -= amount;

    if (this.availableCopies > this.totalCopies) {
      this.availableCopies = this.totalCopies;
    }
  }

  /**
   * Update the book category.
   *
   * @param {string} category
   */
  updateCategory(category) {
    if (typeof category === "string" && category.trim()) {
      this.category = category.trim();
    }
  }

  /**
   * Returns all book details.
   *
   * @returns {Object}
   */
  getDetails() {
    const {
      isbn,
      title,
      author,
      year,
      category,
      totalCopies,
      availableCopies,
      coverImage,
      borrowedBy,
    } = this;

    return {
      isbn,
      title,
      author,
      year,
      category,
      totalCopies,
      availableCopies,
      coverImage,
      borrowedBy: borrowedBy.map((record) => ({
        ...record,
      })),
      status: this.getStatus(),
    };
  }

  /**
   * Returns formatted information about the book.
   *
   * @returns {string}
   */
  getInfo() {
    return `
Title: ${this.title}
Author: ${this.author}
ISBN: ${this.isbn}
Category: ${this.category}
Published: ${this.year}
Available Copies: ${this.availableCopies}/${this.totalCopies}
Status: ${this.getStatus()}
`.trim();
  }

  /**
   * Returns a readable string representation.
   *
   * @returns {string}
   */
  toString() {
    return `${this.title} by ${this.author} (${this.year})`;
  }
}
