/**
 * LibraryManager.js
 * Manages books and members within the Library Management System.
 */

import Book from "../models/Book.js";
import DigitalBook from "../models/DigitalBook.js";
import Member from "../models/Member.js";
import PremiumMember from "../models/PremiumMember.js";

export default class LibraryManager {
  /**
   * Creates a new LibraryManager.
   */
  constructor() {
    /**
     * Collection of books in the library.
     *
     * @type {Array<Book|DigitalBook>}
     */
    this.books = [];

    /**
     * Collection of registered members.
     *
     * @type {Array<Member|PremiumMember>}
     */
    this.members = [];
  }

  // =====================================================
  // BOOK MANAGEMENT
  // =====================================================

  /**
   * Adds a new book to the library.
   *
   * @param {Book|DigitalBook} book
   * @returns {boolean}
   */
  addBook(book) {
    if (!(book instanceof Book)) {
      throw new Error("Book must be an instance of Book or DigitalBook.");
    }

    if (this.findBook(book.isbn)) {
      return false;
    }

    this.books.push(book);

    return true;
  }

  /**
   * Removes a book from the library.
   *
   * A book cannot be removed while it is
   * currently borrowed.
   *
   * @param {string} isbn
   * @returns {boolean}
   */
  removeBook(isbn) {
    if (typeof isbn !== "string" || !isbn.trim()) {
      throw new Error("ISBN must be a non-empty string.");
    }

    const normalizedIsbn = isbn.trim().toUpperCase();

    const index = this.books.findIndex(
      (book) => book.isbn.toUpperCase() === normalizedIsbn,
    );

    if (index === -1) {
      return false;
    }

    if (this.books[index].borrowedBy.length > 0) {
      return false;
    }

    this.books.splice(index, 1);

    return true;
  }

  /**
   * Finds a book using its ISBN.
   *
   * Search is case-insensitive.
   *
   * @param {string} isbn
   * @returns {Book|DigitalBook|null}
   */
  findBook(isbn) {
    if (typeof isbn !== "string" || !isbn.trim()) {
      throw new Error("ISBN must be a non-empty string.");
    }

    const normalizedIsbn = isbn.trim().toUpperCase();

    return (
      this.books.find((book) => book.isbn.toUpperCase() === normalizedIsbn) ||
      null
    );
  }

  /**
   * Searches books by:
   * - Title
   * - Author
   * - ISBN
   * - Category
   * - Publication Year
   *
   * Search is case-insensitive.
   *
   * @param {string} keyword
   * @returns {Array<Book|DigitalBook>}
   */
  searchBooks(keyword) {
    if (typeof keyword !== "string" || !keyword.trim()) {
      throw new Error("Search keyword must be a non-empty string.");
    }

    const search = keyword.trim().toLowerCase();

    return this.books.filter(
      (book) =>
        book.title.toLowerCase().includes(search) ||
        book.author.toLowerCase().includes(search) ||
        book.category.toLowerCase().includes(search) ||
        book.isbn.toLowerCase().includes(search) ||
        book.year.toString().includes(search),
    );
  }

  /**
   * Returns every book currently stored.
   *
   * A defensive copy is returned to
   * prevent accidental external mutation.
   *
   * @returns {Array<Book|DigitalBook>}
   */
  getAllBooks() {
    return [...this.books];
  }

  /**
   * Returns every available book.
   *
   * @returns {Array<Book|DigitalBook>}
   */
  getAvailableBooks() {
    return this.books.filter((book) => book.isAvailable());
  }

  // =====================================================
  // MEMBER MANAGEMENT
  // =====================================================

  /**
   * Registers a new member.
   *
   * @param {Member|PremiumMember} member
   * @returns {boolean}
   */
  addMember(member) {
    if (!(member instanceof Member)) {
      throw new Error("Member must be an instance of Member or PremiumMember.");
    }

    if (this.findMember(member.memberId)) {
      return false;
    }

    this.members.push(member);

    return true;
  }

  /**
   * Removes a member.
   *
   * Members cannot be removed while
   * they still have borrowed books.
   *
   * @param {string} memberId
   * @returns {boolean}
   */
  removeMember(memberId) {
    if (typeof memberId !== "string" || !memberId.trim()) {
      throw new Error("Member ID must be a non-empty string.");
    }

    const normalizedMemberId = memberId.trim().toUpperCase();

    const index = this.members.findIndex(
      (member) => member.memberId.toUpperCase() === normalizedMemberId,
    );

    if (index === -1) {
      return false;
    }

    if (this.members[index].borrowedBooks.length > 0) {
      return false;
    }

    this.members.splice(index, 1);

    return true;
  }

  /**
   * Finds a member using their ID.
   *
   * @param {string} memberId
   * @returns {Member|PremiumMember|null}
   */
  findMember(memberId) {
    if (typeof memberId !== "string" || !memberId.trim()) {
      throw new Error("Member ID must be a non-empty string.");
    }

    const normalizedMemberId = memberId.trim().toUpperCase();

    return (
      this.members.find(
        (member) => member.memberId.toUpperCase() === normalizedMemberId,
      ) || null
    );
  }

  /**
   * Searches members by:
   * - Member ID
   * - First name
   * - Last name
   * - Full name
   * - Email
   * - Phone number
   *
   * Search is case-insensitive.
   *
   * @param {string} keyword
   * @returns {Array<Member|PremiumMember>}
   */
  searchMembers(keyword) {
    if (typeof keyword !== "string" || !keyword.trim()) {
      throw new Error("Search keyword must be a non-empty string.");
    }

    const search = keyword.trim().toLowerCase();

    return this.members.filter(
      (member) =>
        member.memberId.toLowerCase().includes(search) ||
        member.firstName.toLowerCase().includes(search) ||
        member.lastName.toLowerCase().includes(search) ||
        member.fullName.toLowerCase().includes(search) ||
        member.email.toLowerCase().includes(search) ||
        member.phone.toLowerCase().includes(search),
    );
  }

  /**
   * Returns every registered member.
   *
   * A defensive copy is returned to
   * prevent accidental external mutation.
   *
   * @returns {Array<Member|PremiumMember>}
   */
  getAllMembers() {
    return [...this.members];
  }

  // =====================================================
  // BORROWING MANAGEMENT
  // =====================================================

  /**
   * Allows a member to borrow a book.
   *
   * The borrowing process is transactional:
   * if either the book or member update fails,
   * the operation is rolled back to maintain
   * data consistency.
   *
   * @param {string} memberId
   * @param {string} isbn
   * @returns {boolean}
   */
  borrowBook(memberId, isbn) {
    if (typeof memberId !== "string" || !memberId.trim()) {
      throw new Error("Member ID must be a non-empty string.");
    }

    if (typeof isbn !== "string" || !isbn.trim()) {
      throw new Error("ISBN must be a non-empty string.");
    }

    const member = this.findMember(memberId);
    const book = this.findBook(isbn);

    if (!member || !book) {
      return false;
    }

    if (!member.canBorrow()) {
      return false;
    }

    if (!book.isAvailable()) {
      return false;
    }

    // Prevent duplicate borrowing records.
  const normalizedIsbn = book.isbn.toUpperCase();

  if (
    member.borrowedBooks.some(
      (record) => record.isbn === normalizedIsbn,
    ) ||
    book.borrowedBy.some(
      (record) => record.memberId === member.memberId,
    )
  ) {
    return false;
  }

    const bookCheckedOut = book.checkOut(member.memberId);

    if (!bookCheckedOut) {
      return false;
    }

    const memberBorrowed = member.borrowBook(book.isbn);

    if (!memberBorrowed) {
      // Roll back the book checkout.
      book.returnBook(member.memberId);

      return false;
    }

    return true;
  }

  /**
   * Allows a member to return a borrowed book.
   *
   * If either update fails, the operation
   * is rolled back to preserve consistency.
   *
   * @param {string} memberId
   * @param {string} isbn
   * @returns {boolean}
   */
  returnBook(memberId, isbn) {
    if (typeof memberId !== "string" || !memberId.trim()) {
      throw new Error("Member ID must be a non-empty string.");
    }

    if (typeof isbn !== "string" || !isbn.trim()) {
      throw new Error("ISBN must be a non-empty string.");
    }

    const member = this.findMember(memberId);
    const book = this.findBook(isbn);

    if (!member || !book) {
      return false;
    }

    const memberReturned = member.returnBook(book.isbn);

    if (!memberReturned) {
      return false;
    }

    const bookReturned = book.returnBook(member.memberId);

    if (!bookReturned) {
      // Restore member record.
      member.borrowBook(book.isbn);

      return false;
    }

    return true;
  }

  // =====================================================
  // LIBRARY STATISTICS
  // =====================================================

  /**
   * Returns statistics about the library.
   *
   * @returns {Object}
   */
  getStatistics() {
    const totalBooks = this.books.length;

    const availableBooks = this.books.filter((book) =>
      book.isAvailable(),
    ).length;

    const borrowedBooks = this.books.reduce(
      (total, book) => total + book.borrowedBy.length,
      0,
    );

    const digitalBooks = this.books.filter(
      (book) => book instanceof DigitalBook,
    ).length;

    const physicalBooks = this.books.filter(
      (book) => !(book instanceof DigitalBook),
    ).length;

    const totalMembers = this.members.length;

    const premiumMembers = this.members.filter(
      (member) => member instanceof PremiumMember,
    ).length;

    const standardMembers = totalMembers - premiumMembers;

    return {
      totalBooks,
      availableBooks,
      borrowedBooks,
      physicalBooks,
      digitalBooks,
      totalMembers,
      standardMembers,
      premiumMembers,
    };
  }

  // =====================================================
  // UTILITY METHODS
  // =====================================================

  /**
   * Removes all books and members
   * from the library.
   *
   * Existing array references are preserved.
   */
  clearLibrary() {
    this.books.length = 0;
    this.members.length = 0;
  }

  /**
   * Determines whether a book exists.
   *
   * @param {string} isbn
   * @returns {boolean}
   */
  hasBook(isbn) {
    return this.findBook(isbn) !== null;
  }

  /**
   * Determines whether a member exists.
   *
   * @param {string} memberId
   * @returns {boolean}
   */
  hasMember(memberId) {
    return this.findMember(memberId) !== null;
  }
}
