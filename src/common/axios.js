import axios from 'axios';

import { SERVER } from '../config';
import { showAlert } from '.';

function getAxios () {
  const instance = axios.create({
    baseURL: `${SERVER.url}${SERVER.apiPath}`
  });

  return instance
};

async function makeRequest ({ method, data, url, closeModal = false, modalId, alertResult = false }) {
  try {
    const axiosInstance = getAxios()
    const response = await axiosInstance.request({
      method, data, url
    });

    if (alertResult) {
      showAlert({ message: response.data.message, icon: 'success' });
    };
    if (closeModal) {
      document.getElementById(modalId).click();
    };

    return response.data;
  } catch (error) {
    const { message } = error.response.data;
    showAlert({ message, icon: 'error' })
    console.log(error)
  }
};

export {
  getAxios,
  makeRequest
};
