export type CategorySlug = "apparel" | "bottomwear" | "accessories" | "outerwear";

export type Product = {
  slug: string;
  name: string;
  fabric: string;
  category: string;
  categorySlug: CategorySlug;
  price: number;
  compareAt?: number;
  image: string;
  alt: string;
  sale?: boolean;
  spotted?: boolean;
  bestseller?: boolean;
};

export const products: Product[] = [
  {
    slug: "charcoal-overshirt",
    name: "Charcoal Overshirt",
    fabric: "Cotton",
    category: "Apparel",
    categorySlug: "apparel",
    price: 6900,
    image: "/looks/shirt.jpg",
    alt: "Charcoal overshirt with two chest pockets.",
    spotted: true,
    bestseller: true,
  },
  {
    slug: "night-crew",
    name: "Night Crew",
    fabric: "Jersey",
    category: "Apparel",
    categorySlug: "apparel",
    price: 3400,
    compareAt: 4200,
    image: "/looks/tee.jpg",
    alt: "Black crew-neck t-shirt.",
    sale: true,
  },
  {
    slug: "studio-oxford",
    name: "Studio Oxford",
    fabric: "Cotton",
    category: "Apparel",
    categorySlug: "apparel",
    price: 5200,
    compareAt: 6400,
    image: "/looks/oxford.jpg",
    alt: "Charcoal oxford shirt laid flat.",
    sale: true,
  },
  {
    slug: "field-jacket",
    name: "Field Jacket",
    fabric: "Cotton canvas",
    category: "Outerwear",
    categorySlug: "outerwear",
    price: 8900,
    image: "/looks/jacket.jpg",
    alt: "Dark olive chore jacket.",
    spotted: true,
    bestseller: true,
  },
  {
    slug: "stone-trouser",
    name: "Stone Trouser",
    fabric: "Wool blend",
    category: "Bottomwear",
    categorySlug: "bottomwear",
    price: 7400,
    compareAt: 8900,
    image: "/looks/trousers.jpg",
    alt: "Stone grey trousers folded on a stone block.",
    sale: true,
    spotted: true,
  },
  {
    slug: "black-straight",
    name: "Black Straight",
    fabric: "Wool blend",
    category: "Bottomwear",
    categorySlug: "bottomwear",
    price: 6200,
    image: "/looks/black-trouser.jpg",
    alt: "Black tailored trousers folded on a stone block.",
    bestseller: true,
  },
  {
    slug: "matte-belt",
    name: "Matte Belt",
    fabric: "Leather",
    category: "Accessories",
    categorySlug: "accessories",
    price: 3200,
    compareAt: 4200,
    image: "/looks/belt.jpg",
    alt: "Black leather belt with a brushed silver buckle.",
    sale: true,
    spotted: true,
  },
];

export const categories: { slug: CategorySlug; title: string; image: string; alt: string }[] = [
  {
    slug: "apparel",
    title: "Apparel",
    image: "/looks/shirt.jpg",
    alt: "Charcoal overshirt.",
  },
  {
    slug: "bottomwear",
    title: "Bottomwear",
    image: "/looks/trousers.jpg",
    alt: "Stone grey trousers.",
  },
  {
    slug: "outerwear",
    title: "Outerwear",
    image: "/looks/jacket.jpg",
    alt: "Dark olive field jacket.",
  },
  {
    slug: "accessories",
    title: "Accessories",
    image: "/looks/belt.jpg",
    alt: "Black leather belt.",
  },
];

export function formatPrice(amount: number) {
  return `Rs. ${amount.toLocaleString("en-PK")}`;
}

export function getProduct(slug: string) {
  return products.find((product) => product.slug === slug);
}

export function productsIn(slug: CategorySlug) {
  return products.filter((product) => product.categorySlug === slug);
}
