import LibraryManager from "../services/LibraryManager.js";
import Book from "../models/Book.js";
import DigitalBook from "../models/DigitalBook.js";
import Member from "../models/Member.js";
import PremiumMember from "../models/PremiumMember.js";

describe("LibraryManager Class", () => {
  let library;
  let book;
  let digitalBook;
  let member;
  let premiumMember;

  beforeEach(() => {
    library = new LibraryManager();

    book = new Book(
      "9781234567890",
      "JavaScript",
      "John Smith",
      2024,
      5,
      "Programming"
    );

    digitalBook = new DigitalBook(
      "9780987654321",
      "Node.js Guide",
      "Jane Doe",
      2023,
      1,
      "Programming",
      "images/node.jpg",
      25
    );

    member = new Member(
      "M001",
      "John",
      "Doe",
      "john@test.com",
      "0123456789"
    );

    premiumMember = new PremiumMember(
      "P001",
      "Jane",
      "Smith",
      "jane@test.com",
      "0987654321"
    );
  });

  test("constructor initializes empty arrays", () => {
    expect(library.books).toEqual([]);
    expect(library.members).toEqual([]);
  });

  test("addBook adds a book", () => {
    expect(library.addBook(book)).toBe(true);
    expect(library.books.length).toBe(1);
  });

  test("addBook rejects duplicate ISBN", () => {
    library.addBook(book);

    expect(library.addBook(book)).toBe(false);
  });

  test("addBook throws for invalid object", () => {
    expect(() => library.addBook({})).toThrow();
  });

  test("findBook returns the correct book", () => {
    library.addBook(book);

    expect(library.findBook(book.isbn)).toBe(book);
  });

  test("removeBook removes an existing book", () => {
    library.addBook(book);

    expect(library.removeBook(book.isbn)).toBe(true);
    expect(library.books.length).toBe(0);
  });

  test("searchBooks finds matching books", () => {
    library.addBook(book);

    const results = library.searchBooks("Java");

    expect(results.length).toBe(1);
    expect(results[0]).toBe(book);
  });

  test("getAvailableBooks returns only available books", () => {
    library.addBook(book);

    expect(library.getAvailableBooks()).toEqual([book]);
  });

  test("addMember adds a member", () => {
    expect(library.addMember(member)).toBe(true);
    expect(library.members.length).toBe(1);
  });

  test("duplicate member IDs are rejected", () => {
    library.addMember(member);

    expect(library.addMember(member)).toBe(false);
  });

  test("findMember returns the correct member", () => {
    library.addMember(member);

    expect(library.findMember("M001")).toBe(member);
  });

  test("removeMember removes an existing member", () => {
    library.addMember(member);

    expect(library.removeMember("M001")).toBe(true);
    expect(library.members.length).toBe(0);
  });

  test("searchMembers finds matching member", () => {
    library.addMember(member);

    const results = library.searchMembers("john");

    expect(results.length).toBe(1);
    expect(results[0]).toBe(member);
  });

  test("borrowBook succeeds for valid member and book", () => {
    library.addBook(book);
    library.addMember(member);

    expect(
      library.borrowBook(member.memberId, book.isbn)
    ).toBe(true);

    expect(member.borrowedBooks).toContain(book.isbn.toUpperCase());
  });

  test("cannot borrow same book twice", () => {
    library.addBook(book);
    library.addMember(member);

    library.borrowBook(member.memberId, book.isbn);

    expect(
      library.borrowBook(member.memberId, book.isbn)
    ).toBe(false);
  });

  test("returnBook succeeds", () => {
    library.addBook(book);
    library.addMember(member);

    library.borrowBook(member.memberId, book.isbn);

    expect(
      library.returnBook(member.memberId, book.isbn)
    ).toBe(true);
  });

  test("hasBook returns true when book exists", () => {
    library.addBook(book);

    expect(library.hasBook(book.isbn)).toBe(true);
  });

  test("hasMember returns true when member exists", () => {
    library.addMember(member);

    expect(library.hasMember(member.memberId)).toBe(true);
  });

  test("clearLibrary removes all books and members", () => {
    library.addBook(book);
    library.addBook(digitalBook);

    library.addMember(member);
    library.addMember(premiumMember);

    library.clearLibrary();

    expect(library.books.length).toBe(0);
    expect(library.members.length).toBe(0);
  });

  test("getStatistics returns correct values", () => {
    library.addBook(book);
    library.addBook(digitalBook);

    library.addMember(member);
    library.addMember(premiumMember);

    const stats = library.getStatistics();

    expect(stats.totalBooks).toBe(2);
    expect(stats.digitalBooks).toBe(1);
    expect(stats.physicalBooks).toBe(1);
    expect(stats.totalMembers).toBe(2);
    expect(stats.premiumMembers).toBe(1);
    expect(stats.standardMembers).toBe(1);
  });
});