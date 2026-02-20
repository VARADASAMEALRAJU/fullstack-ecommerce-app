-- prisma/seed-data/init.sql

CREATE TABLE IF NOT EXISTS "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "Product" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email");

-- Insert Test User
INSERT INTO "User" ("id", "name", "email")
VALUES ('test-user-id', 'Test User', 'test.user@example.com')
ON CONFLICT ("id") DO NOTHING;

-- Insert Sample Products
INSERT INTO "Product" ("id", "name", "description", "price", "imageUrl")
VALUES 
('prod-1', 'Wireless Headphones', 'High quality noise-canceling headphones.', 199.99, 'https://via.placeholder.com/150'),
('prod-2', 'Mechanical Keyboard', 'RGB mechanical keyboard with cherry mx switches.', 129.50, 'https://via.placeholder.com/150'),
('prod-3', 'Gaming Mouse', 'Ergonomic gaming mouse with adjustable DPI.', 59.99, 'https://via.placeholder.com/150')
ON CONFLICT ("id") DO NOTHING;