import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import CircleIcon from '@mui/icons-material/Circle';
import { Link } from 'react-router-dom';
import { formatDate } from '../../utils/functions';

const OrderItem = ({ order }) => {

    const { _id, orderStatus, orderItems, totalPrice, createdAt, deliveredAt, shippingPrice } = order;
    const isCancelled = orderStatus === "Cancelled";
    
    const calculateOrderTotal = () => {
        return orderItems.reduce((total, item) => {
            const basePrice = item.price * item.quantity;
            const gstAmount = basePrice * (item.gst || 0) / 100;
            const priceWithGst = basePrice + gstAmount;
            const discountAmount = priceWithGst * (item.quantity > 1 ? (item.discount || 0) : 0) / 100;
            return (total + (priceWithGst - discountAmount))+item.delivery_charge;
        }, 0);
    };

    const content = (
        <div className="flex flex-col p-4 bg-white border rounded hover:shadow-lg gap-4 transition-all duration-300">

            {/* Header: Order ID and Status */}
            <div className="flex justify-between items-center w-full border-b pb-2">
                <div>
                    <span className="text-xs text-gray-500">Order ID: {_id}</span>
                </div>
                <div className="flex items-center gap-1">
                    {orderStatus === "Shipped" ? (
                        <span className="text-primary-orange flex items-center gap-1 text-sm font-medium">
                            <CircleIcon sx={{ fontSize: "12px" }} /> Shipped
                        </span>
                    ) : orderStatus === "Delivered" ? (
                        <span className="text-primary-green flex items-center gap-1 text-sm font-medium">
                            <CircleIcon sx={{ fontSize: "12px" }} /> Delivered
                        </span>
                    ) : orderStatus === "Cancelled" ? (
                        <span className="text-red-600 flex items-center gap-1 text-sm font-medium">
                            <CircleIcon sx={{ fontSize: "12px" }} /> Cancelled
                        </span>
                    ) : (
                        <span className="text-primary-green flex items-center gap-1 text-sm font-medium">
                            <RadioButtonUncheckedIcon sx={{ fontSize: "12px" }} /> {orderStatus}
                        </span>
                    )}
                </div>
            </div>

            {/* Content: List of Items */}
            <div className="flex flex-col gap-3">
                {orderItems.map((item, index) => (
                    <div key={index} className="flex items-start gap-4">
                        {/* Image */}
                        <div className="w-16 h-16 flex-shrink-0">
                            <img draggable="false" className="h-full w-full object-contain" src={item.image} alt={item.name} />
                        </div>

                        {/* Details */}
                        <div className="flex flex-col gap-1 w-full">
                            <p className="text-sm font-medium text-gray-800 line-clamp-2">{item.name}</p>
                            <div className="flex justify-between items-center mt-1">
                                <span className="text-xs text-gray-500">Qty: {item.quantity}</span>
                                <span className="text-sm font-semibold">₹{(() => {
                                    const basePrice = item.price * item.quantity;
                                    const gstAmount = basePrice * (item.gst || 0) / 100;
                                    const priceWithGst = basePrice + gstAmount;
                                    const discountAmount = priceWithGst * (item.quantity > 1 ? (item.discount || 0) : 0) / 100;
                                    return ((priceWithGst - discountAmount)+item.delivery_charge).toLocaleString();
                                })()}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer: Date and Total */}
            <div className="flex justify-between items-center w-full border-t pt-3 mt-1">
                <div className="flex flex-col items-start">
                    {orderStatus === "Delivered" ? (
                        <p className="text-xs text-gray-500">Delivered on {formatDate(deliveredAt)}</p>
                    ) : (
                        <p className="text-xs text-gray-500">Ordered on {formatDate(createdAt)}</p>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">Order Total:</span>
                    <span className="text-lg font-bold text-gray-800">₹{(calculateOrderTotal() + (shippingPrice || 0)).toLocaleString()}</span>
                </div>
            </div>

        </div>
    );

    return isCancelled ? (
        <div className="cursor-not-allowed opacity-75">{content}</div>
    ) : (
        <Link to={`/order_details/${_id}`}>{content}</Link>
    );
};

export default OrderItem;
