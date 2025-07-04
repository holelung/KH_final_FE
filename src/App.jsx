import "./App.css";
import { AuthProvider } from "./Context/AuthContext";
import { Routes, Route } from "react-router-dom";
import Authenticator from "./pages/auth/authenticator/Authenticator";
import Register from "./pages/auth/register/Register";
import DisplayArea from "./pages/include/displayarea/DisplayArea";
import Test from "./pages/Home/Test";
import BoardList from "./pages/board/BoardList";
import Includes from "./pages/include/includes/Includes";
import AuthRoute from "./pages/auth/authroute/AuthRoute";
import UnifiedCalendar from "./pages/calendar/UnifiedCalendar";
import GroupChat from "./pages/chat/GroupChat";


function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/authenticator" element={<Authenticator />} />
        <Route path="/register" element={<Register />} />
        <Route
          element={
            // <AuthRoute>
              <Includes />
            // </AuthRoute>
          }
        >
          <Route path="/" element={<DisplayArea children={<></>} />} />
          <Route path="/test" element={<DisplayArea children={<Test />} />} />
          <Route path="/boards" element={<DisplayArea children={<BoardList />} />} />
          <Route path="/calendar" element={<DisplayArea children={<UnifiedCalendar />} />} />
          <Route path="/chat" element={<DisplayArea children={<GroupChat />} />} />
          
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
