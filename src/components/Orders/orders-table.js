/* eslint-disable jsx-a11y/anchor-has-content */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";

import { operations } from "../../config";
import { parseCurrency } from "../../common";

function OrdersTable(props) {
  const {
    getOrderId,
    parseDate,
    openModal,
    openPaymentModal,
    cancelOrder,
    deleteOrder,
    orders,
    isCancelled,
    isCompleted
  } = props;

  return (
    <div className='col'>
      <div className='table-responsive'>
        <table id="ordersTable" className='table table-bordered table-striped'>
          <thead>
            <tr className="text-center">
              <th>#</th>
              <th>Nombre del Cliente</th>
              <th>Dirección del Evento</th>
              <th>Fecha del Evento</th>
              <th>Fecha Devolución</th>
              <th>Fecha de Creación</th>
              <th>Deposito</th>
              <th />
            </tr>
          </thead>
          <tbody className='table-group-divider'>
            {
              orders.map((order) => (
                <tr key={order.id}>
                  <td className="text-center">{getOrderId(order.id)}</td>
                  <td>{order.customerName}</td>
                  <td>{order.address}</td>
                  <td className='text-center'>{parseDate(order.eventDate)}</td>
                  <td className='text-center'>{parseDate(order.returnedAt)}</td>
                  <td className='text-center'>{parseDate(order.createdAt)}</td>
                  <td className='text-end'>${parseCurrency(order.escrow)}</td>
                  <td className='text-center'>
                    <button onClick={() => openModal({
                      op: operations.UPDATE,
                      id: order.id,
                      customerName: order.customerName,
                      address: order.address,
                      eventDate: order.eventDate,
                      returnedAt: order.returnedAt,
                      escrow: order.escrow,
                      status: order.status,
                      items: order.items
                    })}
                      className='btn btn-primary' data-bs-toggle='modal' data-bs-target='#modalOrder'>
                      <i className='fa-solid fa-edit'></i>
                    </button>
                    &nbsp;
                    <button
                      disabled={isCancelled(order.status) || isCompleted(order.status)}
                      onClick={() => openPaymentModal(order.id)}
                      className='btn btn-secondary'
                      data-bs-toggle='modal' data-bs-target='#modalPayment'
                    >
                      <i className='fa-solid fa-money-bill'></i>
                    </button>
                    &nbsp;
                    <button disabled={isCancelled(order.status) || isCompleted(order.status)} onClick={() => cancelOrder(order.id, order.customerName)} className='btn btn-danger'>
                      <i className='fa-solid fa-ban'></i>
                    </button>
                    &nbsp;
                    <button disabled={isCancelled(order.status) || isCompleted(order.status)} onClick={() => deleteOrder(order.id)} className='btn btn-dark'>
                      <i className='fa-solid fa-trash'></i>
                    </button>
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
      <nav aria-label="orders-pagination">
        <ul className="pagination justify-content-center">
          <li className="page-item"><a href="#" className="page-link"><span aria-hidden="true">&laquo;</span></a></li>
          <li className="page-item"><a href="#" className="page-link"><span aria-hidden="true">&raquo;</span></a></li>
        </ul>
      </nav>
    </div>
  );
};

export default OrdersTable;
