import "../css/navbar.css";
import Logo from "../Images/Logo/Logo.png"
export default function Nav(){
    return (
        <nav className="navbar">
            <div className="logo">
                <img src={Logo} alt=""/>
            </div>

            <ul>
                <li className="active">Home</li>
                <li>Rentals</li>
                <li>Sales</li>
                <li>Contacts</li>
            </ul>
        </nav>
    )
}