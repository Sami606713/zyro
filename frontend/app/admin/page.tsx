import { DeskHeading } from "@/components/admin/desk-heading";
import { OrderTable } from "@/components/admin/order-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { sampleOrders, sampleProducts } from "@/lib/admin-sample";
import { formatPrice } from "@/lib/catalog";
import Link from "next/link";

const waiting = sampleOrders.filter((order) => order.status === "New");
const taken = sampleOrders.reduce((sum, order) => sum + order.total, 0);
const statuses = ["New", "Confirmed", "Done"] as const;

const cities = sampleOrders.reduce<Record<string, number>>((map, order) => {
  map[order.city] = (map[order.city] ?? 0) + 1;
  return map;
}, {});

export default function AdminHome() {
  return (
    <div>
      <DeskHeading
        kicker="Overview"
        title="The floor, this morning."
        detail="Sample figures only. Confirm stock the way the shop already does, then mark an order done."
      />

      <div className="grid gap-4 lg:grid-cols-12">
        <section className="rounded-[1.6rem] bg-white/5 p-1.5 lg:col-span-7">
          <div className="flex h-full flex-col rounded-[1.25rem] bg-surface px-6 py-7 md:px-8">
            <p className="text-[11px] tracking-[0.2em] text-muted uppercase">Waiting on you</p>
            <p className="mt-3 font-display text-7xl leading-none font-semibold tracking-[-0.06em]">{waiting.length}</p>
            <p className="mt-3 max-w-sm text-sm leading-6 text-muted">New sample orders to confirm before they leave Haripur.</p>
            <ul className="mt-8 divide-y divide-white/10">
              {waiting.map((order) => (
                <li key={order.id} className="flex items-center justify-between gap-4 py-3">
                  <div>
                    <p className="font-medium">{order.name}</p>
                    <p className="text-sm text-muted">
                      {order.pieces} · {order.city}
                    </p>
                  </div>
                  <p className="text-sm">{formatPrice(order.total)}</p>
                </li>
              ))}
            </ul>
            <Link href="/admin/orders" className="mt-auto pt-6 text-sm text-accent">
              Open the order book
            </Link>
          </div>
        </section>

        <div className="grid gap-4 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-1">
          <Card className="bg-surface ring-white/10">
            <CardHeader>
              <CardTitle className="text-[11px] tracking-[0.2em] text-muted uppercase">Sample total</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-display text-3xl font-semibold tracking-[-0.04em]">{formatPrice(taken)}</p>
              <p className="mt-2 text-sm text-muted">Across the five sample orders</p>
            </CardContent>
          </Card>
          <Card className="bg-surface ring-white/10">
            <CardHeader>
              <CardTitle className="text-[11px] tracking-[0.2em] text-muted uppercase">On the floor</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-display text-5xl font-semibold tracking-[-0.05em]">{sampleProducts.length}</p>
              <p className="mt-2 text-sm text-muted">Pieces written into the shop</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-12">
        <Card className="bg-surface ring-white/10 lg:col-span-5">
          <CardHeader>
            <CardTitle>Order states</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {statuses.map((status) => {
              const count = sampleOrders.filter((order) => order.status === status).length;
              return (
                <div key={status}>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span>{status}</span>
                    <span className="text-muted">{count}</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-accent"
                      style={{ width: `${(count / sampleOrders.length) * 100}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card className="bg-surface ring-white/10 lg:col-span-7">
          <CardHeader>
            <CardTitle>Where the samples sit</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {Object.entries(cities).map(([city, count]) => (
                <li key={city} className="flex items-center justify-between text-sm">
                  <span>{city}</span>
                  <span className="text-muted">
                    {count} {count === 1 ? "order" : "orders"}
                  </span>
                </li>
              ))}
            </ul>
            <Separator className="my-4 bg-white/10" />
            <p className="text-sm leading-6 text-muted">
              Display prices from the shop catalog. The desk does not take payment or talk to a live register.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-4 bg-surface ring-white/10">
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Recent orders</CardTitle>
          <Link href="/admin/orders" className="text-sm text-accent">
            All orders
          </Link>
        </CardHeader>
        <CardContent className="px-0">
          <OrderTable orders={sampleOrders} />
        </CardContent>
      </Card>
    </div>
  );
}
