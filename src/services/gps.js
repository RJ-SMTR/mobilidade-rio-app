import axios from "axios";
let baseURL = '';
if (window.location.hostname === 'mobilidade.rio') {
    baseURL = 'https://api.mobilidade.rio/predictor/'
} else if (window.location.hostname === 'app.staging.mobilidade.rio') {
    baseURL = 'https://api.staging.mobilidade.rio/predictor/'
} else if (window.location.hostname === 'localhost') {
    baseURL = 'https://api.staging.mobilidade.rio/predictor/'
}


export const gps = axios.create({ baseURL })