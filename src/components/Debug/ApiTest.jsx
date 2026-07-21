import { useEffect, useState } from 'react';
import axios from 'axios';

const ApiTest = () => {
    const [status, setStatus] = useState('Testing...');
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const testApi = async () => {
            try {
                const response = await axios.get('/api/v1/products');
                setStatus('API Connected ✅');
                setProducts(response.data.products || []);
            } catch (error) {
                setStatus(`API Error: ${error.message} ❌`);
                console.error('API Test Error:', error);
            }
        };
        testApi();
    }, []);

    return (
        <div className="p-4 bg-gray-100 m-4 rounded">
            <h3>API Status: {status}</h3>
            <p>Products found: {products.length}</p>
        </div>
    );
};

export default ApiTest;