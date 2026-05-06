"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function FilterSelect({
  name,
  placeholder,
  options,
}: {
  name: string;
  placeholder: string;
  options: string[];
}) {
  const router = useRouter();
  const params = useSearchParams();
  const current = params.get(name) ?? "all";

  return (
    <Select
      value={current}
      onValueChange={(value) => {
        const next = new URLSearchParams(params);
        if (value === "all") next.delete(name);
        else next.set(name, value);
        router.push(`?${next.toString()}`);
      }}
    >
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">{placeholder}</SelectItem>
        {options.map((option) => (
          <SelectItem key={option} value={option}>
            {option}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
