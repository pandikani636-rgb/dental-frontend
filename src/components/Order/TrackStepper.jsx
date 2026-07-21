import { Step, StepLabel, Stepper } from '@mui/material';
import CircleIcon from '@mui/icons-material/Circle';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import { formatDate } from '../../utils/functions';
import { useEffect, useState } from 'react';

const TrackStepper = ({ activeStep, orderOn, shippedAt, deliveredAt }) => {
    const [animatedStep, setAnimatedStep] = useState(activeStep === 2 ? 1 : 0);

    useEffect(() => {
        if (activeStep === 0) {
            // Processing: stay at ordered
            setAnimatedStep(0);
        } else if (activeStep === 1) {
            // Shipped: animate from ordered to shipped
            setAnimatedStep(0);
            const timer = setTimeout(() => {
                setAnimatedStep(1);
            }, 300);
            return () => clearTimeout(timer);
        } else if (activeStep === 2) {
            // Delivered: start at shipped, animate to delivered
            setAnimatedStep(1);
            const timer = setTimeout(() => {
                setAnimatedStep(2);
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [activeStep]);

    const steps = [
        {
            status: "Ordered",
            dt: formatDate(orderOn),
        },
        {
            status: "Shipped",
            dt: formatDate(shippedAt),
        },
        {
            status: "Delivered",
            dt: formatDate(deliveredAt),
        },
    ];

    const completedIcon = <span className="text-primary-green"><CircleIcon sx={{ fontSize: "16px" }} /></span>;
    const pendingIcon = <span className="text-gray-300"><CircleIcon sx={{ fontSize: "16px" }} /></span>;

    // Calculate truck position - adjust to align with step icons
    const truckPosition = animatedStep === 0 ? 'calc(16.66%)' : animatedStep === 1 ? '50%' : 'calc(83.33%)';

    return (
        <div className="relative px-4 pt-16">
            {/* Animated Truck Icon */}
            <div 
                className="absolute top-0 transition-all duration-[5000ms] ease-in-out z-20"
                style={{ 
                    left: truckPosition,
                    transform: 'translateX(-50%)'
                }}
            >
                <div className="relative">
                    <div className="relative">
                        <LocalShippingIcon 
                            sx={{ fontSize: "40px" }} 
                            className="text-primary-green drop-shadow-lg animate-[wiggle_0.5s_ease-in-out_infinite]"
                        />
                        {/* Realistic smoke effect */}
                        <div className="absolute -bottom-2 -left-4 flex gap-1">
                            <div className="w-3 h-3 bg-gray-400 rounded-full opacity-60 animate-[smoke_1.5s_ease-out_infinite]"></div>
                            <div className="w-2.5 h-2.5 bg-gray-300 rounded-full opacity-50 animate-[smoke_1.5s_ease-out_infinite_0.3s]"></div>
                            <div className="w-2 h-2 bg-gray-200 rounded-full opacity-40 animate-[smoke_1.5s_ease-out_infinite_0.6s]"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Custom styled stepper */}
            <style>{`
                @keyframes wiggle {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    25% { transform: translateY(-2px) rotate(-1deg); }
                    75% { transform: translateY(-1px) rotate(1deg); }
                }
                @keyframes smoke {
                    0% { 
                        transform: translate(0, 0) scale(0.5);
                        opacity: 0.7;
                    }
                    50% {
                        transform: translate(-10px, -5px) scale(1);
                        opacity: 0.4;
                    }
                    100% { 
                        transform: translate(-20px, -10px) scale(1.5);
                        opacity: 0;
                    }
                }
                .MuiStepConnector-root {
                    top: 24px;
                }
                .MuiStepConnector-line {
                    border-color: #e5e7eb !important;
                    border-top-width: 4px !important;
                    border-radius: 2px !important;
                }
                .MuiStepConnector-root.Mui-completed .MuiStepConnector-line,
                .MuiStepConnector-root.Mui-active .MuiStepConnector-line {
                    border-color: #10b981 !important;
                }
            `}</style>

            <Stepper activeStep={activeStep} alternativeLabel>
                {steps.map((item, index) => (
                    <Step
                        key={index}
                        active={activeStep === index ? true : false}
                        completed={activeStep >= index ? true : false}
                    >
                        <StepLabel
                            icon={
                                activeStep >= index ? completedIcon : pendingIcon
                            }
                        >
                            {activeStep >= index ? (
                                <div className="flex flex-col">
                                    <span className="text-primary-green font-semibold">{item.status}</span>
                                    {item.dt !== "Invalid Date" && (
                                        <span className="text-primary-green text-sm">{item.dt}</span>
                                    )}
                                </div>
                            ) : (
                                <span className="text-gray-400 font-medium">{item.status}</span>
                            )}
                        </StepLabel>
                    </Step>
                ))}
            </Stepper>
        </div>
    );
};

export default TrackStepper;
