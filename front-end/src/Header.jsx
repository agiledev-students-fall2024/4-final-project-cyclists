import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaAlignJustify, FaCompress } from "react-icons/fa";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <header className="fixed top-0 left-0 w-full h-10 px-4 bg-emerald-800 text-white flex justify-between items-center z-50">
      <h1 className="text-lg font-extrabold">Cyclable</h1>

      <FaAlignJustify 
        className="cursor-pointer text-white hover:text-gray-300"
        onClick={toggleMenu}
        size={24}
      />

      {menuOpen && (
        <div className="absolute top-16 right-4 w-64 bg-gray-100 shadow-lg p-4 z-10 rounded-lg">
          <FaCompress 
            className="absolute top-2 right-2 cursor-pointer text-emerald-800 hover:text-gray-600"
            onClick={toggleMenu}
            size={20}
          />
          <nav className="mt-4">
            <ul className="flex flex-col items-end space-y-4">
              <li>
                <Link to="/" className="text-emerald-800 font-semibold hover:underline" onClick={toggleMenu}>
                  Home
                </Link>
              </li>
              <li>
                <Link to="/map" className="text-emerald-800 font-semibold hover:underline" onClick={toggleMenu}>
                  Map
                </Link>
              </li>
              <li>
                <Link to="/post" className="text-emerald-800 font-semibold hover:underline" onClick={toggleMenu}>
                  Post
                </Link>
              </li>
              <li>
                <Link to="/profile" className="text-emerald-800 font-semibold hover:underline" onClick={toggleMenu}>
                  Profile
                </Link>
              </li>
              <li>
                <Link to="/saved-routes" className="text-emerald-800 font-semibold hover:underline" onClick={toggleMenu}>
                  Saved Routes
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
}

export default Header;
