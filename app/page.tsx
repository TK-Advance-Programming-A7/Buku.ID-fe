"use client"

import Navbar from "./components/navbar";
import Footer from "./components/footer";
import Image from "next/image";
import { useRouter } from "next/navigation"

export default function Home() {
  const router = useRouter()

  const onLoginButtonClick = () => {
    router.push('/login');
  }

  return (
    <>
      <Navbar />
      <div className="pt-24">
        <div className="container px-3 mx-auto flex flex-wrap flex-col md:flex-row items-center">
          <div className="flex flex-col w-full md:w-2/5 justify-center items-start text-center md:text-left">
            <p className="uppercase tracking-loose w-full">
              Your Go-To Bookstore
            </p>
            <h1 className="my-4 text-5xl font-bold leading-tight">
              Explore Endless Stories at Buku.ID!
            </h1>
            <p className="leading-normal text-2xl mb-8">
              Find your next adventure with our vast collection of books.
            </p>
            <button onClick={onLoginButtonClick} className="mx-auto lg:mx-0 hover:underline bg-white text-gray-800 font-bold rounded-full my-6 py-4 px-8 shadow-lg focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out">
              Login
            </button>
          </div>
          <div className="w-full md:w-3/5 py-6 text-center">
            <Image
              className="w-full md:w-4/5 z-50"
              src="/hero.png"
              alt=""
              height={900}
              width={900}
            />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
