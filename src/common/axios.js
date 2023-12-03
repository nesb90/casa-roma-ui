import axios from 'axios';

import { SERVER } from '../config';

function getAxios () {
  const instance = axios.create({
    baseURL: `${SERVER.url}${SERVER.apiPath}`
  });

  return instance
};
export default getAxios;
