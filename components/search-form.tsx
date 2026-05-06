import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function SearchForm({
  placeholder,
  defaultValue,
  className,
}: {
  placeholder: string;
  defaultValue?: string;
  className?: string;
}) {
  return (
    <form className={className}>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
          <Input name="q" defaultValue={defaultValue} placeholder={placeholder} className="h-12 rounded-xl bg-white/90 pl-9" />
        </div>
        <Button type="submit" variant="outline" className="h-12 rounded-xl bg-white/80">
          Искать
        </Button>
      </div>
    </form>
  );
}
