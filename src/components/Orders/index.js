import React, { useEffect, useState } from 'react';

import { showAlert } from '../../common';
import getAxios from '../../common/axios';
import ModalOrder from './modal-order';
import _ from 'lodash';

const emptyOrder = {
  id: 0,
  customerName: '',
  address: '',
  eventDate: '',
  returnedAt: '',
  isCancelled: false,
  items: []
}

export const Orders = () => {
  const axios = getAxios();
  const [orders, setOrders] = useState([]);
  const [operation, setOperation] = useState(1);
  const [title, setTitle] = useState('');
  const [products, setProducts] = useState([]); // products = db items
  const [state, setState] = useState({
    myOrder: _.cloneDeep(emptyOrder),
    refresh: 0
  });
  const orderStatuses = {
    orderReceived: 'ORDEN_RECIBIDA',
    processingOrder: 'PROCESANDO_ORDEN',
    cancelled: 'ORDEN_CANCELADA',
    completed: 'ORDEN_COMPLETADA'
  };

  const getOrderStatus = function ({
    isCancelled,
    returnedAt
  }) {
    if (isCancelled) {
      return orderStatuses.cancelled;
    } else if (returnedAt) {
      return orderStatuses.completed;
    } else {
      return orderStatuses.orderReceived;
    };
  };

  const { myOrder, refresh } = state
  let {
    id,
    customerName,
    address,
    eventDate,
    returnedAt,
    isCancelled,
    items
  } = myOrder

  const getOrders = async function () {
    const response = await axios.get(`/order`);
    setOrders(response.data);
  };

  const getProducts = async function () {
    const response = await axios.get(`/item`);
    setProducts(response.data);
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
    if (op === 1) {
      setTitle('Crear Orden');
      setState((s) => ({ ...s, myOrder: _.cloneDeep(emptyOrder) }));
    } else if (op === 2) {
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

  const makeRequest = async function ({ method, data, url, closeModal = true }) {
    try {
      const response = await axios.request({
        method, data, url
      });

      showAlert({ message: response.data.message, icon: 'success' });
      if (closeModal) {
        document.getElementById('closeModalButton').click();
      }

      return response.data;
    } catch (error) {
      const { message } = error.response.data;
      showAlert({ message, icon: 'error' })
      console.log(error)
    }
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
      closeModal: false
    });
  };

  const sendOrder = async function () {
    switch (operation) {
      case 1:
        await makeRequest({
          method: 'post',
          url: '/order',
          data: {
            customerName, address, eventDate, returnedAt, isCancelled, items
          }
        });

        setState((s) => ({
          ...s,
          myOrder: _.cloneDeep(emptyOrder),
          refresh: refresh + 1
        }));
        break;
      case 2:
        await makeRequest({
          method: 'put',
          url: `/order/${id}`,
          data: { customerName, address, eventDate, returnedAt, isCancelled }
        });
        setState((s) => ({
          ...s, myOrder: _.cloneDeep(emptyOrder),
          refresh: refresh + 1
        }));
        break;
      default:
        break;
    }
  };

  const deleteOrder = function (id, name) {
    showAlert({
      message: `¿Seguro de eliminar la orden para ${name}?`,
      icon: 'question',
      text: 'Esta accion no se puede revertir',
      showCancelButton: true,
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        await axios.delete(`/order/${id}`);
        setState((s) => ({ ...s, refresh: refresh + 1 }));
      } else {
        showAlert({ message: 'Orden no eliminada', icon: 'info' });
      }
    });
  };

  const cancelOrder = function (id, name) {
    showAlert({
      message: `¿Seguro de cancelar la orden para ${name}?`,
      icon: 'question',
      text: 'Esta accion no se puede revertir',
      showCancelButton: true,
      confirmButtonText: 'Si, cancelar',
      cancelButtonText: 'Salir'
    }).then(async (result) => {
      if (result.isConfirmed) {
        await axios.request({
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
  }

  useEffect(function () {
    getOrders();
    getProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refresh]);

  return (
    <div className='App'>
      <div className='container-fluid'>
        <div className='row mt-3'>
          <div className='col-md-4 offset-md-4'>
            <div className='d-grid mx-auto'>
              <button className='btn btn-success' onClick={() => openModal({ op: 1 })} data-bs-toggle='modal' data-bs-target='#modalOrder'>
                <i className='fa-solid fa-circle-plus'></i> Crear Orden
              </button>
            </div>
          </div>
        </div>
        <div className='row mt-3'>
          <div className='col-12 col-lg-8 offset-0 offset-lg-2'>
            <div className='table-responsive'>
              <table className='table table-bordered'>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Nombre del Cliente</th>
                    <th>Direccion del Evento</th>
                    <th>Fecha del Evento</th>
                    <th>Fecha Devolución</th>
                    <th>Estatus de Orden</th>
                    <th />
                  </tr>
                </thead>
                <tbody className='table-group-divider'>
                  {
                    orders.map((order, index) => (
                      <tr key={order.id}>
                        <td>{(index + 1)}</td>
                        <td>{order.customerName}</td>
                        <td>{order.address}</td>
                        <td className='text-center'>{parseDate(order.eventDate)}</td>
                        <td className='text-center'>{parseDate(order.returnedAt)}</td>
                        <td className='text-center'>{getOrderStatus({
                          isCancelled: order.isCancelled,
                          returnedAt: order.returnedAt
                        })}</td>
                        <td className='text-center'>
                          <button onClick={() => openModal({
                            op: 2,
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
                          <button disabled={order.isCancelled || !!order.returnedAt} onClick={() => cancelOrder(order.id, order.customerName)} className='btn btn-warning'>
                            <i className='fa-solid fa-ban'></i>
                          </button>
                          &nbsp;
                          <button disabled={order.isCancelled || !!order.returnedAt} onClick={() => deleteOrder(order.id, order.customerName)} className='btn btn-danger'>
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
      </div>
      {
        <ModalOrder
          myOrder={myOrder}
          products={products}
          title={title}
          sendOrder={sendOrder}
          operation={operation}
          createOrderItem={createOrderItem}
          makeRequest={makeRequest}
          setState={setState}
        />
      }
    </div>
  )
};
