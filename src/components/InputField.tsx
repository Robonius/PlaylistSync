"use client";
import React, { useId } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface InputFieldProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({ label, value, onChange, type = "text", placeholder, required = false }) => {
  const id = useId();
  return (
    <div className="grid w-full items-center gap-1.5 mb-4">
      <Label htmlFor={id} className="font-mono text-[10px] uppercase text-muted-foreground tracking-tighter">
        {label}
        {required && <span className="text-destructive ml-0.5" aria-hidden="true">*</span>}
      </Label>
      <Input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        aria-required={required ? "true" : "false"}
        className="rounded-none border-border bg-background font-mono focus-visible:ring-primary"
      />
    </div>
  );
};

export default InputField;
