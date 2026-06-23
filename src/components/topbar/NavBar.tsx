import { Car, House, IdCardLanyard, BanknoteArrowDown, BanknoteArrowUp, Calendar1 } from 'lucide-react'; 

export const NavBar = () => {
    // Lista de links para deixar o código limpo e fácil de manter
    const navLinks = [
        { href: "/", icon: <House className="h-5 w-5" />, label: "Início" },
        { href: "/frota", icon: <Car className="h-5 w-5" />, label: "Frota" },
        { href: "/documentos", icon: <IdCardLanyard className="h-5 w-5" />, label: "Documentos" },
        { href: "/entradas", icon: <BanknoteArrowDown className="h-5 w-5" />, label: "Entradas" },
        { href: "/saidas", icon: <BanknoteArrowUp className="h-5 w-5" />, label: "Saídas" },
        { href: "/calendario", icon: <Calendar1 className="h-5 w-5" />, label: "Calendário" },
    ];

    return (
        <nav className="">
                {/* Links for nav */}
                <div className='flex items-center justify-between'>
                    {navLinks.map((link) => (
                        <a
                            key={link.href}
                            href={link.href}
                            title={link.label}
                            className="group relative flex items-center gap-x-2 rounded-xl px-3 text-main-300 transition-all duration-200 hover:bg-base/5 hover:text-muted"
                        >
                            {/* icon */}
                            <div className="transition-transform duration-200 group-hover:scale-110">
                                {link.icon}
                            </div>
                            <span className="hidden md:inline text-sm font-medium">
                                {link.label}
                            </span>
                        </a>
                    ))}
                </div>
        </nav>
    );
};

export default NavBar;