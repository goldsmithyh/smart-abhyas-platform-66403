
import React from 'react';
import { Link } from 'react-router-dom';

const LegacyHeader = () => {
  return (
    <header id="site-header" className="">
      <div className="container">
        <nav className="navbar navbar-expand-lg navbar-light">
          <Link className="navbar-brand" to="/">
            <img src="/lovable-uploads/d0fda1dc-29de-4e00-af9c-57ba32597bb0.png" style={{ width: '273px', borderRadius: '10px' }} alt="Smart Creations" />
          </Link>
          <button 
            className="navbar-toggler collapsed" 
            type="button" 
            data-bs-toggle="collapse"
            data-bs-target="#navbarScroll" 
            aria-controls="navbarScroll" 
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon fa icon-expand fa-bars"></span>
            <span className="navbar-toggler-icon fa icon-close fa-times"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarScroll">
            <ul className="navbar-nav ms-auto my-2 my-lg-0 navbar-nav-scroll">
              <li className="nav-item">
                <Link className="nav-link active" aria-current="page" to="/">Home</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/about">About</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/contact">Contact</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/admin">Admin</Link>
              </li>
            </ul>
          </div>
          {/* toggle switch for light and dark theme */}
          <div className="cont-ser-position">
            <nav className="navigation">
              <div className="theme-switch-wrapper">
                <label className="theme-switch" htmlFor="checkbox">
                  <input type="checkbox" id="checkbox" />
                  <div className="mode-container">
                    <i className="gg-sun"></i>
                    <i className="gg-moon"></i>
                  </div>
                </label>
              </div>
            </nav>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default LegacyHeader;
