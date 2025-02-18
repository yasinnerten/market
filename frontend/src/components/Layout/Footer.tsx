export default function Footer() {
  return (
    <footer className="bg-gray-100 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">About Market</h3>
            <p className="text-gray-600">
              Your one-stop shop for all your needs. Quality products at competitive prices.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-600">
              <li><a href="/products" className="hover:text-gray-900">Products</a></li>
              <li><a href="/cart" className="hover:text-gray-900">Cart</a></li>
              <li><a href="/orders" className="hover:text-gray-900">Orders</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-gray-600">
              <li>Email: support@market.com</li>
              <li>Phone: (555) 123-4567</li>
              <li>Address: 123 Market St, City, Country</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t text-center text-gray-600">
          <p>&copy; {new Date().getFullYear()} Market. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
} 