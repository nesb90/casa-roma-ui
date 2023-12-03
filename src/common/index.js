import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

export function parseCurrency (amount) {
  return Number(new Intl.NumberFormat('es-MX').format(amount)).toFixed(2);
};

export function showAlert(options = {}) {
  const  {
    message, focus
  } = options
  onFocus(focus)
  const alert = withReactContent(Swal);
  return alert.fire({
    title: message,
    ...options
  });
};

function onFocus (focus = '') {
  if (focus !== '') {
    document.getElementById(focus).focus();
  }
};