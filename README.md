# CommerceCraft

CommerceCraft is a modular e-commerce website implementation based on the supplied project brief.

## Included
- Responsive storefront
- Product catalog and search
- Category filtering
- Shopping cart with local persistence
- Checkout/order creation
- Product management API and admin form
- Order API
- Health endpoint
- Modular frontend/backend separation
- JSON data store for easy local demonstration

## Project structure

```text
CommerceCraft/
├── server.js
├── package.json
├── data/
│   └── store.json
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── app.js
├── tests/
└── README.md
```

## Run locally

1. Install Node.js.
2. Open a terminal in this folder.
3. Run:
   `npm install`
4. Start:
   `npm start`
5. Open:
   `http://localhost:5000`

## API endpoints

- GET `/api/products`
- GET `/api/products/:id`
- POST `/api/products`
- PUT `/api/products/:id`
- DELETE `/api/products/:id`
- POST `/api/orders`
- GET `/api/orders`
- GET `/api/categories`
- GET `/api/health`

## Deployment

For Render:
- Build command: `npm install`
- Start command: `npm start`
- Environment: Node

For production, replace the JSON data layer with MongoDB/PostgreSQL, add authentication/authorization, HTTPS, validation, rate limiting, secure payment processing, logging, automated tests and environment secrets.

## Testing checklist

- Product list loads
- Search filters products
- Categories filter correctly
- Add/remove/change cart quantity
- Checkout creates an order
- Product admin form creates a product
- API health endpoint returns status `ok`
- Mobile layout works

## Requirements mapping

Research/analysis → documented architecture and modular feature set.
Requirements → storefront, catalog, cart, orders and admin modules.
Architecture → separate frontend, backend API and data layer.
Development → reusable API and UI modules.
Testing → checklist and clear endpoints for unit/integration/e2e testing.
Documentation → this README and API reference.
Deployment → local and Render deployment instructions.
Maintenance → modular code and documented production hardening steps.
