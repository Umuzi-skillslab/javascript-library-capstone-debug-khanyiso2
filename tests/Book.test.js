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

    expect(book.borrowedBy).toHaveLength(1);
    expect(book.borrowedBy[0].memberId).toBe("M001");
    expect(book.borrowedBy[0]).toHaveProperty("borrowDate");
    expect(book.borrowedBy[0]).toHaveProperty("dueDate");
  });

  test("returnBook increases available copies", () => {
    book.checkOut("M001");

    const returned = book.returnBook("M001");

    expect(returned).toBe(true);
    expect(book.availableCopies).toBe(5);
    expect(book.borrowedBy).toHaveLength(0);
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

  test("throws error for invalid title", () => {
   expect(() => {
     new Book("123", "", "Author", 2024);
   }).toThrow("Title must be a non-empty string.");
  });

  test("throws error for invalid author", () => {
    expect(() => {
      new Book("123", "Book", "", 2024);
    }).toThrow("Author must be a non-empty string.");
  });

  test("throws error for invalid total copies", () => {
    expect(() => {
      new Book("123", "Book", "Author", 2024, 0);
    }).toThrow("Total copies must be at least 1.");
  });

  test("throws error for invalid category", () => {
    expect(() => {
      new Book("123", "Book", "Author", 2024, 1, "");
    }).toThrow("Category must be a non-empty string.");
  });

  test("throws error for invalid cover image", () => {
    expect(() => {
      new Book(
        "123",
        "Book",
        "Author",
        2024,
        1,
        "Programming",
        null
      );
    }).toThrow("Cover image must be a string.");
  });

  test("checkOut returns false when no copies are available", () => {
    const singleBook = new Book(
      "1",
      "Book",
      "Author",
      2024,
      1
    );

    singleBook.checkOut("M001");

    expect(singleBook.checkOut("M002")).toBe(false);
  });

  test("addCopies throws for invalid amount", () => {
   expect(() => {
    book.addCopies(0);
  }).toThrow("Amount must be greater than zero.");
 });

 test("removeCopies throws for invalid amount", () => {
  expect(() => {
    book.removeCopies(0);
  }).toThrow("Amount must be greater than zero.");
 });

 test("getBorrowRecord returns null for invalid member id", () => {
  expect(book.getBorrowRecord()).toBeNull();
  expect(book.getBorrowRecord(null)).toBeNull();
  expect(book.getBorrowRecord("")).toBeNull();
 });

 test("getBorrowRecord returns null when member has not borrowed", () => {
  expect(book.getBorrowRecord("M999")).toBeNull();
 });

 test("getBorrowRecord returns borrowing record", () => {
  book.checkOut("M001");

  const record = book.getBorrowRecord("M001");

  expect(record).not.toBeNull();
  expect(record.memberId).toBe("M001");
 });

 test("isOverdue returns false when book is not overdue", () => {
  book.checkOut("M001");

  expect(book.isOverdue("M001")).toBe(false);
 }); 

 test("isOverdue returns false when member has no record", () => {
  expect(book.isOverdue("M001")).toBe(false);
 });

 test("getRemainingDays returns a number", () => {
  book.checkOut("M001");

  expect(book.getRemainingDays("M001")).toBeGreaterThan(0);
 });

 test("getRemainingDays returns null when member has no record", () => {
  expect(book.getRemainingDays("M001")).toBeNull();
 });

 test("updateCategory ignores invalid category", () => {
  book.updateCategory("");

  expect(book.category).toBe("Programming");
 });  

 test("toString returns formatted string", () => {  
    expect(book.toString()).toBe(
      "JavaScript Essentials by John Smith (2024)"
    );
  });
});