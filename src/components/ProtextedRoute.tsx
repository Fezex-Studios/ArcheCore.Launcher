// src/components/ProtectedRoute.tsx
import { Navigate } from "react-router-dom";
import { useSession } from "@/context/SessionContext";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { token } = useSession();

    if (!token) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
}