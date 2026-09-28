import Link from "next/link";

export function Announcement() {
  return (
    <div className="border-b border-line bg-surface text-center text-sm">
      <Link href="/new-arrivals" className="block px-4 py-2.5">
        <span className="text-accent">New arrivals are live.</span>{" "}
        <span className="text-fg">Shop the floor.</span>
      </Link>
    </div>
  );
}
