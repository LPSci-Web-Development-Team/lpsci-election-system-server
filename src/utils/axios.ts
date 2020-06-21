// ANCHOR Axios
import axios, { AxiosRequestConfig } from 'axios';

const instance = axios.create();

export function GET(url: string, config?: AxiosRequestConfig) {
  return instance.get(url, config);
}

export function POST(url: string, data?: any, config?: AxiosRequestConfig) {
  return instance.post(url, data, config);
}

export function PUT(url: string, data?: any, config?: AxiosRequestConfig) {
  return instance.put(url, data, config);
}

export function PATCH(url: string, data?: any, config?: AxiosRequestConfig) {
  return instance.patch(url, data, config);
}

export function DELETE(url: string, config?: AxiosRequestConfig) {
  return instance.delete(url, config);
}
