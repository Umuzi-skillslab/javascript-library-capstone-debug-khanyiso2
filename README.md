# Digital Library Management System

## Overview

The Digital Library Management System is a JavaScript application developed to manage a public library's digital catalogue. The system allows users to manage books and members, borrow books, search the catalogue, view statistics, and save library data using browser localStorage.

This project focused on debugging an incomplete codebase, implementing missing functionality, modernising the application using ES6+ JavaScript, and improving code quality through testing and refactoring.

## Critical Errors Found

During development, numerous issues were identified and corrected, including:

* Undeclared variables and incorrect variable declarations.
* Incorrect use of assignment operators in conditional statements.
* Missing `super()` calls in inherited classes.
* Incomplete class implementations.
* Missing book availability properties.
* Broken DigitalBook functionality.
* Invalid DOM selectors.
* Missing event listeners.
* Broken localStorage save/load functionality.
* Missing JSON serialization and parsing.
* Missing parameter validation.
* Inadequate error handling.
* Broken inheritance behaviour.
* Missing accessibility improvements.
* Incorrect image references.
* Incomplete unit tests.

## Fixes Implemented

The following improvements were made:

* Fixed all JavaScript syntax and logic errors.
* Completed the `Book`, `DigitalBook`, `Member`, and `PremiumMember` classes.
* Corrected inheritance and constructor implementations.
* Added validation for user input and constructor parameters.
* Implemented robust error handling using try-catch blocks.
* Fixed storage persistence using `JSON.stringify()` and `JSON.parse()`.
* Improved DOM manipulation and event handling.
* Added responsive styling and accessibility enhancements.
* Corrected broken image references.
* Refactored code for readability and maintainability.

## Modern JavaScript Features

The project uses modern JavaScript features including:

* ES6 modules
* Classes and inheritance
* Template literals
* Destructuring
* Spread and rest operators
* Arrow functions
* Array methods (`map`, `filter`, `reduce`, `find`, `some`, `every`)
* `const` and `let`
* Exception handling with `try...catch`

## Key Methods

### Book
- `checkOut(memberId)` – Borrows a physical book.
- `returnBook(memberId)` – Returns a borrowed book.
- `isAvailable()` – Checks if copies are available.

### DigitalBook
- `download()` – Records a digital download.
- `checkOut(memberId)` – Allows digital borrowing without reducing stock.

### LibraryManager
- `addBook(book)` – Adds a new book.
- `addMember(member)` – Registers a member.
- `borrowBook(memberId, isbn)` – Borrows a book.
- `returnBook(memberId, isbn)` – Returns a borrowed book.

### Storage
- `saveLibrary()` – Saves data to localStorage.
- `loadLibrary()` – Restores saved data.
- `exportLibrary()` – Exports data as JSON.
- `importLibrary()` – Imports library data.

## Project Architecture

The application is organised into separate modules for:

* Models (Book, DigitalBook, Member, PremiumMember)
* Services (LibraryManager, Storage)
* UI rendering
* Application initialization

This modular design improves maintainability and code organisation.

## Installation

Clone the repository:

```bash
git clone https://github.com/Umuzi-skillslab/javascript-library-capstone-debug-khanyiso2.git```

Install dependencies:

```bash
npm install
```

## Running the Application

Open `index.html` using Live Server or another local web server.

## Running the Tests

Run all unit tests:

```bash
npm test
```

Run the coverage report:

```bash
npm test -- --coverage
```

## Test Results

* Test Suites: **6 passed**
* Tests: **106 passed**
* Failures: **0**


## Screenshots

The project includes screenshots demonstrating:

- Application running successfully
- Search functionality
- Statistics dashboard
- All Jest tests passing
- Code coverage report

Screenshots are located in:

assets/screenshots/


## Reflection

The most challenging part of the project was debugging the interaction between the `DigitalBook` class and the storage service. Constructor parameter mismatches prevented objects from being restored correctly after loading saved data. Resolving this required careful analysis of object serialization, inheritance, and unit tests.

The project strengthened my understanding of object-oriented programming, modern JavaScript features, debugging techniques, DOM manipulation, and automated testing while reinforcing the importance of writing clean, maintainable code.
