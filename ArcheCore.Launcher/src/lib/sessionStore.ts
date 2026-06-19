// src/lib/sessionStore.ts
import { load, Store } from "@tauri-apps/plugin-store";

const STORE_FILE = "session.dat";
let storeInstance: Store | null = null;

async function getStore(): Promise<Store> {
    if (!storeInstance) {
        storeInstance = await load(STORE_FILE, { autoSave: true, defaults: {} });
    }
    return storeInstance;
}

// ── Credentials (Remember Me) ─────────────────────────────────────────────────

export async function saveCredentials(username: string, password: string) {
    const store = await getStore();
    await store.set("savedUsername", username);
    await store.set("savedPassword", password);
}

export async function getSavedCredentials(): Promise<{ username: string; password: string } | null> {
    const store = await getStore();
    const username = await store.get<string>("savedUsername");
    const password = await store.get<string>("savedPassword");
    if (username && password) return { username, password };
    return null;
}

export async function clearSavedCredentials() {
    const store = await getStore();
    await store.delete("savedUsername");
    await store.delete("savedPassword");
    await store.save();
}