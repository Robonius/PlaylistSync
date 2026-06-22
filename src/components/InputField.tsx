import React, { useId } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface InputFieldProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
}

const InputField: React.FC<InputFieldProps> = ({ label, value, onChange, type = "text" }) => {
  const id = useId();
  return (
    <div className="grid w-full items-center gap-1.5 mb-4">
      <Label htmlFor={id} className="font-mono text-[10px] uppercase text-muted-foreground tracking-tighter">
        {label}
      </Label>
      <Input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        className="rounded-none border-border bg-background font-mono focus-visible:ring-primary"
      />
    </div>
  );
};

export default InputField;
