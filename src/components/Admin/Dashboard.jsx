import { useEffect, useState } from 'react';
import Sidebar from './Sidebar/Sidebar';
import MenuIcon from '@mui/icons-material/Menu';

const Dashboard = ({ activeTab, children }) => {

    const [onMobile, setOnMobile] = useState(false);
    const [toggleSidebar, setToggleSidebar] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setOnMobile(window.innerWidth < 768);
        };
        
        checkMobile();
        window.addEventListener('resize', checkMobile);
        
        return () => window.removeEventListener('resize', checkMobile);
    }, [])

    return (
        <>
            <main className="flex min-h-screen min-w-full relative">

                {!onMobile && <Sidebar activeTab={activeTab} />}
                {toggleSidebar && (
                    <>
                        <div 
                            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" 
                            onClick={() => setToggleSidebar(false)}
                        />
                        <Sidebar activeTab={activeTab} setToggleSidebar={setToggleSidebar}/>
                    </>
                )}

                <div className="w-full md:w-4/5 md:ml-72 min-h-screen">
                    <div className="flex flex-col gap-responsive p-responsive pb-6 overflow-hidden">
                        <button 
                            onClick={() => setToggleSidebar(true)} 
                            className="md:hidden bg-gray-700 w-12 h-12 rounded-full shadow-lg text-white flex items-center justify-center touch-friendly hover:bg-gray-600 transition-colors"
                            aria-label="Open sidebar menu"
                        >
                            <MenuIcon />
                        </button>
                        <div className="mobile-content">
                            {children}
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
};

export default Dashboard;