import PremiumMember from "../models/PremiumMember.js";

describe("PremiumMember Class", () => {
  let member;

  beforeEach(() => {
    member = new PremiumMember(
      "P001",
      "Jane",
      "Doe",
      "jane@example.com",
      "0123456789",
      new Date("2023-01-01"),
      "Gold"
    );
  });

  test("creates a premium member", () => {
    expect(member.memberId).toBe("P001");
    expect(member.firstName).toBe("Jane");
    expect(member.lastName).toBe("Doe");
    expect(member.membershipType).toBe("Gold");
    expect(member.prioritySupport).toBe(true);
    expect(member.maxBooks).toBe(10);
  });

  test("inherits from Member", () => {
    expect(member.fullName).toBe("Jane Doe");
    expect(member.borrowedBooks).toEqual([]);
  });

  test("canBorrow returns true initially", () => {
    expect(member.canBorrow()).toBe(true);
  });

  test("premium member can borrow up to 10 books", () => {
    for (let i = 0; i < 10; i++) {
      member.borrowBook(`BOOK${i}`);
    }

    expect(member.canBorrow()).toBe(false);
    expect(member.borrowedBooks.length).toBe(10);
  });

  test("upgradeMembership changes membership type", () => {
    member.upgradeMembership("Platinum");

    expect(member.membershipType).toBe("Platinum");
  });

  test("getBenefits returns premium benefits", () => {
    const benefits = member.getBenefits();

    expect(Array.isArray(benefits)).toBe(true);
    expect(benefits.length).toBeGreaterThan(0);
    expect(benefits).toContain("Priority support");
  });

  test("getDetails returns premium information", () => {
    const details = member.getDetails();

    expect(details.memberLevel).toBe("Premium");
    expect(details.membershipType).toBe("Gold");
    expect(details.prioritySupport).toBe(true);
    expect(details.benefits.length).toBeGreaterThan(0);
  });

  test("toString returns formatted string", () => {
    expect(member.toString()).toContain("Premium Member");
    expect(member.toString()).toContain("Gold");
  });

  test("isPremium returns true", () => {
    expect(member.isPremium()).toBe(true);
  });

  test("validateMembershipType accepts Gold", () => {
    expect(() => {
      member.validateMembershipType("Gold");
    }).not.toThrow();
  });

  test("validateMembershipType accepts Platinum", () => {
    expect(() => {
      member.validateMembershipType("Platinum");
    }).not.toThrow();
  });

  test("throws error for invalid membership type", () => {
    expect(() => {
      new PremiumMember(
        "P002",
        "John",
        "Smith",
        "john@test.com",
        "0123456789",
        new Date(),
        "Silver"
      );
    }).toThrow();
  });

  test("upgradeMembership throws for invalid membership", () => {
    expect(() => {
      member.upgradeMembership("Silver");
    }).toThrow();
  });

  test("borrowing limit is always 10", () => {
    expect(member.maxBooks).toBe(10);
  });

  test("getInfo returns formatted premium information", () => {
    const info = member.getMemberInfo();

    expect(info).toContain("Premium");
    expect(info).toContain("Gold");
    expect(info).toContain("Priority Support");
  });
});