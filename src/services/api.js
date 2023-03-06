import axios from "axios";
let baseURL = '';
if (window.location.hostname === 'mobilidade.rio') {
    baseURL = 'https://api.mobilidade.rio/gtfs'
} else if (window.location.hostname === 'app.staging.mobilidade.rio') {
    baseURL = 'https://api.staging.mobilidade.rio/gtfs'
} else if(window.location.hostname === 'localhost') {
    baseURL = 'https://api.dev.mobilidade.rio/gtfs'
}


export const api =  axios.create({baseURL})