import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Dashboard from "./pages/dashboard";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="group">
          <Route index element={<Home />} />
          <Route path=":groupId" element={<Dashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
