## Learnly

- Use Node.js 24, npm, and a development MongoDB database. In the backend checkout set `MONGO_URI`, `JWT_SECRET`, and `PASS_SEC` in `.env`. Use unique secrets. Keep the same `PASS_SEC` for existing accounts, which use the original reversible password format. The API defaults to port 5000. Run `npm ci` then `npm start`.
- In the frontend checkout run `npm ci` then `npm run dev`. Set `VITE_API_URL` for a remote API. It defaults to `http://localhost:5000`. Run `npm run build` to generate the static bundle.
- Catalog items must exist in the database. The API's product creation endpoint requires an admin token. Use an isolated development database for seed data and sample orders.
- Verified with isolated MongoDB: registration, login, profile access, invalid token rejection, catalog list/detail, unauthorized checkout rejection, server-calculated order total, and order ownership. The old hosted Render endpoint returned HTTP 503. Browser checkout and hosted rollout are pending.
