/**
 * PremiumMember.js
 * Represents a premium library member.
 * Extends the Member class with premium-specific benefits.
 */

import Member from "./Member.js";

export default class PremiumMember extends Member {
  /**
   * Available premium membership levels.
   *
   * @returns {string[]}
   */
  static get VALID_MEMBERSHIPS() {
    return ["Gold", "Platinum"];
  }

  /**
   * Creates a new PremiumMember.
   *
   * @param {string} memberId - Unique member ID.
   * @param {string} firstName - Member's first name.
   * @param {string} lastName - Member's last name.
   * @param {string} email - Member's email address.
   * @param {string} phone - Member's phone number.
   * @param {Date} joinDate - Date the member joined.
   * @param {string} membershipType - Premium membership level.
   */
  constructor(
    memberId,
    firstName,
    lastName,
    email,
    phone,
    joinDate = new Date(),
    membershipType = "Gold"
  ) {
    super(
      memberId,
      firstName,
      lastName,
      email,
      phone,
      joinDate
    );

    this.validateMembershipType(membershipType);

    this.membershipType = membershipType.trim();

    // Premium members have a higher borrowing limit.
    this.setBorrowingLimit(10);

    // Premium members receive priority support.
    this.prioritySupport = true;
  }

  /**
   * Validates membership type.
   *
   * @param {string} membershipType
   */
  validateMembershipType(membershipType) {
    if (
      typeof membershipType !== "string" ||
      !PremiumMember.VALID_MEMBERSHIPS.includes(
        membershipType.trim()
      )
    ) {
      throw new Error(
        `Membership type must be one of: ${PremiumMember.VALID_MEMBERSHIPS.join(", ")}.`
      );
    }
  }

  /**
   * Upgrades or changes the membership type.
   *
   * @param {string} membershipType
   */
  upgradeMembership(membershipType) {
    this.validateMembershipType(membershipType);

    this.membershipType = membershipType.trim();
  }

  /**
   * Returns the premium member benefits.
   *
   * @returns {string[]}
   */
  getBenefits() {
    return [
      "Borrow up to 10 books",
      "Priority support",
      "Extended borrowing privileges"
    ];
  }

  /**
   * Returns all premium member details.
   *
   * @returns {Object}
   */
  getDetails() {
    return {
      ...super.getDetails(),
      membershipType: this.membershipType,
      prioritySupport: this.prioritySupport,
      benefits: [...this.getBenefits()],
      memberLevel: "Premium"
    };
  }

  /**
   * Returns formatted premium member information.
   *
   * @returns {string}
   */
  getMemberInfo() {
    return `${super.getMemberInfo()}

Membership Type: ${this.membershipType}
Member Level: Premium
Maximum Books: ${this.maxBooks}
Priority Support: ${this.prioritySupport ? "Yes" : "No"}

Benefits:
- ${this.getBenefits().join("\n- ")}`;
  }

  /**
   * Returns a readable string representation.
   *
   * @returns {string}
   */
  toString() {
    return `${this.fullName} (${this.memberId}) - ${this.membershipType} Premium Member`;
  }

  /**
   * Indicates that this member
   * is a premium member.
   *
   * @returns {boolean}
   */
  isPremium() {
    return true;
  }
}