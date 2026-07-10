import DigitalBook from "../models/DigitalBook.js";

describe("DigitalBook Class", () => {
  let digitalBook;

  beforeEach(() => {
    digitalBook = new DigitalBook(
      "978-1111111111",
      "Modern JavaScript",
      "Jane Doe",
      2025,
      1,
      "Programming",
      "images/js.jpg",
      25
    );
  });

  test("creates a DigitalBook with correct properties", () => {
    expect(digitalBook.isbn).toBe("978-1111111111");
    expect(digitalBook.title).toBe("Modern JavaScript");
    expect(digitalBook.author).toBe("Jane Doe");
    expect(digitalBook.fileSize).toBe(25);
    expect(digitalBook.downloadCount).toBe(0);
  });

  test("inherits from Book", () => {
    expect(digitalBook.getBookType()).toBe("Digital");
    expect(digitalBook.isAvailable()).toBe(true);
  });

  test("download increases download count", () => {
    digitalBook.download();

    expect(digitalBook.downloadCount).toBe(1);
  });

  test("multiple downloads increase download count correctly", () => {
    digitalBook.download();
    digitalBook.download();

    expect(digitalBook.downloadCount).toBe(2);
  });

  test("checkOut downloads the book", () => {
    const borrowed = digitalBook.checkOut("M001");

    expect(borrowed).toBe(true);
    expect(digitalBook.downloadCount).toBe(1);
    expect(digitalBook.borrowedBy).toContain("M001");
  });

  test("checkOut does not reduce available copies", () => {
    const copies = digitalBook.availableCopies;

    digitalBook.checkOut("M001");

    expect(digitalBook.availableCopies).toBe(copies);
  });

  test("returnBook removes member from borrowed list", () => {
    digitalBook.checkOut("M001");

    digitalBook.returnBook("M001");

    expect(digitalBook.borrowedBy).not.toContain("M001");
  });

  test("returnBook always returns true", () => {
    expect(digitalBook.returnBook("UNKNOWN")).toBe(true);
  });

  test("getInfo returns formatted string", () => {
    const info = digitalBook.getInfo();

    expect(info).toContain("Modern JavaScript");
    expect(info).toContain("25");
    expect(info).toContain("Downloads");
  });

  test("getDetails returns digital properties", () => {
    const details = digitalBook.getDetails();

    expect(details.fileSize).toBe(25);
    expect(details.downloadCount).toBe(0);
    expect(details.bookType).toBe("Digital");
  });

  test("toString returns formatted string", () => {
    expect(digitalBook.toString()).toContain("Digital Book");
  });

  test("throws error for invalid file size", () => {
    expect(() => {
      new DigitalBook(
        "123",
        "Book",
        "Author",
        2024,
        1,
        "General",
        "cover.jpg",
        -5
      );
    }).toThrow();
  });

  test("throws error when member id is empty", () => {
    expect(() => {
      digitalBook.checkOut("");
    }).toThrow();
  });

  test("throws error when member id is not a string", () => {
    expect(() => {
      digitalBook.checkOut(null);
    }).toThrow();
  });
});