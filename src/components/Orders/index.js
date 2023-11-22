import React, { useEffect, useState } from 'react';
import axios from 'axios';

import { SERVER } from '../../config';

import { showAlert } from '../../common';
import ModalOrder from './modal-order'

export const Orders = () => {
  const url = `${SERVER.url}${SERVER.apiPath}`;
  const [orders, setOrders] = useState([]);
  const [orderItems, setOrderItems] = useState([]);
  const [id, setId] = useState(0);
  const [customerName, setCustomerName] = useState('');
  const [address, setAddress] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [returnedAt, setReturnedAt] = useState('');
  const [isCancelled, setIsCancelled] = useState(false);
  const [operation, setOperation] = useState(1);
  const [title, setTitle] = useState('');
  const [items, setItems] = useState([]);

  const getOrders = async function () {
    const response = await axios.get(`${url}/order`);
    setOrders(response.data);
  };

  const getItems = async function () {
    const response = await axios.get(`${url}/item`);
    setItems(response.data);
  };

  const openModal = function ({
    op,
    id,
    customerName,
    address,
    eventDate,
    returnedAt,
    isCancelled,
    orderItems
  }) {
    setId(0);
    setCustomerName('');
    setAddress('');
    setEventDate(0.0);
    setReturnedAt(0.0);
    setIsCancelled(false);
    setOrderItems([]);
    setOperation(op);
    if (op === 1) {
      setTitle('Crear Orden');
    } else if (op === 2) {
      setTitle('Editar Orden');
      setId(id);
      setCustomerName(customerName);
      setAddress(address);
      setEventDate(eventDate);
      setReturnedAt(returnedAt);
      setIsCancelled(isCancelled);
      setOrderItems(orderItems);
    };
  };

  const makeRequest = async function ({ method, data, url }) {
    try {
      const response = await axios({
        method, url, data
      });
      showAlert({ message: response.message, icon: 'success' });
      document.getElementById('closeModalButton').click();
      getOrders();
    } catch (error) {
      showAlert({ message: error.message, icon: 'error' })
      console.log(error)
    }
  };

  const sendOrder = async function () {
    switch (operation) {
      case 1:
        await makeRequest({
          method: 'post',
          url: `${url}/order`,
          data: {
            customerName,
            address,
            eventDate,
            returnedAt,
            isCancelled
          }
        });
        break;
      case 2:
        await makeRequest({
          method: 'put',
          url: `${url}/order/${id}`,
          data: {
            customerName,
            address,
            eventDate,
            returnedAt,
            isCancelled
          }
        });
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
        await axios.delete(`${url}/order/${id}`);
        getOrders();
      } else {
        showAlert({ message: 'Orden no eliminada', icon: 'info' });
      }
    });
  };

  useEffect(function () {
    getOrders();
    getItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
                        <td>{order.eventDate}</td>
                        <td>{order.returnedAt}</td>
                        <td>
                          <button onClick={() => openModal({
                            op: 2,
                            id: order.id,
                            customerName: order.customerName,
                            address: order.address,
                            eventDate: order.eventDate,
                            returnedAt: order.returnedAt,
                            orderItems: order.items
                          })}
                            className='btn btn-primary' data-bs-toggle='modal' data-bs-target='#modalOrder'>
                            <i className='fa-solid fa-edit'></i>
                          </button>
                          &nbsp;
                          <button onClick={() => deleteOrder(order.id, order.customerName)} className='btn btn-danger'>
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
          customerName={customerName}
          address={address}
          eventDate={eventDate}
          returnedAt={returnedAt}
          orderItems={orderItems}
          items={items}
          title={title}
          setAddress={setAddress}
          setCustomerName={setCustomerName}
          setEventDate={setEventDate}
          setReturnedAt={setReturnedAt}
          sendOrder={sendOrder}
          setOrderItems={setOrderItems}
        />
      }
    </div>
  )
};
