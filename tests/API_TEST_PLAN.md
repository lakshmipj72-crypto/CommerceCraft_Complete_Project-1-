# CommerceCraft API Test Plan

## Health
GET /api/health
Expected: HTTP 200 and `{ "status": "ok" }`

## Products
GET /api/products
Expected: HTTP 200 and an array.

GET /api/products/1
Expected: HTTP 200 and one product.

POST /api/products
Expected: HTTP 201 when name, price and category are provided.

PUT /api/products/1
Expected: HTTP 200 and updated product.

DELETE /api/products/1
Expected: HTTP 200 when the product exists.

## Orders
POST /api/orders
Expected: HTTP 201 with a generated order ID when customer and items are provided.

GET /api/orders
Expected: HTTP 200 and an array.

## Negative tests
- Missing product name → HTTP 400.
- Unknown product ID → HTTP 404.
- Missing checkout customer/items → HTTP 400.
