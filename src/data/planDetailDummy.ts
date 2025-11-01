/**
 * Data dummy untuk plan detail
 * Berdasarkan struktur data yang diberikan user
 */

export const dummyPlanDetailData = {
  informasi_teknis: {
    spesifikasi_kolam: {
      tipe_kolam: "terpal",
      jumlah_kolam: 8,
      luas_per_kolam_m2: 7.07,
      total_luas_m2: 56.56,
      kedalaman_m: 1.2,
      sistem_sirkulasi: "Sistem bioflok dengan aerasi intensif",
      keterangan: "Kolam terpal bundar (diameter 3m) dengan sistem bioflok dipilih untuk efisiensi biaya investasi, kemudahan instalasi, dan kemampuan mendukung padat tebar tinggi (hingga 250 ekor/m2) yang krusial untuk mencapai skala ekonomi dengan modal terbatas. Sistem ini juga lebih hemat air dibandingkan sistem konvensional."
    },
    kualitas_air: {
      suhu_optimal_c: {
        min: 26,
        max: 32,
        optimal: 28
      },
      ph_optimal: {
        min: 6.5,
        max: 8,
        optimal: 7.5
      },
      oksigen_terlarut_mg_l: {
        min: 4,
        optimal: 5
      },
      parameter_lain: {
        amonium_mg_l: "< 0.1",
        nitrit_mg_l: "< 0.05",
        turbiditas: "Tinggi dan dikontrol oleh kepadatan flok"
      },
      rekomendasi_pemantauan: "Pemantauan suhu, pH, dan oksigen terlarut (DO) dilakukan setiap hari (pagi dan sore). Uji amonium dan nitrit dilakukan seminggu sekali atau saat ikan menunjukkan gejala stres. Kepadatan flok diukur menggunakan Imhoff cone setiap 2-3 hari."
    },
    spesifikasi_benih: {
      jenis_benih: "Sangkuriang atau Mutiara",
      ukuran_awal_cm: {
        panjang: 7,
        berat_gram: 5
      },
      jumlah_benih_per_m2: 250,
      sumber_benih: "Balai Benih Ikan (BBI) terdekat atau hatchery bersertifikat di area Sumatera Barat",
      standar_kualitas: "Benih seragam ukuran, aktif, bebas dari cacat fisik dan penyakit, serta memiliki sertifikat CPIB (Cara Pembenihan Ikan yang Baik) jika memungkinkan.",
      harga_per_ekor_rp: 300
    },
    spesifikasi_pakan: {
      jenis_pakan: "Pelet apung",
      kadar_protein_persen: 31,
      frekuensi_pemberian: "2-3 kali per hari",
      jumlah_per_minggu_kg: 107,
      rasio_konversi_pakan_fcr: 0.8,
      harga_per_kg_rp: 14000,
      supplier_rekomendasi: "Distributor resmi pakan merek Japfa Comfeed, Cargill, atau Central Proteina Prima di Kota Padang."
    },
    manajemen_kesehatan: {
      penyakit_umum: [
        "Aeromonas hydrophila (Penyakit Bakteri)",
        "Ichthyophthirius multifiliis (White Spot/Bintik Putih)",
        "Saprolegnia sp. (Penyakit Jamur)"
      ],
      pencegahan: "Manajemen kualitas air yang ketat, biosekuriti (pembatasan akses, desinfeksi peralatan), pemberian pakan berkualitas, dan penambahan probiotik/imunostimulan secara berkala.",
      pengobatan: "Penggunaan garam ikan (salt bath), Kalium Permanganat (PK), atau antibiotik (seperti Oxytetracycline) sesuai dengan diagnosis dan dosis yang dianjurkan. Isolasi ikan sakit.",
      vaksinasi: "Tidak, untuk budidaya lele skala menengah, vaksinasi belum menjadi praktik yang umum dan cost-effective.",
      jadwal_pemeriksaan: "Pemeriksaan visual harian saat pemberian pakan untuk memantau perilaku dan nafsu makan ikan. Sampling acak mingguan untuk memeriksa kondisi fisik dan pertumbuhan."
    },
    teknologi_pendukung: {
      aerator: {
        jumlah_unit: 1,
        tipe: "Ring Blower",
        kapasitas: "1 HP (cukup untuk 8-10 titik aerasi)"
      },
      filter: {
        tipe: "Sistem bioflok (filter biologis in-situ)",
        kapasitas: "Sesuai volume total air budidaya"
      },
      monitoring_sistem: "Tidak, pemantauan dilakukan secara manual menggunakan test kit, DO meter, dan pH meter portabel untuk menekan biaya investasi awal.",
      otomasi: "Tidak, pemberian pakan dan manajemen lainnya dilakukan secara manual untuk memastikan kontrol dan pengawasan maksimal pada tahap awal.",
      teknologi_lain: "Penggunaan probiotik dan molase untuk pembentukan dan pemeliharaan flok. Penggunaan Imhoff cone untuk mengukur volume flok."
    }
  },
  roadmap: {
    step: 1,
    judul: "Siklus Budidaya Pertama dan Stabilisasi Pasar",
    tujuan: "Membangun 8 kolam bioflok, menjalankan satu siklus budidaya penuh untuk validasi FCR, mortalitas, dan alur penjualan, serta mengamankan kontrak dengan mitra rumah makan.",
    durasi_bulan: 3.5,
    tahapan: [
      {
        nomor: 1,
        nama_tahap: "Persiapan Infrastruktur dan Kemitraan",
        deskripsi: "Pembangunan fisik kolam, instalasi sistem aerasi, dan penyiapan air, sambil secara paralel menjalin kemitraan dengan target pasar.",
        durasi_minggu: 2,
        kegiatan: [
          "Pembersihan dan perataan lahan.",
          "Perakitan 8 unit kolam terpal dan instalasi sistem aerasi.",
          "Pengisian air, fermentasi, dan pembentukan flok awal.",
          "Survei dan negosiasi dengan minimal 15 warung/rumah makan potensial."
        ],
        output: "8 kolam bioflok siap tebar dan minimal 10 MoU (Memorandum of Understanding) dengan pembeli."
      },
      {
        nomor: 2,
        nama_tahap: "Siklus Budidaya dan Panen Perdana",
        deskripsi: "Proses pembesaran lele dari benih hingga ukuran konsumsi, termasuk manajemen harian, dan diakhiri dengan panen serta distribusi.",
        durasi_minggu: 12,
        kegiatan: [
          "Aklimatisasi dan penebaran 14,000 ekor benih.",
          "Manajemen pakan, pemantauan kualitas air, dan kontrol flok harian.",
          "Sortir ukuran (grading) pada minggu ke-6 untuk menjaga keseragaman.",
          "Panen bertahap sesuai permintaan pasar dan penjualan langsung ke mitra."
        ],
        output: "Minimal 1.6 ton lele ukuran konsumsi (8-10 ekor/kg) berhasil dipanen dan terjual."
      }
    ],
    risiko_dan_mitigasi: [
      {
        risiko: "Serangan penyakit massal akibat padat tebar tinggi.",
        dampak: "Tinggi (mortalitas > 20%, kerugian finansial signifikan).",
        mitigasi: "Disiplin tinggi dalam menjaga kualitas air (terutama DO dan amonia), penerapan biosekuriti ketat, dan respons cepat dengan treatment jika ada gejala awal."
      },
      {
        risiko: "Kenaikan harga pakan mendadak.",
        dampak: "Medium (mengurangi margin keuntungan secara signifikan).",
        mitigasi: "Mencari supplier dengan harga pabrik, melakukan pembelian dalam jumlah lebih besar untuk 1 siklus jika arus kas memungkinkan, dan menjaga FCR seefisien mungkin (< 0.9)."
      }
    ],
    success_criteria: "Mencapai Tingkat Kelangsungan Hidup (SR) > 90%, FCR < 0.9, dan 100% hasil panen terserap oleh mitra langsung tanpa melalui tengkulak."
  },
  analisis_finansial: {
    rincian_modal_awal: {
      infrastruktur: {
        kolam: 10400000,
        aerator: 3500000,
        filter: 0,
        pompa: 1200000,
        bangunan: 0,
        lainnya: 900000,
        subtotal: 16000000
      },
      benih: {
        pembelian_benih: 4200000,
        transportasi: 200000,
        subtotal: 4400000
      },
      pakan: {
        stok_awal: 18020000,
        subtotal: 18020000
      },
      operasional_awal: {
        listrik_air: 1800000,
        tenaga_kerja: 0,
        perizinan: 500000,
        lainnya: 2280000,
        subtotal: 4580000
      },
      total_modal_awal: 43000000,
      catatan: "Alokasi modal awal sebesar 43 juta dari total modal 50 juta digunakan untuk investasi dan biaya operasional siklus pertama. Sisa 7 juta menjadi dana darurat yang krusial."
    },
    biaya_operasional: {
      biaya_tetap_per_bulan: {
        gaji_karyawan: 0,
        listrik: 600000,
        air: 100000,
        sewa_lahan: 0,
        depresiasi: 445000,
        lainnya: 150000,
        subtotal: 1295000
      },
      biaya_variabel_per_bulan: {
        pakan: 6006667,
        obat_obatan: 200000,
        transportasi: 200000,
        perawatan: 100000,
        lainnya: 733333,
        subtotal: 7240000
      },
      total_biaya_operasional_per_bulan: 8535000,
      catatan: "Biaya operasional dihitung berdasarkan rata-rata per bulan dalam satu siklus (3 bulan). Gaji karyawan diasumsikan 0 karena dikelola langsung oleh pemilik. Biaya variabel lain-lain termasuk benih, probiotik, dan molase."
    },
    analisis_roi: {
      modal_awal: 50000000,
      biaya_operasional_per_bulan: 8535000,
      periode_analisis_bulan: 12,
      total_biaya_operasional: 102420000,
      pendapatan_proyeksi: {
        produksi_per_bulan_kg: 536.5,
        harga_jual_per_kg_rp: 26000,
        pendapatan_per_bulan: 13949000,
        pendapatan_total: 167388000
      },
      laba_bersih: 64968000,
      roi_persen: 129.94,
      roi_bulan: 9.24,
      break_even_point_bulan: 10.1
    },
    analisis_bep: {
      biaya_tetap: 3885000,
      biaya_variabel_per_unit: 15040.4,
      harga_jual_per_unit: 26000,
      bep_unit: 354.5,
      bep_rupiah: 9217000,
      margin_of_safety_persen: 77.9,
      penjelasan: "BEP per siklus (3 bulan) tercapai saat penjualan mencapai 354.5 kg. Dengan target produksi 1,609 kg, proyek ini memiliki margin keamanan yang sangat sehat sebesar 77.9%, menunjukkan resiko kerugian yang rendah selama target produksi tercapai."
    },
    proyeksi_pendapatan: {
      periode_proyeksi_bulan: 12,
      asumsi: "Satu siklus budidaya berlangsung 3 bulan. Panen besar dan pendapatan diterima pada bulan ke-3, 6, 9, dan 12. Biaya operasional dikeluarkan setiap bulan. Pemilik tidak mengambil gaji.",
      proyeksi_bulanan: [
        {
          bulan: 1,
          produksi_kg: 0,
          harga_per_kg_rp: 26000,
          pendapatan_rp: 0,
          biaya_rp: 8535000,
          laba_rp: -8535000
        },
        {
          bulan: 2,
          produksi_kg: 0,
          harga_per_kg_rp: 26000,
          pendapatan_rp: 0,
          biaya_rp: 8535000,
          laba_rp: -8535000
        },
        {
          bulan: 3,
          produksi_kg: 1609,
          harga_per_kg_rp: 26000,
          pendapatan_rp: 41834000,
          biaya_rp: 8535000,
          laba_rp: 33299000
        },
        {
          bulan: 4,
          produksi_kg: 0,
          harga_per_kg_rp: 26000,
          pendapatan_rp: 0,
          biaya_rp: 8535000,
          laba_rp: -8535000
        },
        {
          bulan: 5,
          produksi_kg: 0,
          harga_per_kg_rp: 26000,
          pendapatan_rp: 0,
          biaya_rp: 8535000,
          laba_rp: -8535000
        },
        {
          bulan: 6,
          produksi_kg: 1609,
          harga_per_kg_rp: 26000,
          pendapatan_rp: 41834000,
          biaya_rp: 8535000,
          laba_rp: 33299000
        }
      ],
      total_pendapatan: 167336000,
      total_biaya: 102420000,
      total_laba: 64916000,
      roi_akhir_persen: 129.83
    }
  }
};


