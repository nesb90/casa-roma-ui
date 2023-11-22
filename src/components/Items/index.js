import React, { useEffect, useState } from 'react';
import axios from 'axios';

import { SERVER } from '../../config';

import { showAlert, parseCurrency } from '../../common';

function Items() {
  const url = `${SERVER.url}${SERVER.apiPath}`;
  const [items, setItems] = useState([]);
  const [id, setId] = useState(0);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [rentPrice, setRentPrice] = useState(0.0);
  const [itemPrice, setItemPrice] = useState(0.0);
  const [operation, setOperation] = useState(1);
  const [title, setTitle] = useState('');

  const getItems = async function () {
    const response = await axios.get(`${url}/item`);
    setItems(response.data);
  };

  const makeRequest = async function ({ method, data, url }) {
    try {
      const response = await axios({
        method, url, data
      });
      showAlert({ message: response.message, icon: 'success' });
      document.getElementById('closeModalButton').click();
      getItems();
    } catch (error) {
      showAlert({ message: error.message, icon: 'error' })
      console.log(error)
    }
  };

  const sendItems = async function () {
    switch (operation) {
      case 1:
        await makeRequest({
          method: 'post',
          url: `${url}/item`,
          data: {
            name,
            description,
            rentPrice,
            itemPrice
          }
        });
        break;
      case 2:
        await makeRequest({
          method: 'put',
          url: `${url}/item/${id}`,
          data: {
            name,
            description,
            rentPrice,
            itemPrice
          }
        });
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
      if(result.isConfirmed) {
        await axios.delete(`${url}/item/${id}`);
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
    setId(0);
    setName('');
    setDescription('');
    setRentPrice(0.0);
    setItemPrice(0.0);
    setOperation(op);
    if (op === 1) {
      setTitle('Agregar Producto');
    } else if (op === 2) {
      setTitle('Editar Producto');
      setId(id);
      setName(name);
      setDescription(description);
      setRentPrice(rentPrice);
      setItemPrice(itemPrice);
    }
  };

  useEffect(function () {
    getItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className='App'>
      <div className='container-fluid'>
        <div className='row mt-3'>
          <div className='col-md-4 offset-md-4'>
            <div className='d-grid mx-auto'>
              <button className='btn btn-success' onClick={() => openModal({ op: 1 })} data-bs-toggle='modal' data-bs-target='#modalItem'>
                <i className='fa-solid fa-circle-plus'></i> Añadir
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
                        <td>{(index + 1)}</td>
                        <td>{item.name}</td>
                        <td>{item.description}</td>
                        <td>${parseCurrency(item.rentPrice)}</td>
                        <td>${parseCurrency(item.itemPrice)}</td>
                        <td>
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
              <div className='input-group mb-3'>
                <span className='input-group-text'><i className='fa-solid fa-bars'></i></span>
                <input type='text' id='name' className='form-control' placeholder='Nombre' value={name} onChange={(e) => setName(e.target.value)}></input>
              </div>
              <div className='input-group mb-3'>
                <span className='input-group-text'><i className='fa-solid fa-bars'></i></span>
                <input type='text' id='description' className='form-control' placeholder='Descripcion' value={description} onChange={(e) => setDescription(e.target.value)}></input>
              </div>
              <div className='input-group mb-3'>
                <span className='input-group-text'><i className='fa-solid fa-dollar-sign'></i></span>
                <input type='number' id='rentPrice' className='form-control' placeholder='Precio De Renta' value={rentPrice} onChange={(e) => setRentPrice(e.target.value)}></input>
              </div>
              <div className='input-group mb-3'>
                <span className='input-group-text'><i className='fa-solid fa-dollar-sign'></i></span>
                <input type='number' id='itemPrice' className='form-control' placeholder='Precio de Compra' value={itemPrice} onChange={(e) => setItemPrice(e.target.value)}></input>
              </div>
              <div className='d-grid col-6 mx-auto'>
                <button onClick={() => sendItems()} className='btn btn-success'>
                  <i className='fa-solid fa-floppy-disk'></i> Guardar
                </button>
              </div>
            </div>
            <div className='modal-footer'>
              <button id='closeModalButton' type='button' className='btn btn-secondary' data-bs-dismiss='modal'>Cerrar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Items