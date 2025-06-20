import "./App.css";
import { AuthProvider } from "./Context/AuthContext";
import { Routes, Route } from "react-router-dom";
import Test from "./pages/Home/Test";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Test />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
