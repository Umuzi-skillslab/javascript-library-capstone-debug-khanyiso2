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

  // ============================================
  // Constructor
  // ============================================

  test("constructor initializes empty arrays", () => {
    expect(library.books).toEqual([]);
    expect(library.members).toEqual([]);
  });

  // ============================================
  // Book Management
  // ============================================

  test("addBook adds a book", () => {
    expect(library.addBook(book)).toBe(true);
    expect(library.books.length).toBe(1);
  });

  test("addBook adds a digital book", () => {
    expect(library.addBook(digitalBook)).toBe(true);
    expect(library.books.length).toBe(1);
  });

  test("addBook rejects duplicate ISBN", () => {
    library.addBook(book);

    expect(library.addBook(book)).toBe(false);
  });

  test("addBook throws for invalid object", () => {
    expect(() => library.addBook({})).toThrow(
      "Book must be an instance of Book or DigitalBook."
    );
  });

  test("findBook returns the correct book", () => {
    library.addBook(book);

    expect(library.findBook(book.isbn)).toBe(book);
  });

  test("findBook returns null when not found", () => {
    expect(library.findBook("UNKNOWN")).toBeNull();
  });

  test("findBook is case insensitive", () => {
    library.addBook(book);

    expect(
      library.findBook(book.isbn.toLowerCase())
    ).toBe(book);
  });

  test("findBook throws for invalid ISBN", () => {
    expect(() => {
      library.findBook("");
    }).toThrow("ISBN must be a non-empty string.");
  });

  test("removeBook removes an existing book", () => {
    library.addBook(book);

    expect(library.removeBook(book.isbn)).toBe(true);
    expect(library.books.length).toBe(0);
  });

  test("removeBook returns false when book does not exist", () => {
    expect(library.removeBook("UNKNOWN")).toBe(false);
  });

  test("removeBook throws for invalid ISBN", () => {
    expect(() => {
      library.removeBook("");
    }).toThrow("ISBN must be a non-empty string.");
  });

  test("removeBook cannot remove borrowed book", () => {
    library.addBook(book);
    library.addMember(member);

    library.borrowBook(member.memberId, book.isbn);

    expect(
      library.removeBook(book.isbn)
    ).toBe(false);
  });

  test("searchBooks finds by title", () => {
    library.addBook(book);

    expect(
      library.searchBooks("Java")
    ).toEqual([book]);
  });

  test("searchBooks finds by author", () => {
    library.addBook(book);

    expect(
      library.searchBooks("John")
    ).toEqual([book]);
  });

  test("searchBooks finds by category", () => {
    library.addBook(book);

    expect(
      library.searchBooks("Programming")
    ).toEqual([book]);
  });

  test("searchBooks finds by ISBN", () => {
    library.addBook(book);

    expect(
      library.searchBooks(book.isbn)
    ).toEqual([book]);
  });

  test("searchBooks finds by year", () => {
    library.addBook(book);

    expect(
      library.searchBooks("2024")
    ).toEqual([book]);
  });

  test("searchBooks returns empty array when no match", () => {
    library.addBook(book);

    expect(
      library.searchBooks("Python")
    ).toEqual([]);
  });

  test("searchBooks throws for empty keyword", () => {
    expect(() => {
      library.searchBooks("");
    }).toThrow(
      "Search keyword must be a non-empty string."
    );
  });

  test("getAllBooks returns all books", () => {
    library.addBook(book);
    library.addBook(digitalBook);

    expect(
      library.getAllBooks()
    ).toHaveLength(2);
  });

  test("getAvailableBooks returns available books", () => {
    library.addBook(book);

    expect(
      library.getAvailableBooks()
    ).toEqual([book]);
  });

    // ============================================
  // Member Management
  // ============================================

  test("addMember adds a member", () => {
    expect(library.addMember(member)).toBe(true);
    expect(library.members.length).toBe(1);
  });

  test("addMember adds a premium member", () => {
    expect(library.addMember(premiumMember)).toBe(true);
    expect(library.members.length).toBe(1);
  });

  test("addMember rejects duplicate member IDs", () => {
    library.addMember(member);

    expect(library.addMember(member)).toBe(false);
  });

  test("addMember throws for invalid object", () => {
    expect(() => {
      library.addMember({});
    }).toThrow(
      "Member must be an instance of Member or PremiumMember."
    );
  });

  test("findMember returns the correct member", () => {
    library.addMember(member);

    expect(library.findMember("M001")).toBe(member);
  });

  test("findMember returns null when member does not exist", () => {
    expect(library.findMember("UNKNOWN")).toBeNull();
  });

  test("findMember is case insensitive", () => {
    library.addMember(member);

    expect(
      library.findMember("m001")
    ).toBe(member);
  });

  test("findMember throws for invalid member ID", () => {
    expect(() => {
      library.findMember("");
    }).toThrow(
      "Member ID must be a non-empty string."
    );
  });

  test("removeMember removes an existing member", () => {
    library.addMember(member);

    expect(
      library.removeMember(member.memberId)
    ).toBe(true);

    expect(library.members).toHaveLength(0);
  });

  test("removeMember returns false when member does not exist", () => {
    expect(
      library.removeMember("UNKNOWN")
    ).toBe(false);
  });

  test("removeMember throws for invalid member ID", () => {
    expect(() => {
      library.removeMember("");
    }).toThrow(
      "Member ID must be a non-empty string."
    );
  });

  test("removeMember cannot remove member with borrowed books", () => {
    library.addBook(book);
    library.addMember(member);

    library.borrowBook(member.memberId, book.isbn);

    expect(
      library.removeMember(member.memberId)
    ).toBe(false);
  });

  test("searchMembers finds by member ID", () => {
    library.addMember(member);

    expect(
      library.searchMembers("M001")
    ).toEqual([member]);
  });

  test("searchMembers finds by first name", () => {
    library.addMember(member);

    expect(
      library.searchMembers("John")
    ).toEqual([member]);
  });

  test("searchMembers finds by last name", () => {
    library.addMember(member);

    expect(
      library.searchMembers("Doe")
    ).toEqual([member]);
  });

  test("searchMembers finds by full name", () => {
    library.addMember(member);

    expect(
      library.searchMembers("John Doe")
    ).toEqual([member]);
  });

  test("searchMembers finds by email", () => {
    library.addMember(member);

    expect(
      library.searchMembers("john@test.com")
    ).toEqual([member]);
  });

  test("searchMembers finds by phone", () => {
    library.addMember(member);

    expect(
      library.searchMembers("0123456789")
    ).toEqual([member]);
  });

  test("searchMembers returns empty array when no member matches", () => {
    library.addMember(member);

    expect(
      library.searchMembers("Nobody")
    ).toEqual([]);
  });

  test("searchMembers throws for empty keyword", () => {
    expect(() => {
      library.searchMembers("");
    }).toThrow(
      "Search keyword must be a non-empty string."
    );
  });

  test("getAllMembers returns every member", () => {
    library.addMember(member);
    library.addMember(premiumMember);

    expect(
      library.getAllMembers()
    ).toHaveLength(2);
  });

    // ============================================
  // Borrowing & Returning
  // ============================================

  test("borrowBook succeeds for valid member and book", () => {
    library.addBook(book);
    library.addMember(member);

    expect(
      library.borrowBook(member.memberId, book.isbn)
    ).toBe(true);

    expect(member.borrowedBooks).toHaveLength(1);
    expect(book.borrowedBy).toHaveLength(1);

    expect(member.borrowedBooks[0].isbn).toBe(
      book.isbn.toUpperCase()
    );

    expect(member.borrowedBooks[0]).toHaveProperty("borrowDate");
    expect(member.borrowedBooks[0]).toHaveProperty("dueDate");
  });

  test("borrowBook returns false when member does not exist", () => {
    library.addBook(book);

    expect(
      library.borrowBook("UNKNOWN", book.isbn)
    ).toBe(false);
  });

  test("borrowBook returns false when book does not exist", () => {
    library.addMember(member);

    expect(
      library.borrowBook(member.memberId, "UNKNOWN")
    ).toBe(false);
  });

  test("borrowBook throws for invalid member ID", () => {
    expect(() => {
      library.borrowBook("", book.isbn);
    }).toThrow(
      "Member ID must be a non-empty string."
    );
  });

  test("borrowBook throws for invalid ISBN", () => {
    expect(() => {
      library.borrowBook(member.memberId, "");
    }).toThrow(
      "ISBN must be a non-empty string."
    );
  });

  test("cannot borrow same book twice", () => {
    library.addBook(book);
    library.addMember(member);

    library.borrowBook(member.memberId, book.isbn);

    expect(
      library.borrowBook(member.memberId, book.isbn)
    ).toBe(false);
  });

  // ===== FIXED TEST =====
  test("borrowBook returns false when book is unavailable", () => {
    const singleCopyBook = new Book(
      "1111111111111",
      "Algorithms",
      "Robert Martin",
      2024,
      1,
      "Programming"
    );

    const member2 = new Member(
      "M002",
      "Alice",
      "Brown",
      "alice@test.com",
      "0111111111"
    );

    library.addBook(singleCopyBook);
    library.addMember(member);
    library.addMember(member2);

    expect(
      library.borrowBook(member.memberId, singleCopyBook.isbn)
    ).toBe(true);

    expect(
      library.borrowBook(member2.memberId, singleCopyBook.isbn)
    ).toBe(false);
  });

  test("borrowBook returns false when member reached borrowing limit", () => {
    member.setBorrowingLimit(1);

    const secondBook = new Book(
      "2222222222222",
      "React",
      "Dan Abramov",
      2023,
      1,
      "Programming"
    );

    library.addBook(book);
    library.addBook(secondBook);

    library.addMember(member);

    library.borrowBook(member.memberId, book.isbn);

    expect(
      library.borrowBook(member.memberId, secondBook.isbn)
    ).toBe(false);
  });

  test("returnBook succeeds", () => {
    library.addBook(book);
    library.addMember(member);

    library.borrowBook(member.memberId, book.isbn);

    expect(
      library.returnBook(member.memberId, book.isbn)
    ).toBe(true);

    expect(member.borrowedBooks).toHaveLength(0);
    expect(book.borrowedBy).toHaveLength(0);
  });

  test("returnBook returns false when member does not exist", () => {
    library.addBook(book);

    expect(
      library.returnBook("UNKNOWN", book.isbn)
    ).toBe(false);
  });

  test("returnBook returns false when book does not exist", () => {
    library.addMember(member);

    expect(
      library.returnBook(member.memberId, "UNKNOWN")
    ).toBe(false);
  });

  test("returnBook returns false if member never borrowed book", () => {
    library.addBook(book);
    library.addMember(member);

    expect(
      library.returnBook(member.memberId, book.isbn)
    ).toBe(false);
  });

  test("returnBook throws for invalid member ID", () => {
    expect(() => {
      library.returnBook("", book.isbn);
    }).toThrow(
      "Member ID must be a non-empty string."
    );
  });

  test("returnBook throws for invalid ISBN", () => {
    expect(() => {
      library.returnBook(member.memberId, "");
    }).toThrow(
      "ISBN must be a non-empty string."
    );
  });

  test("borrow then return keeps library consistent", () => {
    library.addBook(book);
    library.addMember(member);

    library.borrowBook(member.memberId, book.isbn);
    library.returnBook(member.memberId, book.isbn);

    expect(book.borrowedBy).toHaveLength(0);
    expect(member.borrowedBooks).toHaveLength(0);
  });

    // ============================================
  // Statistics
  // ============================================

  test("getStatistics returns correct values", () => {
    library.addBook(book);
    library.addBook(digitalBook);

    library.addMember(member);
    library.addMember(premiumMember);

    const stats = library.getStatistics();

    expect(stats.totalBooks).toBe(2);
    expect(stats.availableBooks).toBe(2);
    expect(stats.borrowedBooks).toBe(0);
    expect(stats.digitalBooks).toBe(1);
    expect(stats.physicalBooks).toBe(1);
    expect(stats.totalMembers).toBe(2);
    expect(stats.premiumMembers).toBe(1);
    expect(stats.standardMembers).toBe(1);
  });

  // ===== FIXED TEST =====
  test("statistics updates after borrowing", () => {
    const singleCopyBook = new Book(
      "3333333333333",
      "Clean Architecture",
      "Robert Martin",
      2022,
      1,
      "Programming"
    );

    library.addBook(singleCopyBook);
    library.addMember(member);

    library.borrowBook(member.memberId, singleCopyBook.isbn);

    const stats = library.getStatistics();

    expect(stats.borrowedBooks).toBe(1);
    expect(stats.availableBooks).toBe(0);
    expect(stats.totalBooks).toBe(1);
  });

  // ============================================
  // Utility Methods
  // ============================================

  test("hasBook returns true when book exists", () => {
    library.addBook(book);

    expect(
      library.hasBook(book.isbn)
    ).toBe(true);
  });

  test("hasBook returns false when book does not exist", () => {
    expect(
      library.hasBook("UNKNOWN")
    ).toBe(false);
  });

  test("hasMember returns true when member exists", () => {
    library.addMember(member);

    expect(
      library.hasMember(member.memberId)
    ).toBe(true);
  });

  test("hasMember returns false when member does not exist", () => {
    expect(
      library.hasMember("UNKNOWN")
    ).toBe(false);
  });

  test("clearLibrary removes every book and member", () => {
    library.addBook(book);
    library.addBook(digitalBook);

    library.addMember(member);
    library.addMember(premiumMember);

    library.clearLibrary();

    expect(library.books).toHaveLength(0);
    expect(library.members).toHaveLength(0);
  });

  test("clearLibrary preserves array references", () => {
    const booksReference = library.books;
    const membersReference = library.members;

    library.addBook(book);
    library.addMember(member);

    library.clearLibrary();

    expect(library.books).toBe(booksReference);
    expect(library.members).toBe(membersReference);
    expect(library.books).toEqual([]);
    expect(library.members).toEqual([]);
  });

  test("getAllBooks returns a defensive copy", () => {
    library.addBook(book);

    const books = library.getAllBooks();

    books.push(book);

    expect(library.books).toHaveLength(1);
  });

  test("getAllMembers returns a defensive copy", () => {
    library.addMember(member);

    const members = library.getAllMembers();

    members.push(member);

    expect(library.members).toHaveLength(1);
  });
});