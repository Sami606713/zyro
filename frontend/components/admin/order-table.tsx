import { StatusPill } from "@/components/admin/status-pill";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatPrice } from "@/lib/catalog";

type DeskOrder = {
  id: string;
  name: string;
  city: string;
  total: number;
  status: string;
  pieces: string;
  placed: string;
};

export function OrderTable({ orders }: { orders: DeskOrder[] }) {
  return (
    <>
      <ul className="divide-y divide-white/10 md:hidden">
        {orders.map((order) => (
          <li key={order.id} className="px-4 py-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-medium">{order.name}</p>
                <p className="text-xs tracking-wide text-muted">{order.id}</p>
              </div>
              <StatusPill status={order.status} />
            </div>
            <p className="mt-2 text-sm leading-5 text-muted">{order.pieces}</p>
            <div className="mt-2 flex items-center justify-between gap-3 text-sm">
              <span className="text-muted">
                {order.city} · {order.placed}
              </span>
              <span>{formatPrice(order.total)}</span>
            </div>
          </li>
        ))}
      </ul>
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="pl-4">Order</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>City</TableHead>
              <TableHead>Pieces</TableHead>
              <TableHead>When</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="pr-4 text-right">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id} className="hover:bg-white/5">
                <TableCell className="pl-4 font-medium">{order.id}</TableCell>
                <TableCell>{order.name}</TableCell>
                <TableCell>{order.city}</TableCell>
                <TableCell className="max-w-[220px] truncate">{order.pieces}</TableCell>
                <TableCell className="text-muted">{order.placed}</TableCell>
                <TableCell>
                  <StatusPill status={order.status} />
                </TableCell>
                <TableCell className="pr-4 text-right">{formatPrice(order.total)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
