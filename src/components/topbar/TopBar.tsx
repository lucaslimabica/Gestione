import { ThemeToggler } from '@/components/topbar/ToggleThemeButton';
import Title from '@/components/topbar/Title';
import Clock from '@/components/topbar/Clock';
import LocationAndWeather from '@/components/topbar/LocationAndWeather';
import UserIcon from '@/components/topbar/UserIcon';
import NavBar from '@/components/topbar/NavBar';

const TopBar = () => {
    return (
        <header className='felx-col px-4 pt-2.5 text-main bg-surface border-b border-border-main'>
            <div className="flex items-center justify-between">
                <Title />
                <Clock />
                <LocationAndWeather />
                {/* <UserIcon /> */}
                <ThemeToggler />
            </div>
            <div className='pt-2.5 pb-2'>
                <NavBar />
            </div>
        </header>
    );
};

export default TopBar;
