import axios from 'axios';

export const api = axios.create({
  baseURL: '/api', 
  headers: {
    'Authorization': `Basic ${process.env.NEXT_PUBLIC_BASIC_AUTH}`,
    'Content-Type': 'application/json',
  }
});