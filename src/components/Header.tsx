"use client";

import { useEffect, useState } from "react";
import Container from "./Container";
import Logo from "./Logo";
import { IoMdCart } from "react-icons/io";
import { BsBookmarks } from "react-icons/bs";
import { FiSearch, FiLogOut } from "react-icons/fi";
import { AiOutlineUser } from "react-icons/ai";
import { useSession, signIn, signOut } from "next-auth/react";
import { useSelector, useDispatch } from "react-redux";
import Image from "next/image";
import { StateProps, Product } from "@/type";
import FormattedPrice from "./FormattedPrice";
import Link from "next/link";
import { addUser, deleteUser } from "@/redux/shoppingSlice";

const Header = () => {
  const { data: session } = useSession();
  const { productData, orderData } = useSelector(
    (state: StateProps) => state.shopping
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (session) {
      dispatch(
        addUser({
          name: session.user?.name,
          email: session.user?.email,
          image: session.user?.image,
        })
      );
    } else {
      dispatch(deleteUser());
    }
  }, [session, dispatch]);

  const [cartAmount, setCartAmount] = useState(0);
  const [quantity, setQuantity] = useState(0);
  useEffect(() => {
    let amt = 0;
    let qty = 0;
    productData.map((product: Product) => {
      amt += product.price * product.quantity;
      qty += product.quantity;
      return;
    });
    setCartAmount(amt);
    setQuantity(qty);
  }, [productData]);

  return (
    <div className="bg-bodyColor h-20 top-0 sticky z-50">
      <Container className="h-full flex items-center md:gap-x-5 justify-between md:justify-start">
        <Logo />
        {/* Search Field */}
        <div className="w-full bg-white hidden md:flex items-center gap-x-1 border-[1px] border-lightText/50 rounded-full px-4 py-1.5 focus-within:border-orange-600 group">
          <FiSearch className="text-gray-500 group-focus-within:text-darkText duration-200" />
          <input
            type="text"
            placeholder="Search for products"
            className="placeholder:text-sm flex-1 outline-none"
          />
        </div>
        {/* Login Field */}
        {!session && (
          <div onClick={() => signIn()} className="headerDiv cursor-pointer">
            <AiOutlineUser className="text-2xl" />
            <p className="text-sm font-semibold">Login/Register</p>
          </div>
        )}
        {/* Cart Button */}
        <Link
          href={"/cart"}
          className="bg-black hover:bg-slate-950 rounded-full text-slate-100 hover:text-white flex items-center justify-center gap-x-1 px-3 py-1.5 border-[1px] border-black hover:border-orange-600 duration-200 relative hover:cursor-pointer"
        >
          <IoMdCart className="text-xl" />
          <p className="text-sm font-semibold">
            <FormattedPrice amount={cartAmount} />
          </p>
          <span className="bg-white text-orange-600 rounded-full text-xs font-semibold absolute -right-2 -top-1 w-5 h-5 flex items-center justify-center shadow-xl shadow-black">
            {quantity}
          </span>
        </Link>
        {/* Image */}
        {session && (
          <Image
            src={session?.user?.image as string}
            alt="user img"
            width={55}
            height={55}
            className="rounded-full object-cover"
          />
        )}
        {/* Order */}
        {orderData?.order?.length > 0 && session && (
          <Link
            href={"/order"}
            className="headerDiv px-2 gap-x-1 cursor-pointer"
          >
            <BsBookmarks className="text-2xl" />
            <p className="text-sm font-semibold">Orders</p>
          </Link>
        )}
        {/* Logout */}
        {session && (
          <div onClick={() => signOut()} className="headerDiv px-1 gap-x-1">
            <FiLogOut className="text-2xl" />
            <p className="text-sm font-semibold">Logout</p>
          </div>
        )}
      </Container>
    </div>
  );
};

export default Header;
