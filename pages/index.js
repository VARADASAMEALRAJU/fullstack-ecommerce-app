// pages/index.js
import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';
import prisma from '../lib/prisma';

export async function getServerSideProps(context) {
  const { q = '', page = '1' } = context.query;
  const currentPage = parseInt(page, 10) || 1;
  const take = 12; // Items per page
  const skip = (currentPage - 1) * take;

  const whereClause = q
    ? {
        OR: [
          { name: { contains: q, mode: 'insensitive' } },
          { description: { contains: q, mode: 'insensitive' } },
        ],
      }
    : {};

  // Fetch products and total count simultaneously for pagination logic
  const [products, totalCount] = await Promise.all([
    prisma.product.findMany({
      where: whereClause,
      skip, // Skips items from previous pages
      take, // Limits results to the current page size
      orderBy: { createdAt: 'desc' },
    }),
    prisma.product.count({ where: whereClause }),
  ]);

  const serializedProducts = products.map((p) => ({
    ...p,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  }));

  const hasNextPage = skip + take < totalCount;

  return {
    props: { 
      products: serializedProducts, 
      currentPage, 
      q, 
      hasNextPage 
    },
  };
}

export default function Home({ products, currentPage, q, hasNextPage }) {
  const router = useRouter();
  const { data: session } = useSession();
  const [searchTerm, setSearchTerm] = useState(q);

  const handleSearch = (e) => {
    e.preventDefault();
    router.push(`/?q=${searchTerm}&page=1`);
  };

  const handleAddToCart = async (productId) => {
    if (!session) {
      alert("Please sign in to add items to your cart.");
      return;
    }

    const res = await fetch('/api/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, quantity: 1 }),
    });

    if (res.ok) {
      alert("Item added to cart successfully!");
    } else {
      alert("Failed to add item to cart.");
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50 text-black">
      <nav className="flex justify-between items-center mb-8 p-4 bg-white shadow rounded">
        <h1 className="text-2xl font-bold">E-Commerce Catalog</h1>
        <div className="flex gap-4 items-center">
          <Link href="/cart" className="text-blue-600 hover:underline">View Cart</Link>
          {session ? (
            <>
              <span>Hi, {session.user.name}</span>
              <button data-testid="signout-button" onClick={() => signOut()} className="bg-red-500 text-white px-4 py-2 rounded">Sign Out</button>
            </>
          ) : (
            <button data-testid="signin-button" onClick={() => signIn('github')} className="bg-green-500 text-white px-4 py-2 rounded">Sign In</button>
          )}
        </div>
      </nav>

      <form onSubmit={handleSearch} className="mb-8 flex gap-2">
        <input
          type="text"
          data-testid="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search products..."
          className="border p-2 rounded w-full max-w-md bg-white text-black"
        />
        <button type="submit" data-testid="search-button" className="bg-blue-600 text-white px-4 py-2 rounded">
          Search
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div key={product.id} data-testid={`product-card-${product.id}`} className="border p-4 rounded bg-white shadow flex flex-col">
            <img src={product.imageUrl} alt={product.name} className="w-full h-48 object-cover mb-4 rounded" />
            <h2 className="text-xl font-semibold">{product.name}</h2>
            <p className="text-gray-600 mb-4">${product.price.toFixed(2)}</p>
            <div className="mt-auto flex justify-between items-center">
              <Link href={`/products/${product.id}`} className="text-blue-600 hover:underline">
                View Details
              </Link>
              <button 
                data-testid={`add-to-cart-button-${product.id}`} 
                onClick={() => handleAddToCart(product.id)}
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="mt-8 flex gap-4">
        {currentPage > 1 && (
          <Link 
            href={`/?q=${q}&page=${currentPage - 1}`} 
            data-testid="pagination-prev" 
            className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
          >
            Previous
          </Link>
        )}
        {hasNextPage && (
          <Link 
            href={`/?q=${q}&page=${currentPage + 1}`} 
            data-testid="pagination-next" 
            className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
          >
            Next Page
          </Link>
        )}
      </div>
    </div>
  );
}