import axios from 'axios'
const qs = require('qs')
const BASE_URL = "";
// const BASE_URL = "/api";

function isFormData(data) {
	return Object.prototype.toString.call(data) === '[object FormData]';
}

var instance = axios.create({
	baseURL: BASE_URL,
	responseType: 'json',
	transformRequest: (data, headers) => {
		if (isFormData(data)) return data;
		// arrayformat 选项输出 指定数组的格式
		// indices:  { id: ['11', '22'] }  =>  id[0]=11&id[1]=22
		// brackets: { id: ['11', '22'] }  =>  id[]=11&id[]=22
		// repeat:   { id: ['11', '22'] }  =>  id=11&id=22
		return qs.stringify(data, { arrayFormat: 'brackets' });
	}
})

instance.interceptors.request.use((config) => {
	return config;
}, (error) => {
	return Promise.reject(error);
})

instance.interceptors.response.use((response) => {
	return response;
}, (error) => {
	return Promise.reject(error);
})



export {
	instance
}