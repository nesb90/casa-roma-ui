import React from "react";
// import casaRomaLogo from "../../images/casa-roma-logo.png"

function Navigation() {
  return (
    <div className="container-fluid">
      <div className="row">
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <div className="container-fluid">
            <a className="navbar-brand mb-0 h1" href="/orders">
              Casa Roma
            </a>
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
              <li class="nav-item">
                <a class="nav-link" aria-current="page" href="/orders"><span className="fa-solid fa-list"></span>&nbsp;Ordenes</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="/items"> <span className="fa-solid fa-utensils"></span>&nbsp;Productos</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="/stock"><span className="fa-solid fa-warehouse" />&nbsp;Inventario</a>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </div>
  )
};

export default Navigation;
