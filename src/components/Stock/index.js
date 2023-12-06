/* eslint-disable eqeqeq */
import React, { useState, useEffect } from "react";
import _ from 'lodash';

import getAxios from "../../common/axios";
import { showAlert } from '../../common';
import ModalStock from "./modal-stock";

const emptyItemStock = {
  id: 0,
  itemId: 0,
  productName: '',
  initialStock: 0,
  total: 0
}

function Stock() {
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
        total: itemStock.total
      };
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

  const makeRequest = async function ({ method, data, url, closeModal = true }) {
    try {
      const response = await axios.request({
        method, data, url
      });

      showAlert({ message: response.data.message, icon: 'success' });
      if (closeModal) {
        document.getElementById('closeModalStock').click();
      }

      return response.data;
    } catch (error) {
      const { message } = error.response.data;
      showAlert({ message, icon: 'error' })
      console.log(error)
    }
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

  const sendStock = async function ({
    method,
    data,
    url,
    closeModal
  }) {
    await makeRequest({
      method,
      data,
      url,
      closeModal
    });

    if (operation == 2) {
      setState((s) => ({ ...s, refresh: refresh + 1 }));
    } else {
      setState((s) => ({ myItemStock: _.cloneDeep(emptyItemStock), refresh: refresh + 1 }));
    }
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
      <ModalStock
        title={title}
        myItemStock={myItemStock}
        products={products}
        setState={setState}
        operation={operation}
        refresh={refresh}
        sendStock={sendStock}
        productsInStock={productsInStock}
      />
    </div>
  )

};

export default Stock
