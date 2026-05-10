"use client";

import { useActionState } from "react";
import { loginAction, type LoginState } from "@/actions/auth";

const INITIAL: LoginState = { error: null };

export function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, INITIAL);

  return (
    <form
      action={formAction}
      className="flex w-full max-w-[360px] shrink-0 flex-col items-center gap-8"
    >
      <div className="flex flex-col items-center gap-2">
        <span className="text-[11px] font-medium uppercase tracking-widest text-gold">
          Admin
        </span>
        <span className="font-sans text-2xl font-semibold tracking-[-0.02em] text-ink">
          WARSZAWSKI
        </span>
      </div>

      <div className="flex w-full flex-col gap-4">
        <Field
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="admin@warszawski.com"
          required
        />
        <Field
          label="Contraseña"
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="Ingresa la contraseña"
          required
        />

        {state.error ? (
          <p className="-mt-1 text-[13px] text-red-700" role="alert">
            {state.error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={pending}
          className="flex h-11 items-center justify-center rounded-md bg-ink text-sm font-medium text-white transition-colors hover:bg-ink-soft disabled:opacity-60"
        >
          {pending ? "Ingresando..." : "Ingresar"}
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  ...rest
}: {
  label: string;
  name: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[13px] font-medium text-ink">{label}</span>
      <input
        name={name}
        className="h-11 rounded-md border border-black/10 bg-[#F7F7F5] px-3.5 text-sm text-ink outline-none transition-colors placeholder:text-[#999] focus:border-ink/40 focus:bg-white"
        {...rest}
      />
    </label>
  );
}
