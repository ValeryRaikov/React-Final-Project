import { useEffect } from 'react';
import Navbar from "./components/navbar/Navbar";
import Admin from "./components/admin/Admin";

function App() {
    // Scroll to top when location (page) changes
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);

    return (
        <>
            <Navbar />
            <Admin />
        </>
    );
}

export default App
