import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-white">
      <div className="container mx-auto px-8">
        <div className="w-full flex flex-col md:flex-row py-6">
          <div className="flex-1 mb-6 text-black">
            <Link
              className="text-gray-900 no-underline hover:no-underline font-bold text-2xl lg:text-4xl"
              href="/"
            >
              Buku.ID
            </Link>
          </div>
          <div className="flex-1">
            <p className="text-gray-500 md:mb-6">
              {" "}
              Proyek ini dibuat untuk memenuhi tugas Proyek Akhir Semester (PAS)
              pada mata kuliah Pemrograman Lanjut (CSCM602223) yang
              diselenggarakan oleh Fakultas Ilmu Komputer, Universitas Indonesia
              pada Semester Genap, Tahun Ajaran 2023/2024.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
