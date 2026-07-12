import Member from "../models/Member.js";

describe("Member Class", () => {
  let member;

  beforeEach(() => {
    member = new Member(
      "M001",
      "John",
      "Smith",
      "john@example.com",
      "0123456789",
      new Date("2022-01-01")
    );
  });

  test("creates a member with correct properties", () => {
    expect(member.memberId).toBe("M001");
    expect(member.firstName).toBe("John");
    expect(member.lastName).toBe("Smith");
    expect(member.email).toBe("john@example.com");
    expect(member.phone).toBe("0123456789");
    expect(member.borrowedBooks).toEqual([]);
    expect(member.maxBooks).toBe(5);
  });

  test("fullName returns the correct name", () => {
    expect(member.fullName).toBe("John Smith");
  });

  test("canBorrow returns true when below borrowing limit", () => {
    expect(member.canBorrow()).toBe(true);
  });

  test("borrowBook adds a book", () => {
    const borrowed = member.borrowBook("ISBN001");

    expect(borrowed).toBe(true);
    expect(member.borrowedBooks).toContain("ISBN001");
  });

  test("borrowBook prevents duplicate books", () => {
    member.borrowBook("ISBN001");

    expect(member.borrowBook("ISBN001")).toBe(false);
    expect(member.borrowedBooks.length).toBe(1);
  });

  test("returnBook removes a borrowed book", () => {
    member.borrowBook("ISBN001");

    const returned = member.returnBook("ISBN001");

    expect(returned).toBe(true);
    expect(member.borrowedBooks).not.toContain("ISBN001");
  });

  test("returnBook returns false for unknown ISBN", () => {
    expect(member.returnBook("UNKNOWN")).toBe(false);
  });

  test("cannot borrow more than maximum limit", () => {
    member.borrowBook("A");
    member.borrowBook("B");
    member.borrowBook("C");
    member.borrowBook("D");
    member.borrowBook("E");

    expect(member.canBorrow()).toBe(false);
    expect(member.borrowBook("F")).toBe(false);
  });

  test("updateEmail changes the email", () => {
    member.updateEmail("new@email.com");

    expect(member.email).toBe("new@email.com");
  });

  test("updatePhone changes the phone number", () => {
    member.updatePhone("0999999999");

    expect(member.phone).toBe("0999999999");
  });

  test("setBorrowingLimit updates maxBooks", () => {
    member.setBorrowingLimit(8);

    expect(member.maxBooks).toBe(8);
  });

  test("getDetails returns member object", () => {
    const details = member.getDetails();

    expect(details.memberId).toBe("M001");
    expect(details.fullName).toBe("John Smith");
    expect(details.memberType).toBe("Standard");
    expect(details.maxBooks).toBe(5);
  });

  test("getMemberInfo returns formatted string", () => {
    const info = member.getMemberInfo();

    expect(info).toContain("John Smith");
    expect(info).toContain("Member ID");
    expect(info).toContain("Borrowed Books");
  });

  test("toString returns readable string", () => {
    expect(member.toString()).toBe("John Smith (M001)");
  });

  test("membership duration returns a number", () => {
    expect(typeof member.getMembershipDuration()).toBe("number");
  });

  test("membership duration text returns a string", () => {
    expect(typeof member.getMembershipDurationText()).toBe("string");
  });

  test("throws error for invalid member ID", () => {
    expect(() => {
      new Member(
        "",
        "John",
        "Smith",
        "john@example.com",
        "0123456789"
      );
    }).toThrow();
  });

  test("throws error for invalid email", () => {
    expect(() => {
      member.updateEmail("not-an-email");
    }).toThrow();
  });

  test("throws error for invalid phone", () => {
    expect(() => {
      member.updatePhone("");
    }).toThrow();
  });

  test("throws error for invalid borrowing limit", () => {
    expect(() => {
      member.setBorrowingLimit(0);
    }).toThrow();
  });

  test("throws error when borrowing invalid ISBN", () => {
    expect(() => {
      member.borrowBook("");
    }).toThrow();
  });

  test("returnBook returns false for empty ISBN", () => {
    expect(member.returnBook("")).toBe(false);
  });
});