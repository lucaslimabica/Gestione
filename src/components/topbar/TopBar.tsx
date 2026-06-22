import { ThemeToggler } from '@/components/topbar/ToggleThemeButton';
import Title from '@/components/topbar/Title';
import Clock from '@/components/topbar/Clock';
import LocationAndWeather from '@/components/topbar/LocationAndWeather';
import UserIcon from '@/components/topbar/UserIcon';

const TopBar = () => {
    return (
        <header className="flex items-center justify-between h-14 px-4 text-main bg-surface border-b border-border-main">
            <Title />
            <Clock />
            <LocationAndWeather />
            <UserIcon />
            <ThemeToggler />
        </header>
    );
};

export default TopBar;
