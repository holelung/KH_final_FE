import "./App.css";
import { AuthProvider } from "./Context/AuthContext";
import { Routes, Route } from "react-router-dom";
import Main from "./pages/Home/main/Main";
import Test from "./pages/Home/Test";
import Header from "./pages/include/header/Header";
import Footer from "./pages/include/footer/Footer";
import Navbar from "./pages/include/navbar/Navbar";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/test" element={<Test />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
