import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Dashboard from "./pages/dashboard";
import SnippetView from "./pages/snippetview";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="group">
          <Route index element={<Home />} />
          <Route path=":groupName">
            <Route index element={<Dashboard />} />
            <Route path=":snippetName" element={<SnippetView />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
