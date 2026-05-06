import { ReactNode } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function Field({
  label,
  name,
  defaultValue,
  required,
  help,
}: {
  label: string;
  name: string;
  defaultValue?: string | number | null;
  required?: boolean;
  help?: ReactNode;
}) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={name}>{label}</Label>
      <Input id={name} name={name} defaultValue={defaultValue ?? ""} required={required} />
      {help ? <p className="text-xs leading-5 text-stone-500">{help}</p> : null}
    </div>
  );
}

export function TextAreaField({
  label,
  name,
  defaultValue,
  required,
  rows = 5,
  help,
}: {
  label: string;
  name: string;
  defaultValue?: string | null;
  required?: boolean;
  rows?: number;
  help?: ReactNode;
}) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={name}>{label}</Label>
      <Textarea id={name} name={name} defaultValue={defaultValue ?? ""} required={required} rows={rows} />
      {help ? <p className="text-xs leading-5 text-stone-500">{help}</p> : null}
    </div>
  );
}
