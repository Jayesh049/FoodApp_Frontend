import React from 'react';
import NavBar from './Home Page/NavBar';
import Footer from './Home Page/Footer';
import CartSidebar from './Cart/CartSidebar';

function LayoutWrapper({ children, showHeader = true, showFooter = true }) {
  return (
    <div className="app-layout">
      {showHeader && <NavBar />}
      <main className="page-content">{children}</main>
      {showFooter && <Footer />}
      <CartSidebar />
    </div>
  );
}

export default LayoutWrapper;
