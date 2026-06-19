// src/context/SessionContext.tsx
import { createContext, useContext, useState, ReactNode } from "react";

interface SessionContextValue {
    token: string | null;
    setToken: (token: string | null) => void;
}

const SessionContext = createContext<SessionContextValue | undefined>(undefined);

export function SessionProvider({ children }: { children: ReactNode }) {
    const [token, setToken] = useState<string | null>(null);

    return (
        <SessionContext.Provider value={{ token, setToken }}>
            {children}
        </SessionContext.Provider>
    );
}

export function useSession() {
    const ctx = useContext(SessionContext);
    if (!ctx) throw new Error("useSession must be used within SessionProvider");
    return ctx;
}