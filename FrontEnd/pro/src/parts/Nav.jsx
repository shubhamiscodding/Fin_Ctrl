import React from "react";
import { Link } from "react-router-dom";
import '../partcss/Nav.css';

function Nav() {
  return (
    <nav>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/Guide">Guide</Link></li>
        <li><Link to="/Login">Login</Link></li>
      </ul>
    </nav>
  );
}

export default Nav;
