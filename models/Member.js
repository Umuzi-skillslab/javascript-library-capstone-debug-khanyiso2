/**
 * Member.js
 * Represents a library member.
 * This class serves as the parent class for PremiumMember.
 */

export default class Member {
  /**
   * Creates a new library member.
   *
   * @param {string} memberId - Unique member ID.
   * @param {string} firstName - Member's first name.
   * @param {string} lastName - Member's last name.
   * @param {string} email - Member's email address.
   * @param {string} phone - Member's phone number.
   * @param {Date} joinDate - Date the member joined.
   */
  constructor(
    memberId,
    firstName,
    lastName,
    email,
    phone,
    joinDate = new Date()
  ) {
    // Validate member ID
    if (typeof memberId !== "string" || !memberId.trim()) {
      throw new Error("Member ID must be a non-empty string.");
    }

    // Validate first name
    if (typeof firstName !== "string" || !firstName.trim()) {
      throw new Error("First name must be a non-empty string.");
    }

    // Validate last name
    if (typeof lastName !== "string" || !lastName.trim()) {
      throw new Error("Last name must be a non-empty string.");
    }

    // Validate email
    if (
      typeof email !== "string" ||
      !email.trim() ||
      !email.includes("@")
    ) {
      throw new Error("A valid email address is required.");
    }

    // Validate phone
    if (typeof phone !== "string" || !phone.trim()) {
      throw new Error("Phone number must be a non-empty string.");
    }

    // Validate join date
    if (!(joinDate instanceof Date) || Number.isNaN(joinDate.getTime())) {
      throw new Error("Join date must be a valid Date object.");
    }

    this.memberId = memberId.trim();
    this.firstName = firstName.trim();
    this.lastName = lastName.trim();
    this.email = email.trim();
    this.phone = phone.trim();
    this.joinDate = joinDate;

    // Stores ISBNs of borrowed books
    this.borrowedBooks = [];

    // Default borrowing limit
    this.maxBooks = 5;
  }

  /**
   * Returns the member's full name.
   *
   * @returns {string}
   */
  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  }

  /**
   * Determines whether the member can borrow another book.
   *
   * @returns {boolean}
   */
  canBorrow() {
    return this.borrowedBooks.length < this.maxBooks;
  }

  /**
   * Records a borrowed book by ISBN.
   *
   * @param {string} isbn
   * @returns {boolean}
   */
  borrowBook(isbn) {
    if (typeof isbn !== "string" || !isbn.trim()) {
      throw new Error("A valid ISBN is required.");
    }

    if (!this.canBorrow()) {
      return false;
    }

    if (this.borrowedBooks.includes(isbn.trim())) {
      return false;
    }

    this.borrowedBooks.push(isbn.trim());

    return true;
  }

  /**
   * Removes a borrowed book by ISBN.
   *
   * @param {string} isbn
   * @returns {boolean}
   */
  returnBook(isbn) {
    if (typeof isbn !== "string" || !isbn.trim()) {
      return false;
    }

    const index = this.borrowedBooks.indexOf(isbn.trim());

    if (index === -1) {
      return false;
    }

    this.borrowedBooks.splice(index, 1);

    return true;
  }

  /**
   * Calculates completed membership years.
   *
   * @returns {number}
   */
  getMembershipDuration() {
    const today = new Date();

    let years = today.getFullYear() - this.joinDate.getFullYear();

    const hasAnniversaryPassed =
      today.getMonth() > this.joinDate.getMonth() ||
      (
        today.getMonth() === this.joinDate.getMonth() &&
        today.getDate() >= this.joinDate.getDate()
      );

    if (!hasAnniversaryPassed) {
      years--;
    }

    return years;
  }

  /**
   * Returns membership duration as readable text.
   *
   * @returns {string}
   */
  getMembershipDurationText() {
    const years = this.getMembershipDuration();

    return `${years} ${years === 1 ? "year" : "years"}`;
  }

  /**
   * Updates the member's email address.
   *
   * @param {string} email
   */
  updateEmail(email) {
    if (
      typeof email !== "string" ||
      !email.trim() ||
      !email.includes("@")
    ) {
      throw new Error("A valid email address is required.");
    }

    this.email = email.trim();
  }

  /**
   * Updates the member's phone number.
   *
   * @param {string} phone
   */
  updatePhone(phone) {
    if (typeof phone !== "string" || !phone.trim()) {
      throw new Error("Phone number must be a non-empty string.");
    }

    this.phone = phone.trim();
  }

  /**
   * Returns all member information.
   *
   * @returns {Object}
   */
  getDetails() {
    const {
      memberId,
      firstName,
      lastName,
      email,
      phone,
      joinDate,
      borrowedBooks,
      maxBooks
    } = this;

    return {
      memberId,
      firstName,
      lastName,
      fullName: this.fullName,
      email,
      phone,
      joinDate,
      borrowedBooks: [...borrowedBooks],
      borrowedCount: borrowedBooks.length,
      maxBooks,
      membershipDuration: this.getMembershipDuration(),
      membershipDurationText: this.getMembershipDurationText()
    };
  }

  /**
   * Returns formatted member information.
   *
   * @returns {string}
   */
  getInfo() {
    return `
Member ID: ${this.memberId}
Name: ${this.fullName}
Email: ${this.email}
Phone: ${this.phone}
Borrowed Books: ${this.borrowedBooks.length}/${this.maxBooks}
Member Since: ${this.joinDate.toDateString()}
Membership Duration: ${this.getMembershipDurationText()}
`.trim();
  }

  /**
   * Returns a readable string representation.
   *
   * @returns {string}
   */
  toString() {
    return `${this.fullName} (${this.memberId})`;
  }
}