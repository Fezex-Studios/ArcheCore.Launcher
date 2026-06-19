import { Controller, useForm } from "react-hook-form";
import { authSchema } from "@/schemas/auth.schema.tsx";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Checkbox } from "@/components/ui/checkbox.tsx";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { signin } from "@/api/login.api.ts";
import { useSession } from "@/context/SessionContext.tsx";
import { saveCredentials, getSavedCredentials, clearSavedCredentials } from "@/lib/sessionStore.ts";
import type { LoginResponse } from "@/types/auth.ts";

const AuthComponent = () => {
    const [rememberMe, setRememberMe] = useState(false);
    const navigate = useNavigate();
    const { setToken } = useSession();

    const authForm = useForm<z.infer<typeof authSchema>>({
        resolver: zodResolver(authSchema),
        defaultValues: {
            username: "",
            password: "",
        },
    });

    // Pre-fill saved credentials on mount
    useEffect(() => {
        async function loadSaved() {
            const saved = await getSavedCredentials();
            if (saved) {
                authForm.setValue("username", saved.username);
                authForm.setValue("password", saved.password);
                setRememberMe(true);
            }
        }
        loadSaved();
    }, []);

    async function onAuthSubmit(data: z.infer<typeof authSchema>) {
        try {
            const res = await signin(data.username, data.password);
            const body: LoginResponse = res.data;

            if (!body.Success) {
                toast("Login failed", {
                    description: body.Message ?? "Invalid username or password",
                    position: "bottom-right",
                });
                return;
            }

            // Token is always freshly issued — never persisted
            setToken(body.Token!);

            if (rememberMe) {
                await saveCredentials(data.username, data.password);
            } else {
                await clearSavedCredentials();
            }

            toast("Login successful", {
                description: "Welcome back!",
                position: "bottom-right",
            });

            navigate("/archecore");
        } catch {
            toast("Login failed", {
                description: "Could not reach the server",
                position: "bottom-right",
            });
        }
    }

    async function handleClearSaved() {
        await clearSavedCredentials();
        authForm.reset();
        setRememberMe(false);
        toast("Saved credentials cleared", { position: "bottom-right" });
    }

    return (
        <div className="relative flex min-h-svh w-full flex-col bg-[#C8CCD2]">
            <div className="absolute inset-0 flex items-center justify-center bg-[#C8CCD2] text-sm font-medium uppercase tracking-widest text-[#9AA0AA]">
                Background placeholder
            </div>
            <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 pb-24">
                <h1 className="mb-10 text-center text-4xl font-bold uppercase tracking-[0.2em] text-[#2A2E35]">
                    ArcheCore
                </h1>

                <div className="w-full max-w-sm rounded-md border border-black/10 bg-[#1B1E24]/90 px-7 pb-7 pt-6 shadow-2xl backdrop-blur-sm">
                    <h2 className="mb-5 text-center text-lg font-semibold text-white">
                        Login
                    </h2>

                    <form id="auth-form" onSubmit={authForm.handleSubmit(onAuthSubmit)}>
                        <FieldGroup className="gap-3">
                            <Controller
                                name="username"
                                control={authForm.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="auth-username" className="sr-only">
                                            Username
                                        </FieldLabel>
                                        <Input
                                            {...field}
                                            id="auth-username"
                                            aria-invalid={fieldState.invalid}
                                            placeholder="Username"
                                            autoComplete="off"
                                            className="rounded-sm border-white/10 bg-white/5 text-white placeholder:text-[#8A8F99] focus-visible:border-[#5B8DEF] focus-visible:ring-[#5B8DEF]/30"
                                        />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />

                            <Controller
                                name="password"
                                control={authForm.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="auth-password" className="sr-only">
                                            Password
                                        </FieldLabel>
                                        <Input
                                            {...field}
                                            id="auth-password"
                                            type="password"
                                            aria-invalid={fieldState.invalid}
                                            placeholder="Password"
                                            autoComplete="current-password"
                                            className="rounded-sm border-white/10 bg-white/5 text-white placeholder:text-[#8A8F99]"
                                        />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />
                        </FieldGroup>

                        <div className="mt-4 flex items-center justify-between">
                            <label className="flex items-center gap-2 text-sm text-[#C7CAD1]">
                                <Checkbox
                                    checked={rememberMe}
                                    onCheckedChange={(checked) => setRememberMe(checked === true)}
                                    className="border-white/20 data-[state=checked]:bg-[#5B8DEF] data-[state=checked]:border-[#5B8DEF]"
                                />
                                Remember me
                            </label>

                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleClearSaved}
                                className="rounded-sm border-[#5B8DEF]/50 bg-transparent text-xs text-[#8FB0FF] hover:bg-[#5B8DEF]/10 hover:text-[#A9C4FF]"
                            >
                                Clear saved
                            </Button>
                        </div>

                        <Button
                            type="submit"
                            form="auth-form"
                            className="mt-5 w-full rounded-sm bg-[#5B8DEF] py-5 text-sm font-bold uppercase tracking-wider text-white hover:bg-[#6E9CF3]"
                        >
                            Login
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AuthComponent;