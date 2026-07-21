import { useSelector } from 'react-redux';
import CheckIcon from '@mui/icons-material/Check';

const Stepper = ({ activeStep, children }) => {

    const { user } = useSelector((state) => state.user);
    const { shippingInfo, cartItems } = useSelector((state) => state.cart);

    const address = `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.state} - ${shippingInfo.pincode}`;

    const steps = [
        {
            label: "LOGIN",
            desc: <p className="font-medium text-sm">{user.name} <span className="text-sm font-normal">{user.email}</span></p>
        },
        {
            label: "DELIVERY ADDRESS",
            desc: <p className="font-medium text-sm">{user.name} <span className="text-sm font-normal">{address}</span></p>
        },
        {
            label: "ORDER SUMMARY",
            desc: <p className="font-medium text-sm">{cartItems.length} Item</p>
        },
        {
            label: "PAYMENT OPTIONS",
            desc: <p className="font-medium text-sm">Paytm</p>
        }
    ]

    return (
        <div className="flex flex-col gap-4">
            {steps.map((step, index) => (
                activeStep === index && (
                    <div className="flex flex-col shadow rounded-xl">
                        <div className="flex items-center rounded-t-xl bg-dental-600 px-6 py-3 gap-4">
                            <span className="h-5 w-5 flex items-center justify-center text-xs font-semibold bg-white rounded-md text-dental-600">{index + 1}</span>
                            <h2 className="font-medium text-white">{step.label}</h2>
                        </div>
                        {children}
                    </div>
                )
            ))}
        </div>
    );
};

const Step = ({ isDesc, label, desc, index }) => {
    return (
        <div className="flex bg-white shadow px-4 py-3 pb-4 rounded-xl">
            <span className="mt-2 ml-2 mr-4 h-5 w-5 flex items-center justify-center text-xs font-semibold bg-gray-100 rounded-md text-dental-600">{index + 1}</span>
            <div className="flex flex-col mt-1 gap-0.5">
                <h2 className="font-medium text-gray-500 flex items-center gap-2">{label}
                    {isDesc && (
                        <span className="text-dental-600 mb-1"><CheckIcon sx={{ fontSize: "20px" }} /></span>
                    )}
                </h2>
                {isDesc && desc}
            </div>
        </div>
    )
}

export default Stepper;
