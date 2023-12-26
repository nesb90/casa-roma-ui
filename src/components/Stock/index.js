/* eslint-disable eqeqeq */
import React, { useState, useEffect } from "react";
import _ from 'lodash';

import { makeRequest } from "../../common/axios";
import { showAlert } from "../../common";
import ModalStock from "./modal-stock";

const emptyItemStock = {
  id: 0,
  itemId: 0,
  productName: '',
  initialStock: '',
  total: 0
}

function Stock() {
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

  let mappedItemStocks;
  let productsInStock = [];
  if (Array.isArray(itemStocks) && itemStocks.length > 0) {
    mappedItemStocks = itemStocks.map((itemStock) => {
      const productData = products.find((item) => item.id == itemStock.itemId);
      productsInStock.push(productData.id);
      return {
        id: itemStock.id,
        productName: productData.name,
        productId: productData.id,
        initialStock: itemStock.initialStock,
        total: itemStock.total,
        availableStock: itemStock.availableStock,
        rented: itemStock.total - itemStock.availableStock
      };
    });
  } else {
    mappedItemStocks = [];
  }

  const getItems = async function () {
    const response = await makeRequest({
      method: 'get',
      url: `/item`
    });
    setProducts(response);
  };

  const getItemStocks = async function () {
    const response = await makeRequest({
      method: 'get',
      url: `/stock`
    });
    setItemStocks(response);
  };

  const openModal = function ({
    op,
    id,
    itemId,
    productName,
    initialStock,
    total
  }) {
    setOperation(op);
    if (op === 1) {
      setTitle('Crear Stock');
      setState((s) => ({ ...s, myItemStock: _.cloneDeep(emptyItemStock) }));
    } else if (op === 2) {
      setTitle('Editar Stock');
      setState((s) => ({
        ...s, myItemStock: {
          id, itemId, productName, initialStock, total
        }
      }));
    };
  };

  const deleteItemStock = async function (id, item) {
    showAlert({
      message: `¿Seguro de eliminar Stock para el producto: ${item}?`,
      icon: 'question',
      text: 'Esta accion no se puede revertir',
      showCancelButton: true,
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        await makeRequest({ url: `/stock/${id}`, method: 'delete' });
        setState((s) => ({ ...s, refresh: refresh + 1 }));
      } else {
        showAlert({ message: 'Orden no eliminada', icon: 'info' });
      }
    });
  };

  useEffect(function () {
    getItems();
    getItemStocks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refresh]);

  return (
    <div className='container-fluid'>
      <div className='row mt-3'>
        <div className='col-12 col-lg-8 offset-0 offset-lg-2'>
          <div className='row'>
            <div className='col'>
              <h3>Inventario</h3>
            </div>
            <div className='col text-end'>
              <button className='btn btn-success' onClick={() => openModal({ op: 1 })} data-bs-toggle='modal' data-bs-target='#modalStock'>
                <i className='fa-solid fa-circle-plus'></i> Crear Stock
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
                  <th>Stock Inicial</th>
                  <th>Stock Actual</th>
                  <th>Stock Disponible</th>
                  <th>Rentado</th>
                  <th />
                </tr>
              </thead>
              <tbody className='table-group-divider'>
                {
                  mappedItemStocks.map((item, index) => (
                    <tr key={item.id}>
                      <td className="text-center">{(index + 1)}</td>
                      <td>{item.productName}</td>
                      <td className="text-center">{item.initialStock}</td>
                      <td className="text-center">{item.total}</td>
                      <td className="text-center">{item.availableStock}</td>
                      <td className="text-center">{item.rented}</td>
                      <td className="text-center">
                        <button onClick={() => openModal({
                          op: 2,
                          id: item.id,
                          productName: item.productName,
                          initialStock: item.initialStock,
                          total: item.total
                        })}
                          className='btn btn-primary' data-bs-toggle='modal' data-bs-target='#modalStock'>
                          <i className='fa-solid fa-edit'></i>
                        </button>
                        &nbsp;
                        <button onClick={() => deleteItemStock(item.id, item.productName)} className='btn btn-danger'>
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
      <ModalStock
        title={title}
        myItemStock={myItemStock}
        products={products}
        setState={setState}
        operation={operation}
        refresh={refresh}
        makeRequest={makeRequest}
        productsInStock={productsInStock}
        emptyItemStock={emptyItemStock}
      />
    </div>
  )

};

export default Stock
