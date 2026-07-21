import { useEffect } from 'react';
import Chart from 'chart.js/auto';
import { Doughnut, Line, Pie, Bar } from 'react-chartjs-2';
import { getAdminProducts } from '../../actions/productAction';
import { useSelector, useDispatch } from 'react-redux';
import { getAllOrders } from '../../actions/orderAction';
import { getAllUsers } from '../../actions/userAction';
import { categories } from '../../utils/constants';
import MetaData from '../Layouts/MetaData';
import { useNavigate } from 'react-router-dom';
import BarChartIcon from '@mui/icons-material/BarChart';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const MainData = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // CORRECTED: Access state properly based on your store structure
    const { products } = useSelector((state) => state.products || {});
    const { orders } = useSelector((state) => state.allOrders || {});

    // FIX: Users are stored in state.user.users, not state.users
    const { users } = useSelector((state) => state.user || { users: [] });

    // Alternative if you want separate users reducer:
    // const { users } = useSelector((state) => state.users || { users: [] });

    let outOfStock = 0;

    products?.forEach((item) => {
        if (item.stock === 0) {
            outOfStock += 1;
        }
    });

    useEffect(() => {
        dispatch(getAdminProducts());
        dispatch(getAllOrders());
        dispatch(getAllUsers());
    }, [dispatch]);

    let totalAmount = orders?.reduce((total, order) => total + order.totalPrice, 0) || 0;

    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const date = new Date();

    const lineState = {
        labels: months,
        datasets: [
            {
                label: `Sales in ${date.getFullYear() - 2}`,
                borderColor: '#8A39E1',
                backgroundColor: '#8A39E1',
                data: months.map((m, i) =>
                    orders?.filter((od) =>
                        new Date(od.createdAt).getMonth() === i &&
                        new Date(od.createdAt).getFullYear() === date.getFullYear() - 2
                    ).reduce((total, od) => total + od.totalPrice, 0) || 0
                ),
            },
            {
                label: `Sales in ${date.getFullYear() - 1}`,
                borderColor: 'orange',
                backgroundColor: 'orange',
                data: months.map((m, i) =>
                    orders?.filter((od) =>
                        new Date(od.createdAt).getMonth() === i &&
                        new Date(od.createdAt).getFullYear() === date.getFullYear() - 1
                    ).reduce((total, od) => total + od.totalPrice, 0) || 0
                ),
            },
            {
                label: `Sales in ${date.getFullYear()}`,
                borderColor: '#4ade80',
                backgroundColor: '#4ade80',
                data: months.map((m, i) =>
                    orders?.filter((od) =>
                        new Date(od.createdAt).getMonth() === i &&
                        new Date(od.createdAt).getFullYear() === date.getFullYear()
                    ).reduce((total, od) => total + od.totalPrice, 0) || 0
                ),
            },
        ],
    };

    const statuses = ['Processing', 'Shipped', 'Delivered'];

    const pieState = {
        labels: statuses,
        datasets: [
            {
                backgroundColor: ['#9333ea', '#facc15', '#4ade80'],
                hoverBackgroundColor: ['#a855f7', '#fde047', '#86efac'],
                data: statuses.map((status) =>
                    orders?.filter((item) => item.orderStatus === status).length || 0
                ),
            },
        ],
    };

    const doughnutState = {
        labels: ['Out of Stock', 'In Stock'],
        datasets: [
            {
                backgroundColor: ['#ef4444', '#22c55e'],
                hoverBackgroundColor: ['#dc2626', '#16a34a'],
                data: [outOfStock, (products?.length || 0) - outOfStock],
            },
        ],
    };

    const barState = {
        labels: categories,
        datasets: [
            {
                label: "Products",
                borderColor: '#9333ea',
                backgroundColor: '#9333ea',
                hoverBackgroundColor: '#6b21a8',
                data: categories.map((cat) =>
                    products?.filter((item) => item.category === cat).length || 0
                ),
            },
        ],
    };

    return (
        <>
            <MetaData title="Admin Dashboard" />

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-6">
                <div className="flex flex-col text-gray-800 gap-2 rounded-xl shadow-lg hover:shadow-xl p-6" style={{ backgroundColor: '#CFF1E7' }}>
                    <h4 className="text-gray-700 font-medium">Total Sales Amount</h4>
                    <h2 className="text-2xl font-bold">₹{totalAmount?.toLocaleString()}</h2>
                </div>
                <div className="flex flex-col text-gray-800 gap-2 rounded-xl shadow-lg hover:shadow-xl p-6" style={{ backgroundColor: '#DFF5EE' }}>
                    <h4 className="text-gray-700 font-medium">Total Orders</h4>
                    <h2 className="text-2xl font-bold">{orders?.length || 0}</h2>
                </div>
                <div className="flex flex-col text-gray-800 gap-2 rounded-xl shadow-lg hover:shadow-xl p-6" style={{ backgroundColor: '#E0FAF1' }}>
                    <h4 className="text-gray-700 font-medium">Total Products</h4>
                    <h2 className="text-2xl font-bold">{products?.length || 0}</h2>
                </div>
                <div className="flex flex-col text-gray-800 gap-2 rounded-xl shadow-lg hover:shadow-xl p-6" style={{ backgroundColor: '#E6F7F2' }}>
                    <h4 className="text-gray-700 font-medium">Total Users</h4>
                    <h2 className="text-2xl font-bold">{users?.length || 0}</h2>
                </div>
            </div>
            {/* ── Report Section Cards ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2 mb-6">
                {/* Sales Report Card */}
                <button
                    onClick={() => navigate('/admin/product-sales-report')}
                    className="group flex items-center gap-4 p-5 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 bg-gradient-to-br to-indigo-100 border border-blue-200 hover:border-blue-400 hover:scale-[1.02] text-left w-full"
                    style={{ backgroundColor: '#DFF5EE' }}
                >
                    <div className="flex-shrink-0 w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center shadow-md group-hover:bg-blue-700 transition-colors">
                        <BarChartIcon style={{ color: '#fff', fontSize: 28 }} />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-base font-bold mb-0.5">Sales Report</h3>
                        <p className="text-xs leading-snug">Day / Week / Month wise revenue &amp; order analysis with print</p>
                    </div>
                    <ArrowForwardIcon className="text-emerald-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
                </button>

                {/* Product Report Card */}
                <button
                    onClick={() => navigate('/admin/product-report')}
                    className="group flex items-center gap-4 p-5 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 bg-gradient-to-br to-teal-100 border border-emerald-200 hover:border-emerald-400 hover:scale-[1.02] text-left w-full"
                    style={{ backgroundColor: '#DFF5EE' }}
                >
                    <div className="flex-shrink-0 w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center shadow-md group-hover:bg-emerald-700 transition-colors">
                        <Inventory2Icon style={{ color: '#fff', fontSize: 28 }} />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-base font-bold mb-0.5">Product Report</h3>
                        <p className="text-xs leading-snug">Day / Week / Month wise product count table with print</p>
                    </div>
                    <ArrowForwardIcon className="text-emerald-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
                </button>
            </div>

            <div className="flex flex-col sm:flex-row justify-between gap-6 sm:gap-8 min-w-full my-8">
                <div className="bg-white rounded-xl h-auto w-full shadow-lg p-8 sm:p-6">
                    <Line data={lineState} />
                </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between gap-6 sm:gap-8 min-w-full mb-8 mt-6">
                <div className="bg-white rounded-xl h-auto w-full shadow-lg p-8 sm:p-6">
                    <Bar data={barState} />
                </div>
            </div>
        </>
    );
};

export default MainData;