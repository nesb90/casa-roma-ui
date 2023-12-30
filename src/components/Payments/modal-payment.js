import React from "react";

import { parseCurrency } from "../../common";

function ModalPayment(props) {
  const {
    title,
    myPayment,
    makeRequest,
    setState
  } = props;

  const {
    orderId,
    amount,
    payConcept,
    payments,
    currentBalance,
    orderTotal
  } = myPayment;
  let totalPayments

  if (Array.isArray(payments) && payments.length > 0) {
    const total = payments.reduce((acc, curr) => acc + curr.amount, 0);
    totalPayments = Number(total).toFixed(2);
  } else {
    totalPayments = parseCurrency(0);
  };

  const deletePayment = async function ({ paymentId, paymentIndex }) {
    if (paymentId) {
      await makeRequest({
        method: 'delete',
        url: `/payment/${paymentId}`,
        closeModal: false
      });
    };
    const paymentDeleted = payments.find((paymentId, index) => index === paymentIndex );
    myPayment.currentBalance = currentBalance + paymentDeleted.amount;
    myPayment.payments = payments.filter((payment, index) => index !== paymentIndex);

    setState((s) => ({
      ...s,
      myPayment
    }))
  };

  const setPayConcept = function (data) {
    myPayment.payConcept = data;
    setState((s) => ({ ...s, myPayment }));
  };

  const setAmount = function (data) {
    myPayment.amount = data;
    setState((s) => ({ ...s, myPayment }));
  };

  const savePayment = async function () {
    await makeRequest({
      method: 'post',
      url: '/payment',
      data: {
        orderId,
        amount,
        payConcept
      },
      closeModal: false
    });

    myPayment.payments.push({ amount: Number(amount), payConcept });
    myPayment.currentBalance = currentBalance - Number(amount);

    setState((s) => ({
      ...s,
      myPayment: {
        ...myPayment,
        amount: '',
        payConcept: ''
      }
    }));
  };

  return (
    <div id='modalPayment' className='modal fade' aria-hidden='true'>
      <div className='modal-dialog modal-md' role='document'>
        <div className='modal-content'>
          <div className='modal-header'>
            <label className='h5'>{title}</label>
            <button type='button' className='btn-close' data-bs-dismiss='modal' aria-label='Close'></button>
          </div>
          <div className='modal-body'>
            <div className="input-group mb-3">
              <span className="input-group-text">Total a pagar</span>
              <input className="form-control text-end" type="text" value={`$${parseCurrency(orderTotal)}`} readOnly></input>
              <span className="input-group-text">Saldo Actual</span>
              <input className="form-control text-end" type="text" value={`$${parseCurrency(currentBalance)}`} readOnly></input>
            </div>
            <h6>Agregar Pago</h6>
            <div className='input-group mb-3'>
              <span className='input-group-text'><i className='fa-solid fa-dollar-sign'></i></span>
              <input type='number' id='customerName' className='form-control' placeholder='Cantidad' value={amount} onChange={(e) => setAmount(e.target.value)}></input>
            </div>
            <div className='input-group mb-3'>
              <span className='input-group-text'><i className='fa-solid fa-bars'></i></span>
              <input type='text' id='address' className='form-control' placeholder='Concepto de pago' value={payConcept} onChange={(e) => setPayConcept(e.target.value)}></input>
              <button disabled={!amount || !payConcept} onClick={() => savePayment()} className='btn btn-outline-success' type="button">
              <i className='fa-solid fa-plus'></i> Agregar Pago
            </button>
            </div>
            <h6>Historial de Pagos</h6>
            <div className='input-group mb-3'>
              <table className='table table-striped table-bordered'>
                <thead>
                  <tr>
                    <th className='text-center'>#</th>
                    <th className='text-center'>Concepto</th>
                    <th className='text-center'>Cantidad</th>
                    <th />
                  </tr>
                </thead>
                <tbody className='table-group-divider'>
                  {
                    payments.map((payment, index) => (
                      <tr>
                        <td className="text-center">
                          {index + 1}
                        </td>
                        <td>
                          {payment.payConcept}
                        </td>
                        <td className="text-end">
                          ${parseCurrency(payment.amount)}
                        </td>
                        <td className='text-center'>
                          <button onClick={() => deletePayment({ paymentId: payment.id, paymentIndex: index })} className='btn btn-danger'>
                            <i className='fa-solid fa-trash'></i>
                          </button>
                        </td>
                      </tr>))
                  }
                </tbody>
                <tfoot className='table-group-divider'>
                  <tr>
                    <td colSpan={2} className='text-end'>Total</td>
                    <td className='text-end'>${totalPayments}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
          <div className='modal-footer'>
            <button id='closeModalPayment' type='button' className='btn btn-secondary' data-bs-dismiss='modal'>Cerrar</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalPayment;
