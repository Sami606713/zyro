import { Badge } from "@/components/ui/badge";

export function StatusPill({ status }: { status: string }) {
  const hot = status === "New" || status === "Marked down";
  return (
    <Badge variant={hot ? "default" : "outline"} className="rounded-full px-2.5 tracking-wide">
      {status}
    </Badge>
  );
}
