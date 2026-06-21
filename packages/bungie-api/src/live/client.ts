import axios from 'axios';

export const bungieClient = axios.create({
    baseURL: 'https://www.bungie.net/Platform',
    timeout: 10000,
});