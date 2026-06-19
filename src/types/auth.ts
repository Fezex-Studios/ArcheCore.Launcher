// src/types/auth.ts
export interface LoginRequest {
    Username: string;
    Password: string;
}

export interface LoginResponse {
    Success: boolean;
    Token?: string;
    Message?: string;
}