/* eslint-disable eqeqeq */
import React, { useState } from 'react';
import { parseCurrency } from '../../common';

function ModalOrder (props) {
  const [selectedItem, setSelectItem] = useState('');
  const [quantity, setQuantity] = useState('');

  let {
    myOrder,
    products,
    title,
    sendOrder,
    operation,
    createOrderItem,
    setState,
    makeRequest
  } = props;
  let {
    id: orderId,
    customerName,
    address,
    eventDate,
    returnedAt,
    isCancelled,
    items
  } = myOrder
  let orderTotal = 0
  let mappedOrderItems

  if (Array.isArray(items) && items.length > 0) {
    mappedOrderItems = items.map((orderItem) => {
      const itemData = products.find((item) => item.id == orderItem.itemId);
      return {
        id: orderItem.id,
        name: itemData.name,
        quantity: orderItem.quantity,
        itemPrice: itemData.itemPrice,
        total: itemData.itemPrice * orderItem.quantity
      };
    });
  } else {
    mappedOrderItems = [];
  }

  const getOrderTotal = () => {
    let total = mappedOrderItems.reduce((acc, curr) => {
      return acc + curr.total;
    }, orderTotal);

    return Number(total).toFixed(2);
  };

  const getDate = (dateString) => {
    if (dateString) {
      return dateString.split('.')[0]
    };
    return '';
  };

  const addItem = async () => {
    const data = {
      itemId: selectedItem,
      quantity
    };
    const productData = products.find((prod) => prod.id === parseInt(selectedItem));
    if (operation === 2) {
      data.orderId = orderId
      const result = await createOrderItem({
        data
      });
      data.id = result.id;
    };

    mappedOrderItems.push({
      name: productData.name,
      quantity: quantity,
      itemPrice: productData.itemPrice,
      total: parseCurrency(productData.itemPrice * quantity)
    });
    items.push(data);
    setState((s) => ({
      ...s,
      myOrder: {
        ...myOrder,
        items
      }
    }));
    document.getElementById('item-list').selectedIndex = 0;
    setSelectItem('');
    setQuantity('');
  };

  const saveOrder = () => {
    sendOrder();
    document.getElementById('item-list').selectedIndex = 0;
    setSelectItem('');
    setQuantity('');
  }

  const deleteOrderItem = async ({ itemId, itemIndex }) => {
    if (operation === 2) {
      await makeRequest({
        method: 'delete',
        url: `/order-item/${(itemId)}`,
        closeModal: false
      });

      mappedOrderItems = mappedOrderItems.filter((item) => item.id !== parseInt(itemId));
      items = items.filter((item) => item.id !== parseInt(itemId));
    } else {
      mappedOrderItems = mappedOrderItems.filter((item, index) => index !== itemIndex);
      items = items.filter((item, index) => index !== itemIndex);
    };
    myOrder.items = items
    setState((s) => ({
      ...s, myOrder
    }))
  };

  const setCustomerName = (data) => {
    myOrder.customerName = data
    setState((s) => ({
      ...s, myOrder
    }));
  };

  const setAddress = (data) => {
    myOrder.address = data
    setState((s) => ({
      ...s, myOrder
    }));
  };

  const setEventDate = (data) => {
    myOrder.eventDate = data
    setState((s) => ({
      ...s, myOrder
    }));
  };

  const setReturnedAt = (data) => {
    myOrder.returnedAt = data
    setState((s) => ({
      ...s, myOrder
    }));
  };

  return (
    <div id='modalOrder' className='modal fade' aria-hidden='true'>
      <div className='modal-dialog modal-lg' role='document'>
        <div className='modal-content'>
          <div className='modal-header'>
            <label className='h5'>{title}</label>
            <button type='button' className='btn-close' data-bs-dismiss='modal' aria-label='Close'></button>
          </div>
          <div className='modal-body'>
            <input type='hidden' id='id'></input>
            <label>Nombre del Cliente</label>
            <div className='input-group mb-3'>
              <span className='input-group-text'><i className='fa-solid fa-user'></i></span>
              <input disabled={isCancelled || !!returnedAt} type='text' id='customerName' className='form-control' placeholder='Nombre del Cliente' value={customerName} onChange={(e) => setCustomerName(e.target.value)}></input>
            </div>
            <label>Direccion de evento</label>
            <div className='input-group mb-3'>
              <span className='input-group-text'><i className='fa-solid fa-location-dot'></i></span>
              <input disabled={isCancelled || !!returnedAt} type='text' id='address' className='form-control' placeholder='Direccion del Evento' value={address} onChange={(e) => setAddress(e.target.value)}></input>
            </div>
            <label>Fecha del Evento</label>
            <div className='input-group mb-3'>
              <span className='input-group-text'><i className='fa-solid fa-calendar-days'></i></span>
              <input disabled={isCancelled || !!returnedAt} type='datetime-local' id='eventDate' className='form-control' placeholder='Fecha del Evento' value={getDate(eventDate)} onChange={(e) => setEventDate(e.target.value)}></input>
            </div>
            <label>Fecha de Devolucion</label>
            <div className='input-group mb-3'>
              <span className='input-group-text'><i className='fa-solid fa-calendar-days'></i></span>
              <input disabled={operation === 1 || isCancelled || !!returnedAt} type='datetime-local' id='returnedAt' className='form-control' placeholder='Fecha de Devolucion' value={getDate(returnedAt)} onChange={(e) => setReturnedAt(e.target.value)}></input>
            </div>
            <label>Productos</label>
            <div className='input-group mb-3'>
              <select disabled={isCancelled || !!returnedAt} id='item-list' className='form-control' onChange={(e) => setSelectItem(e.target.value)}>
                <option>Seleccionar producto</option>
                {
                  products.map((i) => (
                    <option key={i.name} value={i.id}>{i.name}</option>
                  ))
                }
              </select>
              <input disabled={isCancelled || !!returnedAt} type='number' className='form-control' placeholder='Cantidad' value={quantity} onChange={(e) => setQuantity(e.target.value)}></input>
              <button disabled={isCancelled || !!returnedAt} className="btn btn-outline-primary" type='button' onClick={() => addItem()}>Agregar</button>
            </div>
            <div className='input-group mb-3'>
              <table className='table table-striped table-bordered'>
                <thead>
                  <tr>
                    <th scope='col' className='text-center'>Producto</th>
                    <th scope='col' className='text-center'>Cantidad</th>
                    <th scope='col' className='text-center'>Precio Unitario</th>
                    <th scope='col' className='text-center'>Total</th>
                    <th />
                  </tr>
                </thead>
                <tbody className='table-group-divider'>
                  {
                    mappedOrderItems.map((item, index) => (
                      <tr>
                        <td>
                          {item.name}
                        </td>
                        <td className="text-center">
                          {item.quantity}
                        </td>
                        <td className="text-end">
                          ${parseCurrency(item.itemPrice)}
                        </td>
                        <td className="text-end">
                          ${parseCurrency(item.total)}
                        </td>
                        <td className='text-center'>
                          <button disabled={isCancelled || !!returnedAt} onClick={() => deleteOrderItem({ itemId: item.id, itemIndex: index })} className='btn btn-danger'>
                            <i className='fa-solid fa-trash'></i>
                          </button>
                        </td>
                      </tr>))
                  }
                </tbody>
                <tfoot className='table-group-divider'>
                  <tr>
                    <td colSpan={3} className='text-end'>Total</td>
                    <td className='text-end'>${getOrderTotal()}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
          <div className='modal-footer'>
            <button disabled={isCancelled} onClick={() => saveOrder()} className='btn btn-success'>
              <i className='fa-solid fa-floppy-disk'></i> Guardar
            </button>
            <button id='closeModalOrder' type='button' className='btn btn-secondary' data-bs-dismiss='modal'>Cerrar</button>
          </div>
        </div>
      </div>
    </div>
  )
};

export default ModalOrder
