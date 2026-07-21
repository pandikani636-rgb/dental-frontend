import { useEffect, useState } from 'react';
import Loader from '../Layouts/Loader';
import { useSnackbar } from 'notistack';
import OrderItem from './OrderItem';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import SearchIcon from '@mui/icons-material/Search';
import MetaData from '../Layouts/MetaData';
import { useDispatch, useSelector } from 'react-redux';
import { clearErrors, myOrders } from '../../actions/orderAction';

const orderStatus = ["Processing", "Shipped", "Delivered", "Cancelled"];
const dt = new Date();
const ordertime = [dt.getMonth(), dt.getFullYear() - 1, dt.getFullYear() - 2];

const MyOrders = () => {
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();

    const { loading, error, orders } = useSelector((state) => state.myOrders);

    const [status, setStatus] = useState("");
    const [orderTime, setOrderTime] = useState(0);
    const [search, setSearch] = useState("");
    const [filteredOrders, setFilteredOrders] = useState([]);

    useEffect(() => {
        if (error) {
            enqueueSnackbar(error, { variant: "error" });
            dispatch(clearErrors());
        }
        dispatch(myOrders());
    }, [dispatch, error, enqueueSnackbar]);

    useEffect(() => {
        if (loading === false) {
            setFilteredOrders(orders);
        }
    }, [orders, loading]);

    useEffect(() => {
        setSearch("");
        if (!orders) return;

        if (!status && +orderTime === 0) {
            setFilteredOrders(orders);
            return;
        }

        if (status && orderTime) {
            if (+orderTime === dt.getMonth()) {
                const filteredArr = orders.filter((order) => order.orderStatus === status &&
                    new Date(order.createdAt).getMonth() === +orderTime
                );
                setFilteredOrders(filteredArr);
            } else {
                const filteredArr = orders.filter((order) => order.orderStatus === status &&
                    new Date(order.createdAt).getFullYear() === +orderTime
                );
                setFilteredOrders(filteredArr);
            }
        } else if (!status) {
            if (+orderTime === dt.getMonth()) {
                const filteredArr = orders.filter((order) =>
                    new Date(order.createdAt).getMonth() === +orderTime
                );
                setFilteredOrders(filteredArr);
            } else {
                const filteredArr = orders.filter((order) =>
                    new Date(order.createdAt).getFullYear() === +orderTime
                );
                setFilteredOrders(filteredArr);
            }
        } else {
            const filteredArr = orders.filter((order) => order.orderStatus === status);
            setFilteredOrders(filteredArr);
        }
        // eslint-disable-next-line
    }, [status, orderTime]);

    const searchOrders = (e) => {
        e.preventDefault();
        if (!search.trim()) {
            enqueueSnackbar("Empty Input", { variant: "warning" });
            return;
        }
        const arr = orders.map((el) => ({
            ...el,
            orderItems: el.orderItems.filter((order) =>
                order.name.toLowerCase().includes(search.toLowerCase()))
        }));
        setFilteredOrders(arr);
    }

    const clearFilters = () => {
        setStatus("");
        setOrderTime(0);
    }

    return (
        <>
            <MetaData title="My Orders | Medical Store" />

            {loading ? <Loader /> : (
                <main className="w-full mt-24 sm:mt-8 bg-gradient-to-br from-green-50 via-white to-blue-50 min-h-screen">

                    {/* <!-- row --> */}
                    <div className="flex gap-3.5 mt-8 sm:mt-12 sm:mx-3 m-auto mb-7 px-4">

                        {/* <!-- sidebar column  --> */}
                        <div className="hidden sm:flex flex-col w-1/5 px-1 mt-9">

                            {/* <!-- nav tiles --> */}
                            <div className="flex flex-col bg-white rounded-lg shadow-lg border border-gray-200">

                                {/* <!-- filters header --> */}
                                <div className="flex items-center justify-between gap-5 px-4 py-4 border-b bg-gradient-to-r from-green-600 to-blue-400 rounded-t-lg">
                                    <p className="text-lg font-medium text-white">Filters</p>
                                    <span onClick={clearFilters} className="text-white hover:text-green-100 font-medium text-sm uppercase cursor-pointer transition-colors duration-300">clear all</span>
                                </div>

                                {/* <!-- order status checkboxes --> */}
                                <div className="flex flex-col py-3 text-sm">
                                    <span className="font-medium px-4">ORDER STATUS</span>

                                    {/* <!-- checkboxes --> */}
                                    <div className="flex flex-col gap-3 px-4 mt-1 pb-3 border-b">
                                        <FormControl>
                                            <RadioGroup
                                                aria-labelledby="orderstatus-radio-buttons-group"
                                                onChange={(e) => setStatus(e.target.value)}
                                                name="orderstatus-radio-buttons"
                                                value={status}
                                            >
                                                {orderStatus.map((el, i) => (
                                                    <FormControlLabel value={el} control={<Radio size="small" />} key={i} label={<span className="text-sm">{el}</span>} />
                                                ))}
                                            </RadioGroup>
                                        </FormControl>
                                    </div>
                                    {/* <!-- checkboxes --> */}

                                </div>
                                {/* <!-- order status checkboxes --> */}

                                {/* <!-- order time checkboxes --> */}
                                <div className="flex flex-col pb-2 text-sm">
                                    <span className="font-medium px-4">ORDER TIME</span>

                                    {/* <!-- checkboxes --> */}
                                    <div className="flex flex-col gap-3 mt-1 px-4 pb-3">
                                        <FormControl>
                                            <RadioGroup
                                                aria-labelledby="ordertime-radio-buttons-group"
                                                onChange={(e) => setOrderTime(e.target.value)}
                                                name="ordertime-radio-buttons"
                                                value={orderTime}
                                            >
                                                {ordertime.map((el, i) => (
                                                    <FormControlLabel value={el} control={<Radio size="small" />} key={i} label={<span className="text-sm">{i === 0 ? "This Month" : el}</span>} />
                                                ))}
                                            </RadioGroup>
                                        </FormControl>
                                    </div>
                                    {/* <!-- checkboxes --> */}

                                </div>
                                {/* <!-- order time checkboxes --> */}

                            </div>
                            {/* <!-- nav tiles --> */}

                        </div>
                        {/* <!-- sidebar column  --> */}

                        {/* <!-- orders column --> */}
                        <div className="flex-1">

                            <div className="flex flex-col gap-3 sm:mr-4 overflow-hidden mt-5">

                                {/* <!-- searchbar --> */}
                                <form onSubmit={searchOrders} className="flex items-center justify-between mx-1 sm:mx-0 sm:w-10/12 bg-white border border-gray-300 rounded-lg hover:shadow-lg mb-6 mt-4 overflow-hidden">
                                    <input value={search} onChange={(e) => setSearch(e.target.value)} type="search" name="search" placeholder="Search your orders here" className="p-3 text-sm outline-none flex-1 rounded-l-lg" />
                                    <button type="submit" className="h-full text-sm px-4 py-3.5 text-white bg-gradient-to-r from-green-600 to-blue-400 hover:from-green-700 hover:to-blue-500 rounded-r-lg flex items-center gap-2 transition-all duration-300">
                                        <SearchIcon sx={{ fontSize: "20px" }} />
                                        <span className="hidden sm:inline">Search Orders</span>
                                    </button>
                                </form>
                                {/* <!-- searchbar --> */}

                                {filteredOrders && filteredOrders.length === 0 && (
                                    <div className="flex items-center flex-col gap-4 p-8 bg-white rounded-lg shadow-lg border border-gray-200">
                                        <img draggable="false" src="https://rukminim1.flixcart.com/www/100/100/promos/23/08/2020/c5f14d2a-2431-4a36-b6cb-8b5b5e283d4f.png" alt="Empty Orders" className="w-24 h-24" />
                                        <span className="text-xl font-semibold text-gray-800">Sorry, no results found</span>
                                        <p className="text-gray-600 text-center">Edit search or clear all filters to see your orders</p>
                                    </div>
                                )}

                                {filteredOrders && filteredOrders.map((order) => {
                                    return (
                                        <OrderItem order={order} key={order._id} />
                                    )
                                }).reverse()}
                            </div>

                        </div>
                        {/* <!-- orders column --> */}
                    </div>
                    {/* <!-- row --> */}

                </main>
            )}
        </>
    );
};

export default MyOrders;
