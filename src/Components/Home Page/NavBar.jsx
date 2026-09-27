import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { GiHamburgerMenu } from 'react-icons/gi';
import { MdOutlineRestaurantMenu } from 'react-icons/md';
import { BsCart3 } from 'react-icons/bs';
import { useAuth } from '../Context/AuthProvider';
import { useCart } from '../Cart/CartProvider';
import { isAdmin } from '../../utils/isAdmin';
import '../Styles/nav.css';
import '../Styles/cart.css';

function NavBar() {
  const [toggleMenu, setToggleMenu] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const adminRef = useRef(null);
  const { user, logout } = useAuth();
  const { getTotalItems, toggleCart } = useCart();
  const totalItems = getTotalItems();
  const admin = isAdmin(user);

  useEffect(() => {
    const onDoc = (e) => {
      if (adminRef.current && !adminRef.current.contains(e.target)) {
        setAdminOpen(false);
      }
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  return (
    <nav className="app__navbar">
      <div className="app__navbar-logo">
        <Link to="/" className="app__brand-logo">
          FOODAPP
        </Link>
      </div>

      <ul className="app__navbar-links">
        <li className="p__opensans"><Link to="/">Home</Link></li>
        <li className="p__opensans"><Link to="/allPlans">Plans</Link></li>
        <li className="p__opensans"><Link to="/#newsletter">Newsletter</Link></li>
        <li className="p__opensans"><Link to="/#contact">Contact</Link></li>
      </ul>

      <div className="app__navbar-login">
        <button type="button" className="navbar-cart-btn" onClick={toggleCart} aria-label="Open cart">
          <BsCart3 />
          {totalItems > 0 && <span className="navbar-cart-badge">{totalItems}</span>}
        </button>
        <div />
        {user ? (
          <>
            <Link to="/profilePage" className="p__opensans">{user?.name}</Link>
            {admin && (
              <div className="navbar-admin-menu" ref={adminRef}>
                <button
                  type="button"
                  className="navbar-admin-btn"
                  aria-expanded={adminOpen}
                  onClick={() => setAdminOpen((o) => !o)}
                >
                  Admin
                </button>
                {adminOpen && (
                  <div className="navbar-admin-dropdown">
                    <Link to="/admin/plans" onClick={() => setAdminOpen(false)}>Manage Plans</Link>
                    <Link to="/admin/sections" onClick={() => setAdminOpen(false)}>Sections</Link>
                    <Link to="/admin/rag" onClick={() => setAdminOpen(false)}>Admin AI</Link>
                  </div>
                )}
              </div>
            )}
            <div />
            <button type="button" className="p__opensans navbar-link-btn" onClick={logout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="p__opensans">Log In / Register</Link>
            <div />
            <Link to="/allPlans#cinema" className="navbar-book-btn">Book Now</Link>
          </>
        )}
      </div>

      <div className="app__navbar-smallscreen">
        <button type="button" className="navbar-cart-btn navbar-cart-btn--mobile" onClick={toggleCart} aria-label="Open cart">
          <BsCart3 />
          {totalItems > 0 && <span className="navbar-cart-badge">{totalItems}</span>}
        </button>
        <GiHamburgerMenu color="#fff" fontSize={27} onClick={() => setToggleMenu(true)} />

        {toggleMenu && (
          <div className="app__navbar-smallscreen_overlay flex__center slide-bottom">
            <MdOutlineRestaurantMenu
              fontSize={27}
              className="overlay__close"
              onClick={() => setToggleMenu(false)}
            />
            <ul className="app__navbar-smallscreen_links">
              <li className="p__opensans"><Link to="/" onClick={() => setToggleMenu(false)}>Home</Link></li>
              <li className="p__opensans"><Link to="/allPlans" onClick={() => setToggleMenu(false)}>Plans</Link></li>
              <li className="p__opensans"><Link to="/#newsletter" onClick={() => setToggleMenu(false)}>Newsletter</Link></li>
              <li className="p__opensans"><Link to="/#contact" onClick={() => setToggleMenu(false)}>Contact</Link></li>
              <li className="p__opensans"><Link to="/allPlans#cinema" onClick={() => setToggleMenu(false)}>Book Now</Link></li>
              {user ? (
                <>
                  <li className="p__opensans"><Link to="/profilePage" onClick={() => setToggleMenu(false)}>{user?.name}</Link></li>
                  {admin && (
                    <>
                      <li className="p__opensans"><Link to="/admin/plans" onClick={() => setToggleMenu(false)}>Manage Plans</Link></li>
                      <li className="p__opensans"><Link to="/admin/sections" onClick={() => setToggleMenu(false)}>Sections</Link></li>
                      <li className="p__opensans"><Link to="/admin/rag" onClick={() => setToggleMenu(false)}>Admin AI</Link></li>
                    </>
                  )}
                  <li className="p__opensans"><button type="button" className="navbar-link-btn" onClick={() => { logout(); setToggleMenu(false); }}>Logout</button></li>
                </>
              ) : (
                <>
                  <li className="p__opensans"><Link to="/login" onClick={() => setToggleMenu(false)}>Log In</Link></li>
                  <li className="p__opensans"><Link to="/signup" onClick={() => setToggleMenu(false)}>Register</Link></li>
                </>
              )}
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
}

export default NavBar;
