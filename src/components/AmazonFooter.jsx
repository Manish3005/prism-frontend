import { Link } from 'react-router-dom';

export default function AmazonFooter() {
  return (
    <footer className="mt-auto">
      <div className="bg-amazon-navy-light text-white text-center py-8">
        <Link to="/" className="text-sm hover:underline">
          Back to top
        </Link>
      </div>

      <div className="bg-amazon-navy text-white py-10">
        <div className="max-w-[1000px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 px-6 text-sm">
          <div>
            <h3 className="font-bold mb-3">Get to Know Us</h3>
            <ul className="space-y-2 text-gray-300">
              <li><span className="hover:underline cursor-pointer">About Amazon</span></li>
              <li><span className="hover:underline cursor-pointer">Careers</span></li>
              <li><span className="hover:underline cursor-pointer">Press Releases</span></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-3">Connect with Us</h3>
            <ul className="space-y-2 text-gray-300">
              <li><span className="hover:underline cursor-pointer">Facebook</span></li>
              <li><span className="hover:underline cursor-pointer">Twitter</span></li>
              <li><span className="hover:underline cursor-pointer">Instagram</span></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-3">Make Money with Us</h3>
            <ul className="space-y-2 text-gray-300">
              <li><Link to="/supplier" className="hover:underline">Sell on Amazon</Link></li>
              <li><Link to="/marketplace" className="hover:underline">Prism Renewed Marketplace</Link></li>
              <li><span className="hover:underline cursor-pointer">Become an Affiliate</span></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-3">Let Us Help You</h3>
            <ul className="space-y-2 text-gray-300">
              <li><span className="hover:underline cursor-pointer">Your Account</span></li>
              <li><span className="hover:underline cursor-pointer">Returns Centre</span></li>
              <li><Link to="/checkout-nudge" className="hover:underline">100% Purchase Protection</Link></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-amazon-navy-dark text-gray-400 text-xs py-6 text-center border-t border-gray-700">
        <div className="flex items-center justify-center gap-1 mb-2">
          <span className="text-lg font-bold text-white">amazon</span>
          <span className="text-amazon-orange">.in</span>
        </div>
        <p>
          HackOnAmazon 2026 Demo — <strong className="text-amazon-orange">Prism</strong> (The Intelligent Bridge)
        </p>
        <p className="mt-1">Microservices: FastAPI · Upstash Redis · Ollama · MongoDB Atlas</p>
      </div>
    </footer>
  );
}
