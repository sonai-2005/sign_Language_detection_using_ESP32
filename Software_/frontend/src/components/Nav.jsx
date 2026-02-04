import { Link,NavLink } from "react-router-dom";   
import { FiSettings } from "react-icons/fi"; 
export default function Nav() {
  return (
    <>
      <div className="grid place-items-center h-16 
                      text-xl font-medium 
                      bg-gray-100 text-gray-800 
                      dark:bg-gray-900 dark:text-gray-200">
        SIGNSPEAK
      </div>

      <ul className="nav nav-pills p-4 justify-content-center">

        <li className="nav-item">
          <NavLink className="nav-link" to="/">Home</NavLink>
        </li>

        <li className="nav-item">
          <NavLink className="nav-link" to="/member">Members</NavLink>
        </li>

        <li className="nav-item">
          <NavLink className="nav-link" to="/chat">chat</NavLink>
        </li>

        <li className="nav-item">
          <NavLink className="nav-link" to="/about">About</NavLink>
        </li>
        
    
        <li className="nav-item">
          <NavLink className="nav-link" to="/settings"><FiSettings size={20}/></NavLink>
        </li>
      </ul>
    </>
  );
}
