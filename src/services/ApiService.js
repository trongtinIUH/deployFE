import axios from 'axios';

const API_BASE_URL = 'https://ade7-109-237-64-222.ngrok-free.app/api';

const ApiService = {
    post: async (url, data) => {
        try {
            const response = await axios.post(`${API_BASE_URL}${url}`, data);
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : error;
        }
    },
};

export default ApiService;
