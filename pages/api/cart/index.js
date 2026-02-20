// pages/api/cart/index.js
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import prisma from "../../../lib/prisma";
import { z } from "zod";

// 1. Define Zod validation schemas
const postSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  quantity: z.number().int().positive().default(1),
});

const deleteSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
});

export default async function handler(req, res) {
  // 2. Protect the route - check for active session
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // 3. Find the current user and their cart
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { cart: true },
  });

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  let cartId = user.cart?.id;

  // Create a cart if this is the user's first time
  if (!cartId) {
    const newCart = await prisma.cart.create({
      data: { userId: user.id },
    });
    cartId = newCart.id;
  }

  // --- GET: Fetch Cart ---
  if (req.method === "GET") {
    const cart = await prisma.cart.findUnique({
      where: { id: cartId },
      include: {
        items: {
          include: { product: true }, // Include product details for the UI
        },
      },
    });
    return res.status(200).json(cart || { items: [] });
  }

  // --- POST: Add to Cart ---
  if (req.method === "POST") {
    try {
      const { productId, quantity } = postSchema.parse(req.body);

      const existingItem = await prisma.cartItem.findFirst({
        where: { cartId: cartId, productId: productId },
      });

      if (existingItem) {
        // If it exists, update the quantity
        const updatedItem = await prisma.cartItem.update({
          where: { id: existingItem.id },
          data: { quantity: existingItem.quantity + quantity },
        });
        return res.status(200).json(updatedItem);
      } else {
        // If it's new, create the item
        const newItem = await prisma.cartItem.create({
          data: {
            cartId: cartId,
            productId: productId,
            quantity: quantity,
          },
        });
        return res.status(200).json(newItem);
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Validation failed", details: error.errors });
      }
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  // --- DELETE: Remove from Cart ---
  if (req.method === "DELETE") {
    try {
      const { productId } = deleteSchema.parse(req.body);

      const existingItem = await prisma.cartItem.findFirst({
        where: { cartId: cartId, productId: productId },
      });

      if (!existingItem) {
        return res.status(404).json({ error: "Item not found in cart" });
      }

      await prisma.cartItem.delete({
        where: { id: existingItem.id },
      });

      return res.status(200).json({ message: "Item removed" });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Validation failed", details: error.errors });
      }
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  // Block unsupported methods
  res.setHeader("Allow", ["GET", "POST", "DELETE"]);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}