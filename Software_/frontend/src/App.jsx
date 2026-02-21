import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";

import Nav from "./components/Nav";
import Result from "./components/Result";
import Footer from "./components/Footer";
import Settings from "./pages/Settings";
import Member from "./pages/Member";
import About from "./pages/About";
const WS_URL = "ws://10.94.95.92:5000/";

//const WS_URL = "ws://192.168.0.108:5000/";
function Home() {
  const [fingers, setFingers] = useState({
    thumb: 0,
    index: 0,
    middle: 0,
    ring: 0,
    little: 0,
  });

    useEffect(() => {
    let ws;

    const connect = () => {
      ws = new WebSocket(WS_URL);

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        setFingers((prev) => ({ ...prev, ...data }));
      };
    };

    connect();

    return () => ws?.close();
  }, []);
  
  
 


  return <Result fingers={fingers} />;
}

function App() {
  return (
    <>
      <Nav />

      <Routes>
        {/* homepage */}
        <Route path="/" element={<Home />} />

        {/* other pages */}
        <Route path="/member" element={<Member />} />
        <Route path="/about" element={<About />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>

      <Footer />
    </>
  );
}

export default App;
