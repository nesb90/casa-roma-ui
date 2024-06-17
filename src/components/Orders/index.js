import React, { useEffect, useState } from 'react';
import _ from 'lodash';

import { showAlert } from '../../common';
import { makeRequest } from '../../common/axios';
import { ORDER_STATUSES, operations } from '../../config/constants';

import TableTools from './table-tools';
import OrdersTable from './orders-table';
import ModalOrder from './modal-order';
import ModalPayment from '../Payments/modal-payment';

const emptyOrder = {
  id: 0,
  customerName: '',
  address: '',
  eventDate: '',
  status: '',
  returnedAt: '',
  escrow: '',
  items: []
}
const emptyPayment = {
  currentBalance: '',
  orderTotal: '',
  orderId: 0,
  amount: '',
  payConcept: '',
  payments: []
};
const defaultFilter = 'Todas'

const modalId = 'closeModalOrder';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [operation, setOperation] = useState(1);
  const [title, setTitle] = useState('');
  const [products, setProducts] = useState([]); // products = db items
  const [filter, setFilter] = useState(defaultFilter);
  const [state, setState] = useState({
    myPayment: _.cloneDeep(emptyPayment),
    myOrder: _.cloneDeep(emptyOrder),
    refresh: 0
  });

  const getOrderId = function (databaseId) {
    return `CRE-${databaseId.toLocaleString('es-MX', {
      minimumIntegerDigits: 7,
      useGrouping: false
    })}`;
  };

  const { myOrder, refresh, myPayment } = state;

  let {
    id,
    customerName,
    address,
    eventDate,
    returnedAt,
    items
  } = myOrder;

  const getOrdersUrl = function () {
    let url = '/order';
    if (filter !== defaultFilter) {
      url = url.concat(`?status=${filter}`);
    };

    return url
  };

  const getOrders = async function () {
    const response = await makeRequest({ url: getOrdersUrl(), method: 'get' });
    setOrders(response);
  };

  const getProducts = async function () {
    const response = await makeRequest({ url: `/item`, method: 'get' });
    setProducts(response);
  };

  const getPayments = async function (orderId) {
    const response = await makeRequest({ url: `/order-payment/${orderId}`, method: 'get' });
    myPayment.currentBalance = response.currentBalance;
    myPayment.orderTotal = response.orderTotal;
    myPayment.payments = response.payments || [];
    setState((s) => ({
      ...s, myPayment
    }));
  };

  const openModal = async function ({
    op,
    id,
    customerName,
    address,
    eventDate,
    returnedAt,
    status,
    escrow,
    items
  }) {
    await getProducts();
    setOperation(op);
    if (op === operations.CREATE) {
      setTitle('Crear Orden');
      setState((s) => ({ ...s, myOrder: _.cloneDeep(emptyOrder) }));
    } else if (op === operations.UPDATE) {
      setTitle('Editar Orden');
      setState((s) => ({
        ...s,
        myOrder: {
          id,
          customerName,
          address,
          eventDate,
          status,
          returnedAt,
          escrow,
          items
        }
      }
      ));
    };
  };

  const createOrderItem = async ({
    method = 'post',
    data,
    url = '/order-item'
  }) => {
    return await makeRequest({
      method,
      data,
      url,
      alertResult: true
    });
  };

  const sendOrder = async function () {
    if (operation === operations.CREATE) {
      await makeRequest({
        method: 'post',
        url: '/order',
        data: {
          customerName, address, eventDate, status: ORDER_STATUSES.RECEIVED, items
        },
        alertResult: true,
        closeModal: true,
        modalId
      });

      setState((s) => ({
        ...s,
        myOrder: _.cloneDeep(emptyOrder),
        refresh: refresh + 1
      }));
    } else if (operation === operations.UPDATE) {
      await makeRequest({
        method: 'put',
        url: `/order/${id}`,
        data: { customerName, address, eventDate, returnedAt },
        alertResult: true,
        closeModal: true,
        modalId
      });

      setState((s) => ({
        ...s, myOrder: _.cloneDeep(emptyOrder),
        refresh: refresh + 1
      }));
    };
  };

  const deleteOrder = function (id) {
    showAlert({
      message: `¿Seguro de eliminar la orden ${getOrderId(id)}?`,
      icon: 'question',
      text: 'Esta acción no se puede revertir',
      showCancelButton: true,
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        await makeRequest({ url: `/order/${id}`, method: 'delete' });
        setState((s) => ({ ...s, refresh: refresh + 1 }));
      } else {
        showAlert({ message: 'Orden no eliminada', icon: 'info' });
      }
    });
  };

  const cancelOrder = function (id) {
    showAlert({
      message: `¿Seguro de cancelar la orden ${getOrderId(id)}?`,
      icon: 'question',
      text: 'Esta acción no se puede revertir',
      showCancelButton: true,
      confirmButtonText: 'Si, cancelar',
      cancelButtonText: 'Salir'
    }).then(async (result) => {
      if (result.isConfirmed) {
        await makeRequest({
          method: 'put',
          data: {
            status: ORDER_STATUSES.CANCELLED
          },
          url: `/order/${id}`
        });
        setState((s) => ({ ...s, refresh: refresh + 1 }));
      } else {
        showAlert({ message: 'Orden no cancelada', icon: 'info' });
      }
    });
  };

  const parseDate = function (date) {
    if (date) {
      const dateWithoutMilliseconds = date.split('.')[0];
      const parsedDate = new Date(dateWithoutMilliseconds);
      return `${parsedDate.toLocaleDateString('es-MX')} ${parsedDate.toLocaleTimeString('es-MX')}`;
    }
    return '';
  };

  const openPaymentModal = async function (orderId) {
    setTitle('Pagos');
    await getPayments(orderId);
    myPayment.orderId = orderId;
    setState((s) => ({
      ...s, myPayment
    }))
  };

  const getDefaultFilter = function () {
    return defaultFilter;
  };

  const isCancelled = function (orderStatus = '') {
    return orderStatus === ORDER_STATUSES.CANCELLED;
  };
  const isCompleted = function(orderStatus = '') {
    return orderStatus === ORDER_STATUSES.COMPLETED
  };

  useEffect(function () {
    getOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refresh]);

  return (
    <div className='container-fluid'>
      <div className='row mt-3'>
        <div className='col'>
          <div className='row'>
            <div className='col'>
              <h3>Ordenes</h3>
            </div>
            <div className='col text-end'>
              <button className='btn btn-success' onClick={() => openModal({ op: operations.CREATE })} data-bs-toggle='modal' data-bs-target='#modalOrder'>
                <i className='fa-solid fa-circle-plus'></i> Crear Orden
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className='row mt-3'>
        <TableTools
          getDefaultFilter={getDefaultFilter}
          setFilter={setFilter}
          setState={setState}
          refresh={refresh}
        />
      </div>
      <div className='row mt-3'>
        <OrdersTable
          getOrderId={getOrderId}
          parseDate={parseDate}
          openModal={openModal}
          openPaymentModal={openPaymentModal}
          cancelOrder={cancelOrder}
          deleteOrder={deleteOrder}
          orders={orders}
          isCancelled={isCancelled}
          isCompleted={isCompleted}
        />
      </div>
      <div>
        <ModalOrder
          myOrder={myOrder}
          products={products}
          title={title}
          sendOrder={sendOrder}
          operation={operation}
          createOrderItem={createOrderItem}
          makeRequest={makeRequest}
          isCancelled={isCancelled}
          isCompleted={isCompleted}
          setState={setState} />
        <ModalPayment
          title={title}
          myPayment={myPayment}
          makeRequest={makeRequest}
          setState={setState}
          refresh={refresh} />
      </div>
    </div>
  )
};

export default Orders
