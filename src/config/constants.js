const operations = {
  CREATE: 'CREATE',
  UPDATE: 'UPDATE'
};

const orderStatuses = {
  orderReceived: 'ORDEN_RECIBIDA',
  processingOrder: 'PROCESANDO_ORDEN',
  cancelled: 'ORDEN_CANCELADA',
  completed: 'ORDEN_COMPLETADA'
};


module.exports = {
  operations,
  orderStatuses
};