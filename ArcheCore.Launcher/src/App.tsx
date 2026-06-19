import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "@/pages/Login.tsx";
import ArcheCore from "@/pages/ArcheCore.tsx";
import { ProtectedRoute } from "@/components/ProtextedRoute.tsx";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route
                    path="/archecore"
                    element={
                        <ProtectedRoute>
                            <ArcheCore />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;