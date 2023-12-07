/* eslint-disable eqeqeq */
import React, { useState } from "react";

function ModalStock(props) {
  const {
    title,
    myItemStock,
    operation,
    products,
    setState,
    sendStock,
    productsInStock
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

  const addToTotal = function () {
    setState((s) => ({
      ...s,
      myItemStock: {
        ...myItemStock,
        total: parseInt(total) + parseInt(updateQuantity)
      }
    }));

    setUpdateQuantity('');
  };

  const subtractToTotal = function () {
    setState((s) => ({
      ...s,
      myItemStock: {
        ...myItemStock,
        total: parseInt(total) - parseInt(updateQuantity)
      }
    }));
    setUpdateQuantity('');
  };

  const save = async function () {
    const data = {
      total
    };

    if (operation == 2) {
      await sendStock({
        method: 'put',
        data,
        url: `/stock/${id}`,
        closeModal: false
      });

    } else {
      data.itemId = selectedItem;
      data.initialStock = initialStock;

      await sendStock({
        method: 'post',
        data,
        url: '/stock'
      });
    };
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
            <input type='hidden' id='id'></input>
            <label>Nombre de Producto</label>
            <div className='input-group mb-3' hidden={operation == 1}>
              <span className='input-group-text'><i className='fa-solid fa-bars'></i></span>
              <input type='text' id='name' className='form-control' placeholder='Nombre de Producto' value={productName} disabled={operation == 2}></input>
            </div>
            <div className='input-group mb-3' hidden={operation != 1}>
              <select id='item-list' className='form-control' onChange={(e) => setSelectItem(e.target.value)}>
                <option selected>Seleccionar producto</option>
                {
                  filteredProducts.map((i) => (
                    <option value={i.id}>{i.name}</option>
                  ))
                }
              </select>
            </div>
            <label>Stock Inicial</label>
            <div className='input-group mb-3'>
              <span className='input-group-text'><i className='fa-solid fa-hashtag'></i></span>
              <input type='text' id='description' className='form-control' placeholder='Stock Inicial' value={initialStock} disabled={operation == 2} onChange={(e) => setInitialStock(e.target.value)}></input>
            </div>
            <label>Stock Actual</label>
            <div className='input-group mb-3'>
              <span className='input-group-text'><i className='fa-solid fa-hashtag'></i></span>
              <input type='number' id='rentPrice' className='form-control' placeholder='Stock Actual' value={total} disabled={true} onChange={(e) => setTotal(e.target.value)}></input>
            </div>
            <div hidden={operation == 1}>
              <label>Agregar o Quitar</label>
              <div className='input-group mb-3'>
                <button className="btn btn-outline-danger" type='button' onClick={() => subtractToTotal()}>Quitar</button>
                <input type='number' className='form-control' placeholder='Cantidad' value={updateQuantity} onChange={(e) => setUpdateQuantity(e.target.value)}></input>
                <button className="btn btn-outline-primary" type='button' onClick={() => addToTotal()}>Agregar</button>
              </div>
            </div>
          </div>
          <div className='modal-footer'>
            <button onClick={() => save()} className='btn btn-success'><i className='fa-solid fa-floppy-disk'></i> Guardar</button>
            <button id='closeModalStock' type='button' className='btn btn-secondary' data-bs-dismiss='modal'>Cerrar</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalStock;
