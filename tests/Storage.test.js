import Storage from "../services/Storage.js";
import LibraryManager from "../services/LibraryManager.js";
import Book from "../models/Book.js";
import DigitalBook from "../models/DigitalBook.js";
import Member from "../models/Member.js";
import PremiumMember from "../models/PremiumMember.js";

describe("Storage Class", () => {
  let storage;
  let library;
  let book;
  let digitalBook;
  let member;
  let premiumMember;

  beforeEach(() => {
    localStorage.clear();

    storage = new Storage();
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
      "Node.js",
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

  test("constructor creates storage instance", () => {
    expect(storage).toBeInstanceOf(Storage);
  });

  test("uses the correct storage key", () => {
    expect(storage.storageKey).toBe(
      "library-management-system"
    );
  });

  test("saveLibrary saves successfully", () => {
    library.addBook(book);
    library.addMember(member);

    expect(storage.saveLibrary(library)).toBe(true);
    expect(localStorage.getItem(storage.storageKey)).not.toBeNull();
  });

  test("saveLibrary throws for invalid library", () => {
    expect(() => storage.saveLibrary({})).toThrow();
  });

  test("loadLibrary returns empty library when nothing is saved", () => {
    const loaded = storage.loadLibrary();

    expect(loaded).toBeInstanceOf(LibraryManager);
    expect(loaded.getAllBooks()).toHaveLength(0);
    expect(loaded.getAllMembers()).toHaveLength(0);
  });

  test("loadLibrary restores physical books", () => {
    library.addBook(book);

    storage.saveLibrary(library);

    const loaded = storage.loadLibrary();

    expect(loaded.getAllBooks()).toHaveLength(1);
    expect(loaded.getAllBooks()[0]).toBeInstanceOf(Book);
  });

  test("loadLibrary restores digital books", () => {
    library.addBook(digitalBook);

    storage.saveLibrary(library);

    const loaded = storage.loadLibrary();

    expect(loaded.getAllBooks()[0]).toBeInstanceOf(DigitalBook);
  });

  test("loadLibrary restores standard members", () => {
    library.addMember(member);

    storage.saveLibrary(library);

    const loaded = storage.loadLibrary();

    expect(loaded.getAllMembers()[0]).toBeInstanceOf(Member);
  });

  test("loadLibrary restores premium members", () => {
    library.addMember(premiumMember);

    storage.saveLibrary(library);

    const loaded = storage.loadLibrary();

    expect(
      loaded.getAllMembers()[0]
    ).toBeInstanceOf(PremiumMember);
  });

  test("clearLibrary removes saved data", () => {
    library.addBook(book);

    storage.saveLibrary(library);

    expect(storage.clearLibrary()).toBe(true);
    expect(localStorage.getItem(storage.storageKey)).toBeNull();
  });

  test("hasSavedLibrary returns true when data exists", () => {
    library.addBook(book);

    storage.saveLibrary(library);

    expect(storage.hasSavedLibrary()).toBe(true);
  });

  test("hasSavedLibrary returns false when storage is empty", () => {
    expect(storage.hasSavedLibrary()).toBe(false);
  });

  test("exportLibrary returns valid JSON", () => {
    library.addBook(book);
    library.addMember(member);

    const json = storage.exportLibrary(library);

    expect(typeof json).toBe("string");

    const parsed = JSON.parse(json);

    expect(parsed.books).toHaveLength(1);
    expect(parsed.members).toHaveLength(1);
  });

  test("exportLibrary throws for invalid library", () => {
    expect(() => storage.exportLibrary({})).toThrow();
  });

  test("importLibrary imports valid JSON", () => {
    library.addBook(book);
    library.addMember(member);

    const json = storage.exportLibrary(library);

    const loaded = storage.importLibrary(json);

    expect(loaded).toBeInstanceOf(LibraryManager);
    expect(loaded.getAllBooks()).toHaveLength(1);
    expect(loaded.getAllMembers()).toHaveLength(1);
  });

  test("importLibrary throws for empty string", () => {
    expect(() => {
      storage.importLibrary("");
    }).toThrow();
  });

  test("importLibrary throws for invalid JSON", () => {
    expect(() => {
      storage.importLibrary("{invalid}");
    }).toThrow();
  });

  test("loadLibrary restores borrowed books", () => {
    library.addBook(book);
    library.addMember(member);

    library.borrowBook(member.memberId, book.isbn);

    storage.saveLibrary(library);

    const loaded = storage.loadLibrary();

    expect(
      loaded.getAllMembers()[0].borrowedBooks.length
    ).toBe(1);

    expect(
      loaded.getAllBooks()[0].borrowedBy.length
    ).toBe(1);
  });

  test("loadLibrary restores download count for digital books", () => {
    digitalBook.download();
    digitalBook.download();

    library.addBook(digitalBook);

    storage.saveLibrary(library);

    const loaded = storage.loadLibrary();

    expect(
      loaded.getAllBooks()[0].downloadCount
    ).toBe(2);
  });

  test("loadLibrary handles invalid stored JSON gracefully", () => {
    localStorage.setItem(
      storage.storageKey,
      "{invalid json}"
    );

    const loaded = storage.loadLibrary();

    expect(loaded).toBeInstanceOf(LibraryManager);
    expect(loaded.getAllBooks()).toHaveLength(0);
    expect(loaded.getAllMembers()).toHaveLength(0);
  });
});