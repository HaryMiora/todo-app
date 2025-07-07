import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <p>&copy; {new Date().getFullYear()} TodoApp - Tous droits réservés</p>
      </div>
    </footer>
  );
};

export default Footer;
