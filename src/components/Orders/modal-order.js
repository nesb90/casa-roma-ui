import React from 'react';
import { parseCurrency } from '../../common';


const ModalOrder = (props) => {
  const {
    customerName,
    address,
    eventDate,
    returnedAt,
    orderItems,
    title,
    setAddress,
    setCustomerName,
    setEventDate,
    setReturnedAt,
    sendOrder,
    items
  } = props;

  const getDate = (dateString) => {
    if (dateString) {
      return dateString.split('.')[0]
    };
  };

  const mappedOrderItems = orderItems.map(orderItem => {
    const itemData = items.find((item) => item.id === orderItem.itemId);
    return {
      name: itemData.name,
      quantity: orderItem.quantity,
      itemPrice: itemData.itemPrice,
      total: parseCurrency(itemData.itemPrice * orderItem.quantity)
    };
  });

  return (
    <div id='modalOrder' className='modal fade' aria-hidden='true'>
      <div className='modal-dialog' role='document'>
        <div className='modal-content'>
          <div className='modal-header'>
            <label className='h5'>{title}</label>
            <button type='button' className='btn-close' data-bs-dismiss='modal' aria-label='Close'></button>
          </div>
          <div className='modal-body'>
            <input type='hidden' id='id'></input>
            <lable>Nombre del Cliente</lable>
            <div className='input-group mb-3'>
              <span className='input-group-text'><i className='fa-solid fa-user'></i></span>
              <input type='text' id='customerName' className='form-control' placeholder='Nombre del Cliente' value={customerName} onChange={(e) => setCustomerName(e.target.value)}></input>
            </div>
            <lable>Direccion del evento</lable>
            <div className='input-group mb-3'>
              <span className='input-group-text'><i className='fa-solid fa-location-dot'></i></span>
              <input type='text' id='address' className='form-control' placeholder='Direccion del Evento' value={address} onChange={(e) => setAddress(e.target.value)}></input>
            </div>
            <label>Fecha del Evento</label>
            <div className='input-group mb-3'>
              <div className='input-group-text'><i className='fa-solid fa-calendar-days'></i></div>
              <input type='datetime-local' id='eventDate' className='form-control' placeholder='Fecha del Evento' value={getDate(eventDate)} onChange={(e) => setEventDate(e.target.value)}></input>
            </div>
            <label>Fecha de Devolucion</label>
            <div className='input-group mb-3'>
              <span className='input-group-text'><i className='fa-solid fa-calendar-days'></i></span>
              <input type='date' id='returnedAt' className='form-control' placeholder='Fecha de Devolucion' value={getDate(returnedAt)} onChange={(e) => setReturnedAt(e.target.value)}></input>
            </div>
            <label>Productos</label>
            <div className='input-group mb-3'>
              <select className='form-control'>
                <option selected>Seleccionar producto</option>
                {
                  items.map((item) => (
                    <option value={item.id}>{item.name}</option>
                  ))
                }
              </select>
              <div class="input-group-append">
                <button class="btn btn-outline-primary" type='button'>Agregar</button>
              </div>
            </div>
            <div className='input-group mb-3'>
                <table className='table table-striped'>
                  <thead>
                    <tr>
                      <th scope='col'>Producto</th>
                      <th scope='col'>Cantidad</th>
                      <th scope='col'>Precio Unitario</th>
                      <th scope='col'>Total</th>
                    </tr>
                  </thead>
                  <tbody className='table-group-divider'>
                    {
                      mappedOrderItems.map((item) => (
                        <tr>
                          <td>
                            {item.name}
                          </td>
                          <td className="text-end">
                            {item.quantity}
                          </td>
                          <td className="text-end">
                            ${item.itemPrice}
                          </td>
                          <td className="text-end">
                            ${item.total}
                          </td>
                        </tr>
                      ))
                    }
                  </tbody>
                </table>
            </div>
          </div>
          <div className='modal-footer'>
            <button onClick={() => sendOrder()} className='btn btn-success'>
              <i className='fa-solid fa-floppy-disk'></i> Guardar
            </button>
            <button id='closeModalButton' type='button' className='btn btn-secondary' data-bs-dismiss='modal'>Cerrar</button>
          </div>
        </div>
      </div>
    </div>
  )
};

export default ModalOrder
