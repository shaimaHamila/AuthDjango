import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Register from "./pages/Register/Register";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import NotFound from "./pages/NotFound/NotFound";
const Logout = () => {
  localStorage.clear();
  return <Navigate to="/login" />;
};
const RegisterAndLogout = () => {
  localStorage.clear();
  return <Register />;
};
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route path="/register" element={<RegisterAndLogout />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
