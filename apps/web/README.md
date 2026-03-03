# Angular Zoneless Demo

This project is a simple CRUD application designed to demonstrate the process of converting a traditional Angular application using NgRx and zone.js to a zoneless architecture utilizing Angular Signal Store.

## Purpose

- **Migration Example:** Showcases how to migrate from a zone.js-based NgRx state management approach to a modern, zoneless Angular Signal Store pattern.
- **Educational:** Serves as a reference for developers interested in adopting zoneless Angular best practices and leveraging the new Signal Store API.

## Features

- Basic CRUD operations for a banking domain (accounts, transactions, etc.)
- Modular structure with clear separation of concerns
- Example of state management using both NgRx (legacy) and Signal Store (modern)
- Unit tests and linting included

## Project Structure

- `src/app/core/` — Core interfaces, and data services
- `src/app/banking/` — Feature module for banking operations
- `src/app/bankingcore/store/` — State management stores (Signal Store)
- `src/app/shared/` — Shared components and validators


## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Run the application:**
   ```bash
   npm start
   ```
3. **Run tests:**
   ```bash
   npm test
   ```
4. **Lint the code:**
   ```bash
   npm run lint
   ```

## Notes

- This project is for demonstration and educational purposes.
- The migration process is incremental; both NgRx and Signal Store patterns may coexist during the transition.

## License

MIT License
