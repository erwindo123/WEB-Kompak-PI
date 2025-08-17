"use client";

import { useState, useEffect } from "react";
import type { MouseEvent } from "react"; // Mengimpor tipe MouseEvent secara spesifik

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
      <style jsx>{`
        /* Hanya CSS untuk navbar mobile - minimal changes */
        .navbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.4rem 7%;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 9999;
          background-color: rgba(1, 1, 1, 0.8);
        }

        .navbar-logo {
          font-size: 2rem;
          font-weight: 700;
          color: #fff;
          text-decoration: none;
        }

        .navbar-logo span {
          color: #b6895b;
        }

        .navbar-nav {
          display: flex;
        }

        .navbar-nav a {
          color: #fff;
          margin: 0 1rem;
          text-decoration: none;
          font-size: 1.3rem;
        }

        .navbar-extra a {
          color: #fff;
          font-size: 1.5rem;
          text-decoration: none;
        }

        #hamburger-menu {
          display: none;
        }

        /* Mobile responsive */
        @media (max-width: 768px) {
          #hamburger-menu {
            display: block;
          }

          .navbar-nav {
            position: absolute;
            top: 100%;
            right: -100%;
            background-color: rgba(1, 1, 1, 0.9);
            width: 30rem;
            height: 100vh;
            flex-direction: column;
            transition: 0.3s;
            padding: 2rem;
          }

          .navbar-nav.active {
            right: 0;
          }

          .navbar-nav a {
            display: block;
            margin: 1rem 0;
            padding: 0.5rem;
            font-size: 2rem;
          }
        }
      `}</style>

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
            ☰
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
