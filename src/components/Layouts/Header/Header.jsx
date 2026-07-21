import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PersonIcon from '@mui/icons-material/Person';
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import InventoryIcon from '@mui/icons-material/Inventory';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import Searchbar from './Searchbar';
import aayushiLogo from '../../../assets/images/logo.jpeg';
import PrimaryDropDownMenu from './PrimaryDropDownMenu';
import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const location = useLocation();
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const { cartItems } = useSelector(state => state.cart);

  const [togglePrimaryDropDown, setTogglePrimaryDropDown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [cartPulse, setCartPulse] = useState(false);
  const prevCartCountRef = useRef(0);

  const dropdownRef = useRef(null);

  useEffect(() => { setIsMounted(true); }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setTogglePrimaryDropDown(false);
      }
    };

    if (togglePrimaryDropDown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [togglePrimaryDropDown]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (cartItems.length > prevCartCountRef.current && cartItems.length > 0) {
      setCartPulse(true);
      const timer = setTimeout(() => setCartPulse(false), 600);
      return () => clearTimeout(timer);
    }
    prevCartCountRef.current = cartItems.length;
  }, [cartItems.length]);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500
        ${isMounted ? "translate-y-0 opacity-100" : "-translate-y-10 opacity-0"}
        ${isScrolled ? "shadow-lg" : ""}`}
        style={{ backgroundColor: isScrolled ? "white" : "#ccfbf1" }}
      >

        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

          {/* LOGO */}
          <Link to="/" onClick={closeMobileMenu} className="flex items-center gap-3">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white rounded-xl border flex items-center justify-center transform hover:scale-110 transition-transform duration-300">
              <img
                src={aayushiLogo}
                alt="Dental Smart"
                className="w-full h-full object-contain"
                draggable="false"
              />
            </div>
            <div className="flex flex-col leading-tight">
              <h1 className="font-bold text-base text-gray-800">
                DENTAL SMART
              </h1>
              <h2 className="text-sm text-gray-600 whitespace-nowrap">
                Think Dental & Think Smart
              </h2>
            </div>

            <div className="hidden sm:block lg:hidden">
              <h1 className="font-bold text-sm text-gray-800 leading-tight">
                DENTAL SMART
              </h1>
            </div>
          </Link>

          {/* SEARCH (DESKTOP) */}
          <div className={`hidden lg:block flex-1 mx-6 ${location.pathname.includes('/orders') ? 'max-w-none' : 'max-w-xl'}`}>
            <Searchbar />
          </div>

          {/* DESKTOP NAV */}
          <nav className="hidden lg:flex items-center gap-2 xl:gap-4">
            {[
              { name: "Home", icon: <HomeIcon sx={{ fontSize: 18 }} />, path: "" },
              { name: "About", icon: <InfoIcon sx={{ fontSize: 18 }} />, path: "about" },
              { name: "Products", icon: <InventoryIcon sx={{ fontSize: 18 }} />, path: "products" },
              { name: "Contact", icon: <ContactMailIcon sx={{ fontSize: 18 }} />, path: "contact" }
            ].map((item) => (
              <Link
                key={item.name}
                to={`/${item.path}`}
                className="flex items-center gap-1 px-2 py-2 text-sm font-semibold text-gray-700 hover:text-gray-900 transition"
              >
                {item.icon}
                <span className="hidden xl:block">{item.name}</span>
              </Link>
            ))}

            {/* CART */}
            <Link
              to="/cart"
              className="relative flex items-center gap-1 px-2 py-2 bg-white rounded-xl border hover:shadow-md transition"
            >
              <ShoppingCartIcon sx={{ fontSize: 20, color: "#0d9488" }} />
              <span className="hidden xl:block text-dental-600 font-semibold">Cart</span>

              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {cartItems.length}
                </span>
              )}
            </Link>

            {/* AUTH */}
            {isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setTogglePrimaryDropDown(!togglePrimaryDropDown)}
                  className="flex items-center gap-1 px-2 py-2 rounded-xl hover:bg-white transition"
                >
                  {user?.avatar?.url ? (
                    <img
                      src={user.avatar.url}
                      alt="User Avatar"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <PersonIcon sx={{ fontSize: 18 }} />
                    </div>
                  )}
                  <span className="hidden xl:block text-sm font-semibold">
                    {user?.name?.split(" ")[0]}
                  </span>
                  {togglePrimaryDropDown ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </button>

                {togglePrimaryDropDown && (
                  <PrimaryDropDownMenu
                    user={user}
                    setTogglePrimaryDropDown={setTogglePrimaryDropDown}
                  />
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="px-3 py-2 bg-dental-700 text-white rounded-xl text-sm font-semibold whitespace-nowrap hover:bg-dental-800 transition"
              >
                Login
              </Link>

            )}
          </nav>

          {/* MEDIUM SCREEN NAV (md to lg) */}
          <nav className="hidden md:flex lg:hidden items-center gap-2">
            {/* CART */}
            <Link
              to="/cart"
              className="relative flex items-center gap-1 px-2 py-2 bg-white rounded-xl border hover:shadow-md transition"
            >
              <ShoppingCartIcon sx={{ fontSize: 20, color: "#0d9488" }} />
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {cartItems.length}
                </span>
              )}
            </Link>


            {/* AUTH */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setTogglePrimaryDropDown(!togglePrimaryDropDown)}
                  className="flex items-center gap-1 px-2 py-2 rounded-xl hover:bg-white transition"
                >
                  {user?.avatar?.url ? (
                    <img
                      src={user.avatar.url}
                      alt="User Avatar"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <PersonIcon sx={{ fontSize: 18 }} />
                    </div>
                  )}
                  {togglePrimaryDropDown ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </button>

                {togglePrimaryDropDown && (
                  <PrimaryDropDownMenu
                    user={user}
                    setTogglePrimaryDropDown={setTogglePrimaryDropDown}
                  />
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="px-3 py-2 bg-dental-700 text-white rounded-xl text-sm font-semibold hover:bg-dental-800 transition"
              >
                Login
              </Link>

            )}
          </nav>

          {/* HAMBURGER */}
          <button
            className="md:hidden relative z-50 flex flex-col gap-1.5"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className={`w-6 h-0.5 bg-gray-800 transition ${mobileMenuOpen && "rotate-45 translate-y-2"}`} />
            <span className={`w-6 h-0.5 bg-gray-800 transition ${mobileMenuOpen && "opacity-0"}`} />
            <span className={`w-6 h-0.5 bg-gray-800 transition ${mobileMenuOpen && "-rotate-45 -translate-y-2"}`} />
          </button>
        </div>
      </header>

      {/* MOBILE MENU */}
      <div
        className={`fixed inset-x-0 top-16 bg-white z-40 transform transition-transform duration-300
        ${mobileMenuOpen ? "translate-y-0" : "-translate-y-full"}`}
      >
        <div className="p-4">
          <Searchbar />
        </div>

        <ul className="flex flex-col gap-4 px-6 py-6 text-gray-800 font-semibold">
          <li className="flex items-center gap-3">
            <HomeIcon sx={{ fontSize: 20 }} />
            <Link to="/" onClick={closeMobileMenu}>Home</Link>
          </li>
          <li className="flex items-center gap-3">
            <InfoIcon sx={{ fontSize: 20 }} />
            <Link to="/about" onClick={closeMobileMenu}>About</Link>
          </li>
          <li className="flex items-center gap-3">
            <InventoryIcon sx={{ fontSize: 20 }} />
            <Link to="/products" onClick={closeMobileMenu}>Products</Link>
          </li>
          <li className="flex items-center gap-3">
            <ContactMailIcon sx={{ fontSize: 20 }} />
            <Link to="/contact" onClick={closeMobileMenu}>Contact</Link>
          </li>
          <li className="flex items-center gap-3">
            <ShoppingCartIcon sx={{ fontSize: 20 }} />
            <Link to="/cart" onClick={closeMobileMenu}>Cart ({cartItems.length})</Link>
          </li>

          {isAuthenticated ? (
            <>
              <li><Link to="/profile" onClick={closeMobileMenu}>Profile</Link></li>
              <li><Link to="/orders" onClick={closeMobileMenu}>My Orders</Link></li>
            </>
          ) : (
            <li><Link to="/login" onClick={closeMobileMenu}>Login</Link></li>
          )}
        </ul>
      </div>

      {/* OVERLAY */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={closeMobileMenu}
        />
      )}

      {/* SPACER */}

    </>
  );
};

export default Header;

