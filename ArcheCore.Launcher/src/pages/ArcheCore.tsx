import { invoke } from "@tauri-apps/api/core";
import { useSession } from "@/context/SessionContext";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import {useState} from "react";

const ArcheCore = () => {
    const { token, setToken } = useSession();
    const navigate = useNavigate();
    const [launched, setLaunched] = useState<boolean>(false);

    async function handlePlay() {
        if (!token) {
            toast("Not logged in", {
                description: "Please log in first",
                position: "bottom-right",
            });
            return;
        }
        setLaunched(true);

        try {
            await invoke("launch_game", { token });
            toast("Launching ArcheCore...", {
                position: "bottom-right",
            });
        } catch (err) {
            setLaunched(false);
            toast("Failed to launch game", {
                description: String(err),
                position: "bottom-right",
            });
        }
    }

    function handleLogout() {
        setToken(null);
        toast("Logged out", { position: "bottom-right" });
        navigate("/");
    }

    return (
        <div className="relative flex min-h-svh w-full flex-col bg-[#1B1E24]">
            {/* Background placeholder */}
            <div className="absolute inset-0 flex items-center justify-center text-sm font-medium uppercase tracking-widest text-white/10">
                Background placeholder
            </div>

            {/* Top bar */}
            <div className="relative z-10 flex items-center gap-3 border-b border-white/10 bg-black/20 px-4 py-2.5 text-xs text-white/50">
                <span>ArcheCore</span>
                <span className="text-white/20">|</span>
                <span>
                    Status:{" "}
                    <span className="font-medium text-green-400">Online</span>
                </span>

                {/* Logout pushed to the right */}
                <button
                    onClick={handleLogout}
                    className="ml-auto rounded-sm border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/40 transition-colors hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400"
                >
                    Logout
                </button>
            </div>

            {/* Bottom bar with play button */}
            <div className="relative z-10 mt-auto flex items-center justify-end border-t border-white/10 bg-black/20 px-6 py-4">
                <button
                    onClick={handlePlay}
                    disabled={launched}
                    className="rounded-sm bg-[#5B8DEF] px-10 py-3 text-sm font-bold uppercase tracking-wider text-white hover:bg-[#6E9CF3] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {launched? "Launching ....":"Play"}
                </button>
            </div>
        </div>
    );
};

export default ArcheCore;