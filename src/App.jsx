import "./App.css";
import { AuthProvider } from "./Context/AuthContext";
import { Routes, Route } from "react-router-dom";
import Authenticator from "./pages/auth/authenticator/Authenticator";
import Register from "./pages/auth/register/Register";
import Header from "./pages/include/header/Header";
import Footer from "./pages/include/footer/Footer";
import Navbar from "./pages/include/navbar/Navbar";
import DisplayArea from "./pages/include/displayarea/DisplayArea";
import Test from "./pages/Home/Test";
import BoardList from "./pages/board/BoardList";

function App() {
  return (
    <AuthProvider>
      <Header />
      <Navbar />
      <Footer />
      <Routes>
        {/* <Route path="/authenticator" element={<Authenticator />} />
        <Route path="/register" element={<Register />} /> */}
        <Route path="/" element={<DisplayArea children={<></>} />} />
        <Route path="/test" element={<DisplayArea children={<Test />} />} />
        <Route path="/boards" element={<DisplayArea children={<BoardList />} />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
