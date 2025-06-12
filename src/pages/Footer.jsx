import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-400 py-6 ">
      <div className="max-w-6xl mx-auto px-4 text-center text-sm">
        <p className="text-gray-500">
          © {new Date().getFullYear()} MyHealthPilot. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
