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
    expect(member.borrowedBooks).toHaveLength(1);
    expect(member.borrowedBooks[0].isbn).toBe("ISBN001");
    expect(member.borrowedBooks[0]).toHaveProperty("borrowDate");
    expect(member.borrowedBooks[0]).toHaveProperty("dueDate");
  });

  test("borrowBook prevents duplicate books", () => {
    member.borrowBook("ISBN001");

    expect(member.borrowBook("ISBN001")).toBe(false);
    expect(member.borrowedBooks).toHaveLength(1);
  });

  test("returnBook removes a borrowed book", () => {
    member.borrowBook("ISBN001");

    const returned = member.returnBook("ISBN001");

    expect(returned).toBe(true);
    expect(member.borrowedBooks).toHaveLength(0);
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

    test("throws error for invalid first name", () => {
    expect(() => {
      new Member(
        "M001",
        "",
        "Smith",
        "john@email.com",
        "0123456789"
      );
    }).toThrow("First name must be a non-empty string.");
  });

  test("throws error for invalid last name", () => {
    expect(() => {
      new Member(
        "M001",
        "John",
        "",
        "john@email.com",
        "0123456789"
      );
    }).toThrow("Last name must be a non-empty string.");
  });

  test("throws error for invalid constructor email", () => {
    expect(() => {
      new Member(
        "M001",
        "John",
        "Smith",
        "invalid-email",
        "0123456789"
      );
    }).toThrow("A valid email address is required.");
  });

  test("throws error for invalid constructor phone", () => {
    expect(() => {
      new Member(
        "M001",
        "John",
        "Smith",
        "john@email.com",
        ""
      );
    }).toThrow("Phone number must be a non-empty string.");
  });

  test("throws error for invalid join date", () => {
    expect(() => {
      new Member(
        "M001",
        "John",
        "Smith",
        "john@email.com",
        "0123456789",
        "today"
      );
    }).toThrow("Join date must be a valid Date object.");
  });

  test("getBorrowedBook returns borrowed record", () => {
    member.borrowBook("ISBN1");

    const record = member.getBorrowedBook("ISBN1");

    expect(record).not.toBeNull();
    expect(record.isbn).toBe("ISBN1");
  });

  test("getBorrowedBook returns null when not found", () => {
    expect(member.getBorrowedBook("UNKNOWN")).toBeNull();
  });

  test("isBookOverdue returns false when not overdue", () => {
    member.borrowBook("ISBN1");

    expect(member.isBookOverdue("ISBN1")).toBe(false);
  });

  test("isBookOverdue returns false when record does not exist", () => {
    expect(member.isBookOverdue("ISBN1")).toBe(false);
  });

  test("getRemainingDays returns number for borrowed book", () => {
    member.borrowBook("ISBN1");

    expect(member.getRemainingDays("ISBN1")).toBeGreaterThan(0);
  });

  test("getRemainingDays returns null when no record exists", () => {
    expect(member.getRemainingDays("ISBN1")).toBeNull();
  });

  test("getMembershipDurationText returns singular year", () => {
    const joinDate = new Date();
    joinDate.setFullYear(joinDate.getFullYear() - 1);

    const m = new Member(
      "M001",
      "John",
      "Smith",
      "john@email.com",
      "0123456789",
      joinDate
    );

    expect(m.getMembershipDurationText()).toContain("year");
  });
});