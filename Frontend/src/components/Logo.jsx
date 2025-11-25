import React from 'react';
import logo from '../assets/logo.png';

const Logo = ({ className = '', ...props }) => (
  <img 
    src={logo} 
    alt="Logo" 
    className={`h-20 w-auto ${className}`} 
    {...props} 
  />
);

export default Logo;
