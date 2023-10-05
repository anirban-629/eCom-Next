import { productData } from "@/constants/data";

export const getProducts = async () => {
  const res = await fetch("http://localhost:3000/api/products");
  if (!res.ok) throw new Error("Failed to get products");
  return res.json();
};

export const calculatePercentage = (oldPrice: any, price: any) => {
  return !!parseFloat(price) && !!parseFloat(oldPrice)
    ? (100 - (oldPrice / price) * 100).toFixed(0)
    : 0;
};

export const getSingleProduct = (_id: number) => {
  const item = productData.find((product) => product._id === _id);
  return item;
};

export const getTrendingProducts = async () => {
  const res = await fetch(
    "https://fakestoreapiserver.reactbd.com/smarttrending"
  );
  if (!res.ok) throw new Error("Failed to get products");
  return res.json();
};
