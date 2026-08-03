"use client";

import {
  forwardRef,
  useId,
  useMemo,
  useState,
  type InputHTMLAttributes,
} from "react";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { EyeOffIcon, EyeIcon, CheckIcon, XIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type PasswordCheckProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  hideLabel?: boolean;
};

export const PasswordCheck = forwardRef<HTMLInputElement, PasswordCheckProps>(
  (
    {
      id,
      label = "Secure Password",
      hideLabel = true,
      className,
      onChange,
      value,
      defaultValue,
      ...props
    },
    ref,
  ) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const [isVisible, setIsVisible] = useState(false);
    const [internalValue, setInternalValue] = useState(
      String(defaultValue ?? ""),
    );

    const password = typeof value === "string" ? value : internalValue;

    const toggleVisibility = () => setIsVisible((prevState) => !prevState);

    const requirements = useMemo(
      () => [
        { regex: /.{8,}/, text: "At least 8 characters" },
        { regex: /[0-9]/, text: "At least 1 number" },
        { regex: /[a-z]/, text: "At least 1 lowercase letter" },
        { regex: /[A-Z]/, text: "At least 1 uppercase letter" },
        {
          regex: /[!@#$%^&*(),.?":{}|<>]/,
          text: "At least 1 special character",
        },
      ],
      [],
    );

    const strength = useMemo(
      () =>
        requirements.map((req) => ({
          met: req.regex.test(password),
          text: req.text,
        })),
      [password, requirements],
    );

    const strengthScore = useMemo(() => {
      return strength.filter((req) => req.met).length;
    }, [strength]);

    const getStrengthColor = (score: number) => {
      if (score === 0) return "bg-border";
      if (score <= 1) return "bg-red-500";
      if (score <= 2) return "bg-orange-500";
      if (score <= 3) return "bg-amber-500";
      if (score <= 4) return "bg-green-500";
      return "bg-emerald-500";
    };

    const getStrengthText = (score: number) => {
      if (score === 0) return "Enter a password";
      if (score <= 2) return "Weak security";
      if (score <= 4) return "Medium security";
      return "Strong security";
    };

    return (
      <div className="w-full">
        <Field>
          {!hideLabel && <FieldLabel htmlFor={inputId}>{label}</FieldLabel>}
          <div className="relative">
            <Input
              ref={ref}
              id={inputId}
              value={password}
              type={isVisible ? "text" : "password"}
              aria-describedby={`${inputId}-description`}
              className={cn("pe-9", className)}
              onChange={(event) => {
                setInternalValue(event.target.value);
                onChange?.(event);
              }}
              {...props}
            />
            <button
              aria-controls={inputId}
              aria-label={isVisible ? "Hide password" : "Show password"}
              aria-pressed={isVisible}
              className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
              onClick={toggleVisibility}
              type="button"
            >
              {isVisible ? (
                <EyeOffIcon className="size-3.5" aria-hidden="true" />
              ) : (
                <EyeIcon className="size-3.5" aria-hidden="true" />
              )}
            </button>
          </div>
        </Field>

        <div
          aria-label="Password strength"
          aria-valuemax={5}
          aria-valuemin={0}
          aria-valuenow={strengthScore}
          className="mt-3 mb-4 flex gap-1"
          role="progressbar"
        >
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-colors duration-500 ${
                i < strengthScore
                  ? getStrengthColor(strengthScore)
                  : "bg-border"
              }`}
            />
          ))}
        </div>

        <div className="mb-3 flex items-center justify-between">
          <p
            className="text-foreground text-sm font-medium"
            id={`${inputId}-description`}
          >
            {getStrengthText(strengthScore)}
          </p>
          <span className="text-muted-foreground text-xs">
            {strengthScore}/5 requirements met
          </span>
        </div>

        <ul aria-label="Password requirements" className="space-y-1.5">
          {strength.map((req) => (
            <li className="flex items-center gap-1" key={req.text}>
              {req.met ? (
                <CheckIcon
                  className="size-3.5 text-emerald-500"
                  aria-hidden="true"
                />
              ) : (
                <XIcon
                  className="text-muted-foreground/60 size-3.5"
                  aria-hidden="true"
                />
              )}
              <span
                className={cn(
                  "text-xs transition-colors",
                  req.met ? "text-emerald-600" : "text-muted-foreground",
                )}
              >
                {req.text}
                <span className="sr-only">
                  {req.met ? " - Requirement met" : " - Requirement not met"}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    );
  },
);

PasswordCheck.displayName = "PasswordCheck";
