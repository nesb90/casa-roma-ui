import React, { useEffect, useState } from 'react';
import _ from 'lodash';

import { showAlert } from '../../common';
import { makeRequest } from '../../common/axios';

import ModalOrder from './modal-order';
import ModalPayment from '../Payments/modal-payment';

const emptyOrder = {
  id: 0,
  customerName: '',
  address: '',
  eventDate: '',
  returnedAt: '',
  isCancelled: false,
  items: []
}
const emptyPayment = {
  orderId: 0,
  amount: '',
  payConcept: '',
  payments: []
};
// const defaultFilters = {
//   startDate: '',
//   endDate: '',
//   cancelled: false,
//   completed: false
// };
const modalId = 'closeModalOrder';
// const orderStatuses = {
//   orderReceived: 'ORDEN_RECIBIDA',
//   processingOrder: 'PROCESANDO_ORDEN',
//   cancelled: 'ORDEN_CANCELADA',
//   completed: 'ORDEN_COMPLETADA'
// };
const operations = {
  CREATE: 'CREATE',
  UPDATE: 'UPDATE'
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [operation, setOperation] = useState(1);
  const [title, setTitle] = useState('');
  const [products, setProducts] = useState([]); // products = db items
  // const [filters, setFilters] = useState(_.cloneDeep(defaultFilters));
  const [state, setState] = useState({
    myPayment: _.cloneDeep(emptyPayment),
    myOrder: _.cloneDeep(emptyOrder),
    refresh: 0
  });

  const getOrderId = function (databaseId) {
    return `CRE-${databaseId.toLocaleString('es-MX', {
      minimumIntegerDigits: 7,
      useGrouping: false
    })}`;
  };

  const { myOrder, refresh, myPayment } = state;
  // const {
  //   startDate,
  //   endDate,
  //   cancelled,
  //   completed
  // } = filters;
  let {
    id,
    customerName,
    address,
    eventDate,
    returnedAt,
    isCancelled,
    items
  } = myOrder;

  const getOrders = async function () {
    const response = await makeRequest({ url: `/order`, method: 'get' });
    setOrders(response);
  };

  const getProducts = async function () {
    const response = await makeRequest({ url: `/item`, method: 'get' });
    setProducts(response);
  };

  const getPayments = async function (orderId) {
    const response = await makeRequest({ url: `/order-payment/${orderId}`, method: 'get' });
    myPayment.payments = response || [];
    setState((s) => ({
      ...s, myPayment
    }));
  };

  const openModal = function ({
    op,
    id,
    customerName,
    address,
    eventDate,
    returnedAt,
    isCancelled,
    items
  }) {
    setOperation(op);
    if (op === operations.CREATE) {
      setTitle('Crear Orden');
      setState((s) => ({ ...s, myOrder: _.cloneDeep(emptyOrder) }));
    } else if (op === operations.UPDATE) {
      setTitle('Editar Orden');
      setState((s) => ({
        ...s,
        myOrder: {
          id,
          customerName,
          address,
          eventDate,
          returnedAt,
          isCancelled,
          items
        }
      }
      ));
    };
  };

  const createOrderItem = async ({
    method = 'post',
    data,
    url = '/order-item'
  }) => {
    return await makeRequest({
      method,
      data,
      url,
      alertResult: true
    });
  };

  const sendOrder = async function () {
    if (operation === operations.CREATE) {
      await makeRequest({
        method: 'post',
        url: '/order',
        data: {
          customerName, address, eventDate, returnedAt, isCancelled, items
        },
        alertResult: true,
        closeModal: true,
        modalId
      });

      setState((s) => ({
        ...s,
        myOrder: _.cloneDeep(emptyOrder),
        refresh: refresh + 1
      }));
    } else if (operation === operations.UPDATE) {
      await makeRequest({
        method: 'put',
        url: `/order/${id}`,
        data: { customerName, address, eventDate, returnedAt, isCancelled },
        alertResult: true,
        closeModal: true,
        modalId
      });

      setState((s) => ({
        ...s, myOrder: _.cloneDeep(emptyOrder),
        refresh: refresh + 1
      }));
    };
  };

  const deleteOrder = function (id) {
    showAlert({
      message: `¿Seguro de eliminar la orden ${getOrderId(id)}?`,
      icon: 'question',
      text: 'Esta accion no se puede revertir',
      showCancelButton: true,
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        await makeRequest({ url: `/order/${id}`, method: 'delete' });
        setState((s) => ({ ...s, refresh: refresh + 1 }));
      } else {
        showAlert({ message: 'Orden no eliminada', icon: 'info' });
      }
    });
  };

  const cancelOrder = function (id) {
    showAlert({
      message: `¿Seguro de cancelar la orden ${getOrderId(id)}?`,
      icon: 'question',
      text: 'Esta accion no se puede revertir',
      showCancelButton: true,
      confirmButtonText: 'Si, cancelar',
      cancelButtonText: 'Salir'
    }).then(async (result) => {
      if (result.isConfirmed) {
        await makeRequest({
          method: 'put',
          data: {
            isCancelled: true
          },
          url: `/order/${id}`
        });
        setState((s) => ({ ...s, refresh: refresh + 1 }));
      } else {
        showAlert({ message: 'Orden no cancelada', icon: 'info' });
      }
    });
  };

  const parseDate = function (date) {
    if (date) {
      const parsedDate = new Date(date);
      return `${parsedDate.toLocaleDateString('es-MX')} ${parsedDate.toLocaleTimeString('es-MX')}`;
    }
    return '';
  };

  const openPaymentModal = async function (orderId) {
    setTitle('Pagos');
    await getPayments(orderId);
    myPayment.orderId = orderId;
    setState((s) => ({
      ...s, myPayment
    }))
  };

  // const setCancelledFilter = function (value) {
  //   filters.cancelled = value;
  //   setFilters(filters);
  // };

  // const setCompletedFilter = function (value) {
  //   filters.completed = value;
  //   setFilters(filters);
  // };

  useEffect(function () {
    getOrders();
    getProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refresh]);

  return (
    <div className='container-fluid'>
      <div className='row mt-3'>
        <div className='col'>
          <div className='row'>
            <div className='col'>
              <h3>Ordenes</h3>
            </div>
            <div className='col text-end'>
              <button className='btn btn-success' onClick={() => openModal({ op: operations.CREATE })} data-bs-toggle='modal' data-bs-target='#modalOrder'>
                <i className='fa-solid fa-circle-plus'></i> Crear Orden
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className='row mt-3'>
        <div className='col'>
          <div className='table-responsive'>
            <table className='table table-bordered table-striped'>
              <thead>
                <tr className="text-center">
                  <th>#</th>
                  <th>Nombre del Cliente</th>
                  <th>Direccion del Evento</th>
                  <th>Fecha del Evento</th>
                  <th>Fecha Devolución</th>
                  <th>Fecha de Creación</th>
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
                      <td className='text-center'>
                        <button onClick={() => openModal({
                          op: operations.UPDATE,
                          id: order.id,
                          customerName: order.customerName,
                          address: order.address,
                          eventDate: order.eventDate,
                          returnedAt: order.returnedAt,
                          isCancelled: order.isCancelled,
                          items: order.items
                        })}
                          className='btn btn-primary' data-bs-toggle='modal' data-bs-target='#modalOrder'>
                          <i className='fa-solid fa-edit'></i>
                        </button>
                        &nbsp;
                        <button
                          disabled={order.isCancelled || !!order.returnedAt}
                          onClick={() => openPaymentModal(order.id)}
                          className='btn btn-secondary'
                          data-bs-toggle='modal' data-bs-target='#modalPayment'
                        >
                          <i className='fa-solid fa-money-bill'></i>
                        </button>
                        &nbsp;
                        <button disabled={order.isCancelled || !!order.returnedAt} onClick={() => cancelOrder(order.id, order.customerName)} className='btn btn-danger'>
                          <i className='fa-solid fa-ban'></i>
                        </button>
                        &nbsp;
                        <button disabled={order.isCancelled || !!order.returnedAt} onClick={() => deleteOrder(order.id)} className='btn btn-dark'>
                          <i className='fa-solid fa-trash'></i>
                        </button>
                      </td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div>
        <ModalOrder
          myOrder={myOrder}
          products={products}
          title={title}
          sendOrder={sendOrder}
          operation={operation}
          createOrderItem={createOrderItem}
          makeRequest={makeRequest}
          setState={setState} />
        <ModalPayment
          title={title}
          myPayment={myPayment}
          makeRequest={makeRequest}
          setState={setState}
          refresh={refresh} />
      </div>
    </div>
  )
};

export default Orders
