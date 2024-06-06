import React from "react";
import { Input } from "./input";
import { Label } from "./label";

export const TokenInput = ({ label }: { label: string }) => {
  return (
    <div className="">
      <Label htmlFor={label.toLowerCase()} className="capitalize mb-3">
        {label}
      </Label>
      <Input
        id={label.toLowerCase()}
        className="text-xl py-2 h-12 px-4"
        type="number"
        placeholder="0.00"
      />
    </div>
  );
};
