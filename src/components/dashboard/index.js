import React from "react";
import Orders from "../Orders";
import Items from "../Items";
import Stock from "../Stock";
// import casaRomaLogo from "../../images/casa-roma-logo.png";

function Dashboard() {
  return (
    <div className="container-fluid">
      <div className='row mt-3'>
        <h1>Casa Roma Dashboard</h1>
        {/* <img src={casaRomaLogo} alt="casa-roma-logo" width="200" height="200"></img> */}
        {/* Nav tabs */}
        <ul class="nav nav-tabs" id="myTab" role="tablist">
          <li class="nav-item" role="presentation">
            <button class="nav-link active" id="home-tab" data-bs-toggle="tab" data-bs-target="#home" type="button" role="tab" aria-controls="home" aria-selected="true">
              <span className="fa-solid fa-list"></span>&nbsp;Ordenes
            </button>
          </li>
          <li class="nav-item" role="presentation">
            <button class="nav-link" id="profile-tab" data-bs-toggle="tab" data-bs-target="#profile" type="button" role="tab" aria-controls="profile" aria-selected="false">
              <span className="fa-solid fa-utensils"></span>&nbsp;Productos
            </button>
          </li>
          <li class="nav-item" role="presentation">
            <button class="nav-link" id="messages-tab" data-bs-toggle="tab" data-bs-target="#messages" type="button" role="tab" aria-controls="messages" aria-selected="false">
              <span className="fa-solid fa-warehouse" />&nbsp;Inventario
            </button>
          </li>
        </ul>

        {/* Tab panes */}
        <div class="tab-content">
          <div class="tab-pane active" id="home" role="tabpanel" aria-labelledby="orders-tab"> <Orders /> </div>
          <div class="tab-pane" id="profile" role="tabpanel" aria-labelledby="items-tab"> <Items /> </div>
          <div class="tab-pane" id="messages" role="tabpanel" aria-labelledby="messages-tab"> <Stock /> </div>
        </div>
      </div>
    </div>
  )
};

export default Dashboard;
