# Full-Stack E-Commerce Catalog

A full-stack e-commerce web application built with Next.js, demonstrating Server-Side Rendering (SSR), robust authentication, and secure database management. 

🎥 **[Watch the Project Demonstration Video](https://drive.google.com/file/d/1esPX7i4tieMUjHFwQ7bcgWHgERLc8jlV/view?usp=sharing)**

## 🚀 Tech Stack

* **Framework:** Next.js (Pages Router)
* **Styling:** Tailwind CSS
* **Database:** PostgreSQL (Dockerized)
* **ORM:** Prisma
* **Authentication:** NextAuth.js (GitHub Provider)
* **Validation:** Zod
* **Containerization:** Docker & Docker Compose

## ✨ Key Features

* **Server-Side Rendering (SSR):** Product catalog and detail pages are pre-rendered on the server for optimal performance and SEO.
* **Dynamic Pagination:** Efficient database-level pagination displaying 12 items per page with functional "Next/Previous" controls.
* **Search Functionality:** Case-insensitive search that filters products by both name and description simultaneously.
* **Secure Authentication:** User login handled securely via NextAuth.js using GitHub OAuth.
* **Protected Routes:** Next.js Edge Middleware protects the `/cart` route, automatically redirecting unauthenticated users to the login screen.
* **Shopping Cart API:** Custom REST API for managing cart items, featuring strict payload validation using Zod to ensure data integrity before database insertion.
* **Relational Database:** A fully structured PostgreSQL database managed via Prisma, featuring relational mapping between Users, Products, and Cart Items.

## 🛠️ Getting Started

### Prerequisites
* Node.js (v18+)
* Docker Desktop (running)
* A GitHub OAuth App (for NextAuth credentials)

### Installation

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git](https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git)
   cd YOUR-REPO-NAME

```

2. **Install dependencies:**
```bash
npm install

```


3. **Set up Environment Variables:**
* Rename `.env.example` to `.env`.
* Fill in your GitHub Client ID, Client Secret, NextAuth URL, and Secret.
* Ensure your `DATABASE_URL` is set to connect to the Docker container.


4. **Start the Database (Docker):**
```bash
docker-compose up -d

```


5. **Initialize the Database:**
```bash
npx prisma generate
npx prisma db push
npx prisma db seed

```


6. **Run the Development Server:**
```bash
npm run dev

```


7. **Open the App:**
Navigate to http://localhost:3000 in your browser.

## 🛑 Stopping the Application

To shut down the Next.js server, press `Ctrl + C` in your terminal. To stop the database container, run:

```bash
docker-compose down

```

```

Once you have saved that file, you can run these final commands in your VS Code terminal to send the update to GitHub:

```bash
git add README.md
git commit -m "Update README with demonstration video link"
git push

```

