import deliveryImg from '../../assets/images/Home/delivery.svg';

const HomeDelivery = () => {
    const steps = [
        { title: 'Order Confirmed', desc: 'We verify and process orders carefully.', step: '1' },
        { title: 'Packed Securely', desc: 'Items are packed to maintain integrity during transit.', step: '2' },
        { title: 'Delivered Fast', desc: 'Quick doorstep delivery with tracking updates.', step: '3' }
    ];

    return (
        <section className="bg-white rounded-2xl shadow-sm p-6 mt-6">
            <div className="flex items-center gap-3 mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Our Delivery Process</h2>
                {/* <p className="text-sm text-gray-500">How your order gets to you safely</p> */}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {steps.map((s, i) => (
                    <div key={i} className="p-4 bg-gray-50 rounded-lg border border-dental-100 hover:shadow-md transition-shadow text-center">

                        <img src={deliveryImg} alt={s.title} className="mx-auto w-16 h-16 mb-3" />
                        <h3 className="font-semibold text-gray-900">{s.title}</h3>
                        <p className="text-xs text-gray-600 mt-1">{s.desc}</p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default HomeDelivery;