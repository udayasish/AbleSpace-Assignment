import { Pyramid } from "lucide-react";

export function BrandMark() {
  return (
    <div className="flex items-center justify-center gap-2 self-center font-medium">
      <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
        <Pyramid className="size-4" />
      </div>
      Pyramid
    </div>
  );
}
