import React, { useId } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";

interface InputFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
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
      <div className="relative">
        <Input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          aria-required={required ? "true" : "false"}
          className="rounded-none border-border bg-background font-mono focus-visible:ring-primary pr-8"
        />
        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
            aria-label={`Clear ${label}`}
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
      </div>
    </div>
  );
};

export default InputField;
