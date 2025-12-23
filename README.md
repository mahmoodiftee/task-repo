# Full-Stack Onsite Assessment

This is a **full-stack assessment** where you'll work on an existing product buy/rent marketplace application.

You will be asked to:

- **Fix bugs** in the existing codebase
- **Strengthen validation** and handle edge cases
- **Implement new features** with minimal guidance

It is advised that you gather as much context as possible of the codebase prior to the interview. We advise you to get the application up and running, test out the commands provided and be ready to work on features in your local machine before the interview.

---

## How to Run the App

### Database Setup

1. **Start the PostgreSQL database using Docker**:
   ```bash
   docker compose up db -d
   ```
   This will start a PostgreSQL database on port **5434** with:
   - Database name: `teebay`
   - Username: `teebay`
   - Password: `teebay`

2. **Run database migrations** (after setting up the server):
   ```bash
   cd server
   npx prisma migrate deploy
   ```

---


### Client Setup

1. **Go to the client directory**:
   ```
   cd client
   ```

2. **Install dependencies**:
   ```
   npm install
   ```

3. **Set up environment variables**:
   ```
   cp .env.example .env
   ```
   Update `.env` with your local configuration.

4. **Start the development server**:
   ```
   npm run dev
   ```

---

### Server Setup

1. **Go to the server directory**:
   ```
   cd server
   ```

2. **Install dependencies**:
   ```
   npm install
   ```

3. **Set up environment variables**:
   ```
   cp .env.example .env
   ```
   Update `.env` with your local configuration.

4. **Generate Prisma client**:
   ```
   npx prisma generate
   ```

5. **Run database migrations**:
   ```
   npx prisma migrate deploy
   ```

6. **Seed the database** (optional - adds sample data):
   ```
   npm run seed
   ```
   This will create sample users, products, and transactions for testing.

7. **Start the development server**:
   ```
   npm run dev
   ```