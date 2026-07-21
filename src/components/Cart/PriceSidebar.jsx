const PriceSidebar = ({ cartItems, orderStatus }) => {
    // Calculate all values
    const totalPrice = cartItems.reduce((sum, item) => {
        const basePrice = item.price * item.quantity;
        const gst = (basePrice * (item.gst || 0)) / 100;
        return sum + basePrice + gst;
    }, 0);

    const totalDiscount = cartItems.reduce((sum, item) => {
        const basePrice = item.price * item.quantity;
        const gst = (basePrice * (item.gst || 0)) / 100;
        const priceWithGst = basePrice + gst;
        const discount = (priceWithGst * (item.quantity > 1 ? (item.discount || 0) : 0)) / 100;
        return sum + discount;
    }, 0);

    const totalDelivery = cartItems.reduce((sum, item) => sum + (item.delivery_charge || 0), 0);

    const totalAmount = totalPrice - totalDiscount + totalDelivery;

    return (
        <div className="sticky top-24">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
                <div style={{ backgroundColor: '#D6F4ED' }} className="px-4 sm:px-6 py-4">
                    <h2 className="font-semibold text-lg sm:text-xl text-gray-800 flex items-center justify-between gap-2">
                        <span>Price Summary</span>
                        {orderStatus && (
                            <span className={`text-sm px-2 py-1 rounded-full ${orderStatus === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                    orderStatus === 'Processing' ? 'bg-blue-100 text-blue-800' :
                                        'bg-gray-100 text-gray-800'
                                }`}>
                                {orderStatus}
                            </span>
                        )}
                    </h2>
                </div>

                <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                    <div className="flex justify-between items-center py-2">
                        <span className="text-sm sm:text-base text-gray-600">Price ({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})</span>
                        <span className="font-semibold text-sm sm:text-base">₹{totalPrice.toLocaleString()}</span>
                    </div>

                    <div className="flex justify-between items-center py-2">
                        <span className="text-sm sm:text-base text-gray-600">Discount</span>
                        <span className="font-semibold text-green-600 text-sm sm:text-base">
                            - ₹{totalDiscount.toLocaleString()}
                            <span className="text-xs text-gray-500 ml-2">({cartItems.map(item => `${item.quantity > 1 ? (item.discount || 0) : 0}%`).join(' + ')})</span>
                        </span>
                    </div>

                    <div className="flex justify-between items-center py-2">
                        <span className="text-sm sm:text-base text-gray-600">Delivery Charges</span>
                        <span className="font-semibold text-orange-600 text-sm sm:text-base">
                            ₹{totalDelivery.toLocaleString()}
                            <span className="text-xs text-gray-500 ml-2">({cartItems.map(item => `₹${item.delivery_charge || 0}`).join(' + ')})</span>
                        </span>
                    </div>

                    <div className="border-t border-dashed border-gray-300 my-3 sm:my-4"></div>

                    <div className="flex justify-between items-center py-2 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg px-3 sm:px-4 py-3">
                        <span className="text-base sm:text-lg font-bold text-gray-800">Total Amount</span>
                        <span className="text-xl sm:text-2xl font-bold text-green-600">₹{totalAmount.toLocaleString()}</span>
                    </div>

                    <div className="border-t border-dashed border-gray-300 my-3 sm:my-4"></div>

                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4 text-center">
                        <p className="font-semibold text-green-700 flex items-center justify-center gap-2 text-sm sm:text-base">
                            🎉 You save ₹{totalDiscount.toLocaleString()} on this order!
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PriceSidebar;