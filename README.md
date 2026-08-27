# Quartz ERP — Frontend

A React single-page app for a small-business ERP/invoicing system: sales & purchase invoicing (with returns), a customer/merchant ledger, inventory, expenses, a unified transactions ledger, dashboard analytics, and printable/PDF statements. Dates throughout the app use the Nepali (Bikram Sambat) calendar.

This is the client for [`erp-backend`](https://github.com/aayushhsapkota/erp-backend), the REST API it talks to.

## Demo Login

Want to try the Quartz ERP application?

Use the following demo administrator account:

| Field | Demo Credentials |
| --- | --- |
| **Email** | `admin@gmail.com` |
| **Password** | `nepal123#` |
| **Role** | Administrator |

> **Note:** These credentials are provided for demonstration and testing purposes only. Please do not use them for real or sensitive data.

## Tech stack

- **React 18** + **Vite** (dev server / bundler)
- **Redux Toolkit** + **react-redux** for state
- **React Router v6**
- **Tailwind CSS**
- **Axios** for API calls, JWT bearer auth
- **react-to-print**, **jspdf**, **html2canvas**, **dom-to-image** for PDF/print statements
- **nepali-date-converter** for BS date handling
- **framer-motion** for UI motion

## Prerequisites

- Node.js 16+ and npm
- A running instance of the [`erp-backend`](https://github.com/aayushhsapkota/erp-backend) API (local or deployed)

## Getting started

```bash
npm install
npm run dev
```

The dev server runs at `http://localhost:3000` (configured in [vite.config.js](vite.config.js)).

Other scripts:

| Script | Purpose |
| --- | --- |
| `npm run dev` / `npm start` | Start the Vite dev server |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Serve the production build locally |

## Configuring the API endpoint

Unlike most Vite apps, the backend URL isn't read from an env file — it's set directly in [`src/stateManagement/API/index.js`](src/stateManagement/API/index.js), and both the dev and production branches currently point at the deployed backend (`https://erp-backend-j9kg.onrender.com/API/`). 

Auth is JWT-based: on sign-in, the token is stored in `localStorage` under `erp-token` and attached to every request as a `Bearer` header by an Axios interceptor.

## Project structure

```
src/
├── main.jsx                 # App entry point
├── App.jsx                  # Route table, auth gating, global modals
├── components/              # Reusable UI, grouped by domain
│   ├── Clients/              # Customer & merchant lists, modals
│   ├── Product/               # Inventory UI
│   ├── Invoice/               # Sales/purchase invoice UI
│   ├── Expense/               # Expense tracking UI
│   ├── Dashboard/             # Analytics widgets/charts
│   ├── Filtering/             # Shared search/filter/sort panels
│   ├── Navbar/                # Sidebar & top nav
│   └── Common/                 # Shared primitives (date pickers, buttons, etc.)
├── pages/                   # Route-level screens (lazy-loaded)
│   ├── Dashboard/, clients/, merchants/, products/, invoices/,
│   ├── purchase/, saleReturn/, purchaseReturn/, expenses/,
│   ├── reportStatement/       # Customer/merchant statement & PDF export
│   ├── import/                 # Bulk import from spreadsheet
│   ├── settings/, about/, Login/
├── stateManagement/
│   ├── API/                    # Axios instance + one API module per domain
│   └── slice/                   # Redux Toolkit slices (one per domain)
├── constants/                # Shared style/config constants
└── toastify.js               # Toast notification helpers
```

## Roles

The JWT payload carries an `isAdmin` flag (see `erp-backend`'s auth). Admin-only routes (Dashboard, Import, Business Profile settings) are hidden from non-admin users, who land on `/invoices/new` by default.

## Notes

- All dates are entered/displayed in the Bikram Sambat (Nepali) calendar via `nepali-date-converter`; the backend's date-range logic assumes the server clock is set to `Asia/Kathmandu`, so keep frontend/backend clocks in sync when testing date filters.
- `.gitignore` already excludes `node_modules`/`dist`; there is no `.env` file for this app (see API configuration above).

[software.pdf](https://github.com/user-attachments/files/17916034/software.pdf)
Please have a look at the attached pdf to view UI screens and understand navigation flow.
