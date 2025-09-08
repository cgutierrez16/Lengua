import "./global.css";
import "./App.css";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { Helmet } from "react-helmet";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Home } from "./pages/home";
import { Lyrics } from "./pages/lyrics";
import { Freewrite } from "./pages/freewrite";
import { About } from "./pages/about"
import { Navbar } from "./components/navbar";

function App() {
  return (
    <div className="App montserrat base">
      <Helmet>
        <style>{"body { background-color: #FFFFF0; }"}</style>
      </Helmet>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/lyrics" element={<Lyrics />} />
          <Route path="/write" element={<Freewrite />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
