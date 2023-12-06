import React, { useEffect, useState } from 'react';

import getAxios from '../../common/axios'
import { showAlert, parseCurrency } from '../../common';
import _ from 'lodash';

const emptyItem = {
  id: 0,
  name: '',
  description: '',
  rentPrice: '',
  itemPrice: '',
}

function Items() {
  const axios = getAxios();

  const [items, setItems] = useState([]);
  const [state, setState] = useState({
    myItem: _.cloneDeep(emptyItem),
    refresh: 0
  });
  const [operation, setOperation] = useState(1);
  const [title, setTitle] = useState('');

  const {
    myItem,
    refresh
  } = state

  const {
    id,
    name,
    description,
    rentPrice,
    itemPrice
  } = myItem

  const getItems = async function () {
    const response = await axios.get(`/item`);
    setItems(response.data);
  };

  const makeRequest = async function ({ method, data, url, closeModal = true }) {
    try {
      const response = await axios.request({
        method, data, url
      });

      showAlert({ message: response.data.message, icon: 'success' });
      if (closeModal) {
        document.getElementById('closeModalItem').click();
      }

      return response.data;
    } catch (error) {
      const { message } = error.response.data;
      showAlert({ message, icon: 'error' })
      console.log(error)
    }
  };

  const sendItems = async function () {
    switch (operation) {
      case 1:
        await makeRequest({
          method: 'post',
          url: `/item`,
          data: {
            name,
            description,
            rentPrice,
            itemPrice
          }
        });

        setState((s) => ({
          ...s,
          myItem: _.cloneDeep(emptyItem),
          refresh: refresh + 1
        }));
        break;
      case 2:
        await makeRequest({
          method: 'put',
          url: `/item/${id}`,
          data: {
            name,
            description,
            rentPrice,
            itemPrice
          }
        });

        setState((s) => ({
          ...s,
          myItem: _.cloneDeep(emptyItem),
          refresh: refresh + 1
        }));
        break;
      default:
        break;
    }
  };

  const deleteItem = function (id, name) {
    showAlert({
      message: `¿Seguro de eliminar ${name}?`,
      icon: 'question',
      text: 'Esta accion no se puede revertir',
      showCancelButton: true,
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        await axios.delete(`/item/${id}`);
        getItems();
      } else {
        showAlert({ message: 'Producto no eliminado', icon: 'info' });
      }
    });
  };

  const openModal = function ({
    op,
    id,
    name,
    description,
    rentPrice,
    itemPrice
  }) {
    setOperation(op);
    if (op === 1) {
      setTitle('Agregar Producto');
      setState((s) => ({
        myItem: _.cloneDeep(emptyItem)
      }));
    } else if (op === 2) {
      setTitle('Editar Producto');
      setState((s) => ({
        myItem: {
          id, name, description, rentPrice, itemPrice
        }
      }))
    }
  };

  const setName = (data) => {
    myItem.name = data
    setState((s) => ({
      ...s, myItem
    }));
  };

  const setDescription = (data) => {
    myItem.description = data
    setState((s) => ({
      ...s, myItem
    }));
  };

  const setRentPrice = (data) => {
    myItem.rentPrice = data
    setState((s) => ({
      ...s, myItem
    }));
  };

  const setItemPrice = (data) => {
    myItem.itemPrice = data
    setState((s) => ({
      ...s, myItem
    }));
  };

  useEffect(function () {
    getItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refresh]);

  return (
    <div className='container-fluid'>
      <div className='row mt-3'>
        <div className='col-12 col-lg-8 offset-0 offset-lg-2'>
          <div className='row'>
            <div className='col'>
              <h3>Productos</h3>
            </div>
            <div className='col text-end'>
            <button className='btn btn-success' onClick={() => openModal({ op: 1 })} data-bs-toggle='modal' data-bs-target='#modalItem'>
              <i className='fa-solid fa-circle-plus'></i> Crear Producto
            </button>
            </div>
          </div>
        </div>
      </div>
      <div className='row mt-3'>
        <div className='col-12 col-lg-8 offset-0 offset-lg-2'>
          <div className='table-responsive'>
            <table className='table table-bordered table-striped'>
              <thead>
                <tr className="text-center">
                  <th>#</th>
                  <th>Producto</th>
                  <th>Descripcion</th>
                  <th>Precio de Renta</th>
                  <th>Precio de Compra</th>
                  <th />
                </tr>
              </thead>
              <tbody className='table-group-divider'>
                {
                  items.map((item, index) => (
                    <tr key={item.id}>
                      <td className="text-center">{(index + 1)}</td>
                      <td>{item.name}</td>
                      <td>{item.description}</td>
                      <td className="text-end">${parseCurrency(item.rentPrice)}</td>
                      <td className="text-end">${parseCurrency(item.itemPrice)}</td>
                      <td className="text-center">
                        <button onClick={() => openModal({
                          op: 2,
                          id: item.id,
                          name: item.name,
                          description: item.description,
                          rentPrice: item.rentPrice,
                          itemPrice: item.itemPrice
                        })}
                          className='btn btn-primary' data-bs-toggle='modal' data-bs-target='#modalItem'>
                          <i className='fa-solid fa-edit'></i>
                        </button>
                        &nbsp;
                        <button onClick={() => deleteItem(item.id, item.name)} className='btn btn-danger'>
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
      <div id='modalItem' className='modal fade' aria-hidden='true'>
        <div className='modal-dialog'>
          <div className='modal-content'>
            <div className='modal-header'>
              <label className='h5'>{title}</label>
              <button type='button' className='btn-close' data-bs-dismiss='modal' aria-label='Close'></button>
            </div>
            <div className='modal-body'>
              <input type='hidden' id='id'></input>
              <label>Nombre de Producto</label>
              <div className='input-group mb-3'>
                <span className='input-group-text'><i className='fa-solid fa-bars'></i></span>
                <input type='text' id='name' className='form-control' placeholder='Nombre de Producto' value={name} onChange={(e) => setName(e.target.value)}></input>
              </div>
              <label>Descripcion</label>
              <div className='input-group mb-3'>
                <span className='input-group-text'><i className='fa-solid fa-bars'></i></span>
                <input type='text' id='description' className='form-control' placeholder='Descripcion' value={description} onChange={(e) => setDescription(e.target.value)}></input>
              </div>
              <label>Precio de Renta</label>
              <div className='input-group mb-3'>
                <span className='input-group-text'><i className='fa-solid fa-dollar-sign'></i></span>
                <input type='number' id='rentPrice' className='form-control' placeholder='Precio De Renta' value={rentPrice} onChange={(e) => setRentPrice(e.target.value)}></input>
              </div>
              <label>Precio de Compra</label>
              <div className='input-group mb-3'>
                <span className='input-group-text'><i className='fa-solid fa-dollar-sign'></i></span>
                <input type='number' id='itemPrice' className='form-control' placeholder='Precio de Compra' value={itemPrice} onChange={(e) => setItemPrice(e.target.value)}></input>
              </div>
            </div>
            <div className='modal-footer'>
              <button onClick={() => sendItems()} className='btn btn-success'><i className='fa-solid fa-floppy-disk'></i> Guardar</button>
              <button id='closeModalItem' type='button' className='btn btn-secondary' data-bs-dismiss='modal'>Cerrar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Items