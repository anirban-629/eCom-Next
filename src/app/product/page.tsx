import Container from "@/components/Container";
import ProductData from "@/components/ProductData";
import SingleProduct from "@/components/SingleProduct";
import { getSingleProduct, getTrendingProducts } from "@/helpers";
import { Product } from "@/type";
import React from "react";

type Props = {
  searchParams: { [key: string]: string | string[] | undefined };
};

const Product = async ({ searchParams }: Props) => {
  const _id = Number(searchParams._id);
  const product = getSingleProduct(_id);
  const trendingProducts = await getTrendingProducts();
  return (
    <div>
      <Container>
        <SingleProduct product={product} />
        <div> 
          <p className="text-xl py-1 font-semibold">Tranding Products</p>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {trendingProducts?.map((item: Product) => (
              <ProductData key={item._id} item={item} />
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Product;
