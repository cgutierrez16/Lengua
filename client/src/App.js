import "./global.css";
import "./App.css";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { Helmet } from "react-helmet";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Home } from "./pages/home";
import { Lyrics } from "./pages/lyrics";
import { Freewrite } from "./pages/freewrite";
import { About } from "./pages/about";
import { Navbar } from "./components/navbar";
import { Login } from "./pages/login";
import { Signup } from "./pages/signup";
import { AuthProvider, useAuth } from "./AuthContext";
import { Stats } from "./pages/stats";
import { Dashboard } from "./pages/dashboard";
import { LyricsGate } from "./pages/lyricsGate";
import { FreewriteGate } from "./pages/freewriteGate";
import { StatsGate } from "./pages/statsGate";

// Separate component so it can safely call useAuth inside AuthProvider
const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={user ? <Dashboard /> : <Home />} />
        <Route path="/lyrics" element={user ? <Lyrics /> : <LyricsGate />} />
        <Route
          path="/write"
          element={user ? <Freewrite /> : <FreewriteGate />}
        />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/stats" element={user ? <Stats /> : <StatsGate/> } />
      </Routes>
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <div className="App montserrat base">
        <Helmet>
          <style>{"body { background-color: #FFFFF0; }"}</style>
        </Helmet>
        <Router>
          <AppRoutes />
        </Router>
      </div>
    </AuthProvider>
  );
}

export default App;
