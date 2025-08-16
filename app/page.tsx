"use client";

import { useState, useEffect } from "react";
import type { MouseEvent } from "react"; // Mengimpor tipe MouseEvent secara spesifik

// PENTING: Import feather-icons untuk efek sampingnya (biasanya menambahkan 'feather' ke objek window global)
import "feather-icons";

// PENTING: Mendeklarasikan objek 'feather' di window agar TypeScript mengenalinya
// Ini diperlukan karena feather-icons tidak menyediakan tipe default export yang standar
declare global {
  interface Window {
    feather: {
      replace: () => void;
    };
  }
}

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    // Jalankan feather.replace() hanya di client-side
    // Pastikan window dan window.feather ada sebelum memanggil replace()
    if (typeof window !== "undefined" && window.feather) {
      window.feather.replace();
    }
  }, []);

  // Fungsi untuk mengubah state menu saat ikon diklik
  // Menggunakan tipe MouseEvent<HTMLAnchorElement> langsung
  const toggleMenu = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault(); // Mencegah perilaku default dari tautan (misalnya, melompat ke atas halaman)
    setIsMenuOpen(!isMenuOpen);
  };

  // Fungsi untuk menutup menu saat tautan navigasi diklik
  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      {/* Navbar Start */}
      <nav className="navbar">
        <a href="#" className="navbar-logo">
          Kompak<span>Satya</span>
          <span>Buana</span>
        </a>

        {/* Gunakan state `isMenuOpen` untuk mengontrol class CSS */}
        <div className={`navbar-nav ${isMenuOpen ? "active" : ""}`}>
          <a href="#home" onClick={closeMenu}>
            Home
          </a>
          <a href="#about" onClick={closeMenu}>
            Tentang Kami
          </a>
          <a href="#menu" onClick={closeMenu}>
            Menu
          </a>
          <a href="/quiz" onClick={closeMenu}>
            {" "}
            {/* Diarahkan ke halaman kuis yang baru */}
            Belajar Sekarang
          </a>
        </div>

        <div className="navbar-extra">
          {/* Tambahkan `onClick` handler ke tautan untuk membuka/menutup menu */}
          <a href="#" id="hamburger-menu" onClick={toggleMenu}>
            {/* The <i> tag will be replaced by feather-icons jika dimuat dengan benar */}
            <i data-feather="menu"></i>
          </a>
        </div>
      </nav>
      {/* Navbar End */}

      {/* Hero Section Start */}
      <section className="hero" id="home">
        <main className="content">
          <h1>
            Kompak<span>Satya Buana</span>
          </h1>
          <p>Pusat pembelajaran Bahasa Inggris untuk calon polisi</p>
          <a href="#study-now" className="cta">
            Mulai Sekarang
          </a>
        </main>
      </section>
      {/* Hero Section End */}

      {/* About Section Start */}
      <section id="about" className="about">
        <h2>
          <span>Tentang</span> Kami
        </h2>
        <div className="row">
          <div className="about-img">
            {/* Pastikan gambar ada di folder public */}
            <img src="/img/Tentangkami-bg.jpg" alt="Tentang Kami" />
          </div>
          <div className="content">
            <h3>Kompak</h3>
            <p>
              Bimbingan belajar yang secara khusus fokus mempersiapkan peserta
              didik untuk seleksi masuk Kepolisian Republik Indonesia (POLRI).
              Bimbel ini hadir sebagai solusi bagi para calon anggota POLRI yang
              ingin memperkuat pemahaman materi dan meningkatkan kesiapan mereka
              dalam menghadapi berbagai tahapan seleksi, baik akademik maupun
              non-akademik.
            </p>
          </div>
        </div>
      </section>
      {/* About Section End */}

      {/* Menu Section Start */}
      <section className="menu" id="menu">
        <h2>
          <span>Bahasa</span> Inggris
        </h2>
        <div className="english-section">
          <p className="intro">
            Fokus Materi Bahasa Inggris dirancang khusus untuk mempersiapkan
            peserta menghadapi ujian seleksi masuk POLRI.
            <br />
            <span className="highlight">
              Materi mencakup pembahasan mendalam mengenai:
            </span>
          </p>
          <ul className="english-list">
            <li>
              <strong>Grammar:</strong> Penguasaan struktur kalimat yang sering
              keluar dalam ujian.
            </li>
            <li>
              <strong>Vocabulary:</strong> Kumpulan kosakata penting yang wajib
              dikuasai oleh calon anggota POLRI.
            </li>
            <li>
              <strong>Reading Comprehension:</strong> Latihan pemahaman bacaan
              yang melatih kecepatan dan ketepatan membaca soal.
            </li>
            <li>
              <strong>Cloze Test:</strong> Teknik menjawab soal isian yang
              sering menjadi bagian dari tes akademik POLRI.
            </li>
          </ul>
          <p className="closing">
            Dengan pendekatan yang sistematis dan latihan-latihan yang sesuai
            dengan kisi-kisi seleksi, peserta akan lebih siap secara akademik.
            Materi disusun berdasarkan pengalaman dan analisis soal-soal
            tahun-tahun sebelumnya, sehingga efektif dalam menunjang kelulusan.
          </p>
        </div>
      </section>
      {/* Menu Section End */}
    </>
  );
}
