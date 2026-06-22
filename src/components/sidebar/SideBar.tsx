import { useState } from 'react';
import { PanelLeftClose, PanelRightClose, House } from 'lucide-react'; 

const SideBar = () => {
  	// Storage as opened
	const [isOpen, setIsOpen] = useState(true);

	// Changes to the opposite
  	const toggleSidebar = () => {
    	setIsOpen(!isOpen);
  	};

	return (
    	<div className={`bg-surface sidebar ${isOpen ? 'open' : 'closed'}`}>
	    	{/* Sidebar's header */}
      		<div className="sidebar-header">
        		<h3>{isOpen ? 'Appendix' : 'A'}</h3>
      		</div>
			{/* Toggle button that  works as icon */}
      		<button className="toggle-btn" onClick={toggleSidebar}>
        		{isOpen ? <PanelLeftClose /> : <div><p>Módulos </p><PanelRightClose /></div>}
      		</button>

      		<nav className="sidebar-menu">
        		<ul>
          			<li>
        		    	<a href="/">
        		      		<House />
        		      		{isOpen && <span className="text">Home</span>}
        		    	</a>
        		  	</li>
        		  	<li>
        		    	<a href="#perfil">
        		      		<span className="icon">👤</span>
        		      		{isOpen && <span className="text">Clientes</span>}
        		    	</a>
        		  	</li>
        		  	<li>
        		    	<a href="#configuracoes">
        		      		<span className="icon">⚙️</span>
        		      		{isOpen && <span className="text">Definições</span>}
        		    	</a>
        		  	</li>
        		</ul>
      		</nav>
    	</div>
  	);
};

export default SideBar;