import { Outlet } from 'react-router-dom';
import TopBar from '@/components/topbar/TopBar';

export function App() {
    return (
        <div className="flex flex-col min-h-screen text-main"> {/* Flex=col to make one above other */}
            {/* TopBar with 100% of the width */}
            <TopBar />
            {/* The Page (with SideBar at left) */}
            <div className="flex flex-auto">
                <main className="flex-1 p-6 overflow-y-auto bg-base"> {/* Outlet fills the rest */}
                    <Outlet /> 
                </main>
            </div>
        </div>
    );
}