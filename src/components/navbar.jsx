import "../css/navbar.css";
export default function Nav(){
    return (
        <nav className="navbar">
            <div className="logo">

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