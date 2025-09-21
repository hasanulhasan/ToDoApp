To do App Quick start
1. Copy files into a new project folder.
2. npm install
3. Create .env from .env.example and set values (MONGO_URI, JWT_SECRET)
4. npm run dev


Auth flow summary
- POST /api/auth/register { name, email, password } -> returns accessToken, refreshToken
- POST /api/auth/login { email, password } -> returns accessToken, refreshToken
- POST /api/auth/refresh { refreshToken } -> returns new accessToken and rotated refreshToken
- POST /api/auth/logout { refreshToken } -> removes refresh token (logout)


Todos (protected) - send Authorization: Bearer <accessToken>
- POST /api/todos create
- GET /api/todos list with filters: ?page=1&limit=10&status=todo&search=foo&sortBy=dueDate&sortDir=asc
- GET /api/todos/:id get single
- PUT /api/todos/:id update
- DELETE /api/todos/:id delete