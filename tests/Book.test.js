import Book from "../models/Book.js";

describe("Book Class", () => {
  let book;

  beforeEach(() => {
    book = new Book(
      "978-1234567890",
      "JavaScript Essentials",
      "John Smith",
      2024,
      5,
      "Programming",
      "images/js.jpg"
    );
  });

  test("creates a book with the correct properties", () => {
    expect(book.isbn).toBe("978-1234567890");
    expect(book.title).toBe("JavaScript Essentials");
    expect(book.author).toBe("John Smith");
    expect(book.year).toBe(2024);
    expect(book.totalCopies).toBe(5);
    expect(book.availableCopies).toBe(5);
    expect(book.category).toBe("Programming");
    expect(book.borrowedBy).toEqual([]);
  });

  test("isAvailable returns true when copies exist", () => {
    expect(book.isAvailable()).toBe(true);
  });

  test("getStatus returns Available", () => {
    expect(book.getStatus()).toBe("Available");
  });

  test("checkOut decreases available copies", () => {
    const borrowed = book.checkOut("M001");

    expect(borrowed).toBe(true);
    expect(book.availableCopies).toBe(4);
    expect(book.borrowedBy).toContain("M001");
  });

  test("returnBook increases available copies", () => {
    book.checkOut("M001");

    const returned = book.returnBook("M001");

    expect(returned).toBe(true);
    expect(book.availableCopies).toBe(5);
    expect(book.borrowedBy.length).toBe(0);
  });

  test("addCopies increases total and available copies", () => {
    book.addCopies(3);

    expect(book.totalCopies).toBe(8);
    expect(book.availableCopies).toBe(8);
  });

  test("removeCopies decreases total copies", () => {
    book.removeCopies(2);

    expect(book.totalCopies).toBe(3);
    expect(book.availableCopies).toBe(3);
  });

  test("updateCategory changes category", () => {
    book.updateCategory("Technology");

    expect(book.category).toBe("Technology");
  });

  test("getDetails returns an object", () => {
    const details = book.getDetails();

    expect(details.title).toBe("JavaScript Essentials");
    expect(details.status).toBe("Available");
    expect(details.totalCopies).toBe(5);
  });

  test("getInfo returns formatted string", () => {
    expect(book.getInfo()).toContain("JavaScript Essentials");
    expect(book.getInfo()).toContain("John Smith");
    expect(book.getInfo()).toContain("Programming");
  });

  test("throws error for invalid ISBN", () => {
    expect(() => {
      new Book(
        "",
        "Book",
        "Author",
        2024,
        1
      );
    }).toThrow();
  });

  test("throws error for invalid year", () => {
    expect(() => {
      new Book(
        "123",
        "Book",
        "Author",
        -1,
        1
      );
    }).toThrow();
  });

  test("throws error when checking out with invalid member id", () => {
    expect(() => {
      book.checkOut("");
    }).toThrow();
  });

  test("returnBook returns false for unknown member", () => {
    expect(book.returnBook("UNKNOWN")).toBe(false);
  });

  test("cannot remove borrowed copies", () => {
    book.checkOut("M001");

    expect(() => {
      book.removeCopies(5);
    }).toThrow();
  });
});