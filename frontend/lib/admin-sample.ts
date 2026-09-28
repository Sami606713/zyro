import { products } from "@/lib/catalog";

export const sampleOrders = [
  {
    id: "ZY184221",
    name: "Ayaan",
    city: "Haripur",
    total: 6600,
    status: "New" as const,
    pieces: "Night Crew, Matte Belt",
    placed: "Today · 11:20",
  },
  {
    id: "ZY184198",
    name: "Sami",
    city: "Haripur",
    total: 8900,
    status: "Confirmed" as const,
    pieces: "Field Jacket",
    placed: "Today · 09:05",
  },
  {
    id: "ZY184140",
    name: "Bilal",
    city: "Abbottabad",
    total: 7400,
    status: "New" as const,
    pieces: "Stone Trouser",
    placed: "Yesterday · 18:40",
  },
  {
    id: "ZY184102",
    name: "Hamza",
    city: "Haripur",
    total: 6900,
    status: "Done" as const,
    pieces: "Charcoal Overshirt",
    placed: "Yesterday · 14:12",
  },
  {
    id: "ZY183990",
    name: "Usman",
    city: "Havelian",
    total: 3200,
    status: "Confirmed" as const,
    pieces: "Matte Belt",
    placed: "27 Sep · 16:48",
  },
];

export const sampleProducts = products.map((product) => ({
  slug: product.slug,
  name: product.name,
  category: product.category,
  price: product.price,
  image: product.image,
  alt: product.alt,
  status: product.sale ? ("Marked down" as const) : ("On the floor" as const),
}));
