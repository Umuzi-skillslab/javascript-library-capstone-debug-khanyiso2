/**
 * DigitalBook.js
 * Represents a digital book in the Library Management System.
 * Extends Book with digital-specific functionality.
 */

import Book from "./Book.js";

export default class DigitalBook extends Book {

  constructor(
    isbn,
    title,
    author,
    year,
    totalCopies = 1,
    category = "General",
    coverImage = "images/default-book.jpg",
    fileSize = 0
  ) {

    super(
      isbn,
      title,
      author,
      year,
      totalCopies,
      category,
      coverImage
    );


    if (
      typeof fileSize !== "number" ||
      Number.isNaN(fileSize) ||
      fileSize < 0
    ) {
      throw new Error(
        "File size must be a valid number."
      );
    }
 
    this.fileSize = fileSize;

    this.downloadCount = 0;
  }



  /**
   * Downloads the digital book.
   *
   * @returns {boolean}
   */
  download() {

    this.downloadCount++;

    return true;
  }



  /**
   * Digital books do not reduce availability.
   *
   * @param {string} memberId
   * @returns {boolean}
   */
  checkOut(memberId) {

    if (
      typeof memberId !== "string" ||
      !memberId.trim()
    ) {
      throw new Error(
        "A valid member ID is required."
      );
    }


    this.download();


    this.borrowedBy.push(
      memberId.trim()
    );


    return true;
  }



  /**
   * Digital books do not need returning.
   *
   * @returns {boolean}
   */
returnBook(memberId) {
  if (
    typeof memberId !== "string" ||
    !memberId.trim()
  ) {
    return false;
  }

  const index = this.borrowedBy.indexOf(
    memberId.trim()
  );

  if (index !== -1) {
    this.borrowedBy.splice(index, 1);
  }

  return true;
}


  getInfo() {

    return `${super.getInfo()}
    File Size: ${this.fileSize} MB
    Downloads: ${this.downloadCount}`;

  }



  getDetails() {

  return {
    ...super.getDetails(),
    fileSize: this.fileSize,
    downloadCount: this.downloadCount,
    bookType: "Digital"
  };

  }

  getBookType() {
    return "Digital";
  }

  toString() {

    return `${this.title} by ${this.author} (${this.year}) - Digital Book`;

  }

}