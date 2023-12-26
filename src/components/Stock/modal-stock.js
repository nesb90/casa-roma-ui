/* eslint-disable eqeqeq */
import React, { useState } from "react";
import _ from "lodash";

import { operations } from "../../config/constants";

const modalId = 'closeModalStock'

function ModalStock(props) {
  const {
    title,
    myItemStock,
    operation,
    products,
    setState,
    makeRequest,
    productsInStock,
    emptyItemStock,
    refresh
  } = props

  const {
    id,
    productName,
    initialStock,
    total,
  } = myItemStock

  const [selectedItem, setSelectItem] = useState('');
  const [updateQuantity, setUpdateQuantity] = useState('');

  const filteredProducts = products.filter((product) => !productsInStock.includes(product.id))

  const setInitialStock = function (data) {
    myItemStock.initialStock = data;
    myItemStock.total = data;
    setState((s) => ({ ...s, myItemStock }));
  };

  const setTotal = function (data) {
    myItemStock.total = data;
    setState((s) => ({ ...s, myItemStock }));
  };

  const addToTotal = async function () {
    const newTotal = parseInt(total) + parseInt(updateQuantity);
    setState((s) => ({
      ...s,
      myItemStock: {
        ...myItemStock,
        total: newTotal
      }
    }));
    setUpdateQuantity('');
    await update(newTotal);
  };

  const subtractToTotal = async function () {
    const newTotal = parseInt(total) - parseInt(updateQuantity)
    setState((s) => ({
      ...s,
      myItemStock: {
        ...myItemStock,
        total: newTotal
      }
    }));
    setUpdateQuantity('');
    await update(newTotal);

  };

  const update = async function (newTotal) {
    const data = {
      total: newTotal
    };

    await makeRequest({
      method: 'put',
      data,
      url: `/stock/${id}`
    });

    setState((s) => ({ ...s, refresh: refresh + 1 }));
  };

  const save = async function () {
    const data = {
      total
    };

    data.itemId = selectedItem;
    data.initialStock = initialStock;

    await makeRequest({
      method: 'post',
      data,
      url: '/stock',
      alertResult: true,
      closeModal: true,
      modalId
    });

    setState((s) => ({ myItemStock: _.cloneDeep(emptyItemStock), refresh: refresh + 1 }));

    document.getElementById('item-list').selectedIndex = 0;
  };

  return (
    <div id='modalStock' className='modal fade' aria-hidden='true'>
      <div className='modal-dialog'>
        <div className='modal-content'>
          <div className='modal-header'>
            <label className='h5'>{title}</label>
            <button type='button' className='btn-close' data-bs-dismiss='modal' aria-label='Close'></button>
          </div>
          <div className='modal-body'>
            <label>Nombre de Producto</label>
            <div className='input-group mb-3' hidden={operation == operations.CREATE}>
              <span className='input-group-text'><i className='fa-solid fa-bars'></i></span>
              <input type='text' id='name' className='form-control' placeholder='Nombre de Producto' defaultValue={productName} disabled={operation == 2}></input>
            </div>
            <div className='input-group mb-3' hidden={operation != operations.CREATE}>
              <select id='item-list' className='form-control' onChange={(e) => setSelectItem(e.target.value)}>
                <option>Seleccionar producto</option>
                {
                  filteredProducts.map((i) => (
                    <option key={i.name} value={i.id}>{i.name}</option>
                  ))
                }
              </select>
            </div>
            <label>Stock Inicial</label>
            <div className='input-group mb-3'>
              <span className='input-group-text'><i className='fa-solid fa-hashtag'></i></span>
              <input type='number' id='description' className='form-control' placeholder='Stock Inicial' value={initialStock} disabled={operation == operations.UPDATE} onChange={(e) => setInitialStock(e.target.value)}></input>
            </div>
            <label>Stock Actual</label>
            <div className='input-group mb-3'>
              <span className='input-group-text'><i className='fa-solid fa-hashtag'></i></span>
              <input type='number' id='rentPrice' className='form-control' placeholder='Stock Actual' value={total} disabled={true} onChange={(e) => setTotal(e.target.value)}></input>
            </div>
            <div hidden={operation == operations.CREATE}>
              <label>Agregar o Quitar</label>
              <div className='input-group mb-3'>
                <input type='number' className='form-control' placeholder='Cantidad' value={updateQuantity} onChange={(e) => setUpdateQuantity(e.target.value)}></input>
                <button className="btn btn-outline-primary" type='button' disabled={!updateQuantity} onClick={() => addToTotal()}>Agregar</button>
                <button className="btn btn-outline-danger" type='button' disabled={!updateQuantity} onClick={() => subtractToTotal()}>Quitar</button>
              </div>
            </div>
          </div>
          <div className='modal-footer'>
            <button onClick={() => save()} className='btn btn-success' hidden={operation != operations.CREATE}><i className='fa-solid fa-floppy-disk'></i> Guardar</button>
            <button id={modalId} type='button' className='btn btn-secondary' data-bs-dismiss='modal'>Cerrar</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalStock;
