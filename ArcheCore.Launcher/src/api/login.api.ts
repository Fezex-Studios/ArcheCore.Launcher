import axios from "axios";
import {LoginRequest} from "@/types/auth.ts";

export const API = axios.create({
    baseURL: "http://127.0.0.1:3000",
})

export const signup = (username:string,password:string) =>
    API.post("/register", {username,password})


export const signin = (username: string, password: string) =>
    API.post("/login", { Username: username, Password: password } as LoginRequest);


export const passwordResetRequest = (email: string) =>
    API.post("/auth/password-reset-request", { email });

export const passwordReset = (token: string, newPassword: string) =>
    API.post("/auth/password-reset", { token, newPassword });
