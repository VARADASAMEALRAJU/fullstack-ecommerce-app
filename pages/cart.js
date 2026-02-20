// pages/cart.js
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function Cart() {
  const { status } = useSession();
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(true);

  // Fetch the cart data from our API route when the component loads
  useEffect(() => {
    if (status === 'authenticated') {
      fetchCart();
    }
  }, [status]);

  const fetchCart = async () => {
    const res = await fetch('/api/cart');
    if (res.ok) {
      const data = await res.json();
      setCart(data);
    }
    setLoading(false);
  };

  const removeItem = async (productId) => {
    const res = await fetch('/api/cart', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId }),
    });
    if (res.ok) {
      fetchCart(); // Refresh the cart to show the item was removed
    }
  };

  // Calculate the total price of all items in the cart
  const total = cart.items?.reduce((sum, item) => sum + (item.product.price * item.quantity), 0) || 0;

  if (status === 'loading' || loading) {
    return <div className="min-h-screen p-8 bg-gray-50 text-black">Loading your cart...</div>;
  }

  return (
    <div className="min-h-screen p-8 bg-gray-50 text-black">
      <Link href="/" className="text-blue-600 hover:underline mb-8 inline-block">&larr; Back to Catalog</Link>
      <h1 className="text-3xl font-bold mb-8">Your Shopping Cart</h1>

      {!cart.items || cart.items.length === 0 ? (
        <p className="text-lg">Your cart is currently empty.</p>
      ) : (
        <div className="bg-white p-6 rounded shadow max-w-4xl">
          {cart.items.map((item) => (
            <div key={item.id} data-testid={`cart-item-${item.productId}`} className="flex justify-between items-center border-b py-4">
              <div className="flex items-center gap-4">
                <img src={item.product.imageUrl} alt={item.product.name} className="w-16 h-16 object-cover rounded" />
                <div>
                  <h2 className="text-xl font-semibold">{item.product.name}</h2>
                  <p className="text-gray-600">${item.product.price.toFixed(2)}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-6">
                <span data-testid={`quantity-input-${item.productId}`} className="font-medium">
                  Qty: {item.quantity}
                </span>
                <button 
                  data-testid={`remove-item-button-${item.productId}`}
                  onClick={() => removeItem(item.productId)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          
          <div className="mt-8 text-right text-2xl font-bold" data-testid="cart-total">
            Total: ${total.toFixed(2)}
          </div>
        </div>
      )}
    </div>
  );
}