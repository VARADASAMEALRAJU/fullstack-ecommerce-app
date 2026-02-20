// pages/products/[id].js
import prisma from '../../lib/prisma';
import Link from 'next/link';
import { useSession } from 'next-auth/react'; // NEW: Imported useSession

export async function getServerSideProps(context) {
  const { id } = context.params;

  const product = await prisma.product.findUnique({
    where: { id: id },
  });

  if (!product) {
    return { notFound: true };
  }

  return {
    props: {
      product: {
        ...product,
        createdAt: product.createdAt.toISOString(),
        updatedAt: product.updatedAt.toISOString(),
      },
    },
  };
}

export default function ProductDetail({ product }) {
  const { data: session } = useSession(); // NEW: Get session status

  // NEW: Function to handle adding items to the cart
  const handleAddToCart = async () => {
    if (!session) {
      alert("Please sign in to add items to your cart.");
      return;
    }

    const res = await fetch('/api/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId: product.id, quantity: 1 }),
    });

    if (res.ok) {
      alert("Item added to cart successfully!");
    } else {
      alert("Failed to add item to cart.");
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50 text-black">
      <Link href="/" className="text-blue-600 hover:underline mb-8 inline-block">&larr; Back to Catalog</Link>
      
      <div className="max-w-4xl mx-auto bg-white p-8 rounded shadow flex flex-col md:flex-row gap-8">
        <img src={product.imageUrl} alt={product.name} className="w-full md:w-1/2 h-auto object-cover rounded" />
        
        <div className="flex flex-col justify-center">
          <h1 data-testid="product-name" className="text-3xl font-bold mb-4">{product.name}</h1>
          <p data-testid="product-price" className="text-2xl text-green-600 font-semibold mb-4">${product.price.toFixed(2)}</p>
          <p data-testid="product-description" className="text-gray-700 mb-8">{product.description}</p>
          
          <button 
            data-testid="add-to-cart-button" 
            onClick={handleAddToCart} // NEW: Attached the function
            className="bg-blue-600 text-white px-6 py-3 rounded text-lg font-semibold hover:bg-blue-700 transition w-max"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}