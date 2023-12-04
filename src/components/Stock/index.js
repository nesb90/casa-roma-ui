/* eslint-disable eqeqeq */
import React, { useState, useEffect } from "react";
import _ from 'lodash';

import getAxios from "../../common/axios";
import { showAlert } from '../../common';

const emptyItemStock = {
  id: 0,
  itemName: '',
  itemId: 0,
  initialStock: 0,
  total: 0
}

function Stock () {
  const axios = getAxios();
  const [products, setProducts] = useState([])
  const [itemStocks, setItemStocks] = useState([]);
  const [state, setState] = useState({
    myItemStock: _.cloneDeep(emptyItemStock),
    refresh: 0
  });
  const [title, setTitle] = useState('');
  const [operation, setOperation] = useState(1);

  const {
    myItemStock,
    refresh
  } = state;

  const {
    id,
    itemName,
    itemId,
    initialStock,
    total
  } = myItemStock;
  let mappedItemStocks

  if (Array.isArray(itemStocks) && itemStocks.length > 0) {
    mappedItemStocks = itemStocks.map((itemStock) => {
      const itemData = products.find((item) => item.id == itemStock.itemId);
      return {
        id: itemStock.id,
        productName: itemData.name,
        initialStock: itemStock.initialStock,
        total: itemStock.total
      }
    });
  } else {
    mappedItemStocks = [];
  }

  const getItems = async function () {
    const response = await axios.get(`/item`);
    setProducts(response.data);
  };

  const getItemStocks = async function () {
    const response = await axios.get(`/stock`);
    setItemStocks(response.data);
  };

  const openModal = function ({
    op,
    id,
    itemId,
    initialStock,
    total
  }) {
    setOperation(op);
    if (operation === 1) {
      setTitle('Crear Stock');
      setState((s) => ({ ...s, myItemStock: _.cloneDeep(emptyItemStock)}));
    } else if (operation === 2) {
      setTitle('Editar Stock');
      setState((s) => ({
        ...s, myItemStock: {
          id, itemId, initialStock, total
        }
      }));
    };
  };

  const deleteItemStock = async function (id) {
    return;
  };

  useEffect(function () {
    getItems();
    getItemStocks();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refresh]);

  return (
    <div className='container-fluid'>
      <div className='row mt-3'>
        <div className='col-md-4 offset-md-4'>
          <div className='d-grid mx-auto'>
            <button className='btn btn-success' onClick={() => openModal({ op: 1 })} data-bs-toggle='modal' data-bs-target='#modalStock'>
              <i className='fa-solid fa-circle-plus'></i> Crear Stock
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
                  <th>Stock Inicial</th>
                  <th>Stock Actual</th>
                  <th />
                </tr>
              </thead>
              <tbody className='table-group-divider'>
                {
                  mappedItemStocks.map((item, index) => (
                    <tr key={item.id}>
                      <td>{(index + 1)}</td>
                      <td>{item.productName}</td>
                      <td>{item.initialStock}</td>
                      <td>{item.total}</td>
                      <td>
                        <button onClick={() => openModal({
                          op: 2,
                          id: item.id,
                          name: item.productName,
                          description: item.description,
                          rentPrice: item.rentPrice,
                          itemPrice: item.itemPrice
                        })}
                          className='btn btn-primary' data-bs-toggle='modal' data-bs-target='#modalStock'>
                          <i className='fa-solid fa-edit'></i>
                        </button>
                        &nbsp;
                        <button onClick={() => deleteItemStock(item.id, item.name)} className='btn btn-danger'>
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
      {/* <div id='modalStock' className='modal fade' aria-hidden='true'>
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
              <button id='closeModalStock' type='button' className='btn btn-secondary' data-bs-dismiss='modal'>Cerrar</button>
            </div>
          </div>
        </div>
      </div> */}
    </div>
  )

};

export default Stock
