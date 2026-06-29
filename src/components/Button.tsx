"use client";
import React from 'react';
import { Button as ShadcnButton } from "@/components/ui/button";

interface ButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
}

const Button: React.FC<ButtonProps> = ({ label, onClick, disabled = false, variant = "default" }) => {
  return (
    <ShadcnButton
      onClick={onClick}
      disabled={disabled}
      variant={variant}
      className="rounded-none font-mono uppercase tracking-widest text-xs"
    >
      {label}
    </ShadcnButton>
  );
};

export default Button;
