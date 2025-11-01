# 📋 Spesifikasi Fungsional - Sistem Analisis Kelayakan Budidaya Ikan

## 🎯 Overview
Sistem web untuk analisis kelayakan proyek budidaya ikan di Sumatra Barat, dengan fitur input data, generate ringkasan, rencana lengkap, dan peta supplier.

---

## 📄 Daftar Halaman & Fitur

### 1. **Landing Page** (`/`)
**Tujuan**: Halaman utama untuk mengenalkan aplikasi

**Komponen:**
- Hero section dengan CTA
- Fitur utama (highlight)
- Testimoni/keuntungan menggunakan sistem
- Footer

**Aksi:**
- Button "Mulai Sekarang" → `/register`
- Button "Masuk" → `/login`

---

### 2. **Login** (`/login`)
**Tujuan**: Autentikasi pengguna yang sudah terdaftar

**Form Fields:**
- Email/Username
- Password
- Remember me (checkbox)

**Aksi:**
- Submit → Dashboard (`/dashboard`)
- Link "Belum punya akun?" → `/register`
- Link "Lupa password?" → Modal/Forgot password

---

### 3. **Register** (`/register`)
**Tujuan**: Pendaftaran pengguna baru

**Form Fields:**
- Nama lengkap
- Email
- Password
- Konfirmasi password
- Terms & conditions (checkbox)

**Aksi:**
- Submit → Login (`/login`) atau langsung ke Dashboard
- Link "Sudah punya akun?" → `/login`

---

### 4. **Dashboard** (`/dashboard`)
**Tujuan**: Overview proyek-proyek yang sudah dibuat

**Komponen:**
- List project cards (grid/list view)
- Filter & search
- Stats cards (total project, pending, completed)

**Aksi:**
- Button "Tambah Project" → `/input` (halaman inputan)
- Card project → Detail/Edit project
- Delete project (dengan konfirmasi)

---

### 5. **Halaman Inputan** (`/input` atau `/project/new`)
**Tujuan**: Input data proyek budidaya ikan

**Form Sections:**

#### A. Lokasi & Lingkungan
- Provinsi: Sumatra Barat (default/disabled)
- Kota/Kabupaten: Select dropdown (Padang, Bukittinggi, dll)
- Alamat detail: Textarea
- Koordinat GPS: Optional (lat, lng)

#### B. Jenis Ikan
- Pilih jenis ikan: Select/Radio
  - Nila
  - Lele
  - Patin
  - Gurame
  - Mas
  - Lainnya (custom input)
- Varietas: Optional (sub-select berdasarkan jenis)

#### C. Modal Investasi
- Total modal yang tersedia: Number input (Rupiah)
- Format: Currency dengan separator
- Validasi: Minimum modal

#### D. Tingkatan Risiko (3 level)
- **Rendah**: Konservatif, modal kecil, risiko minimal
- **Sedang**: Balance, modal medium, risiko moderate
- **Tinggi**: Agresif, modal besar, potensi tinggi

**Aksi:**
- Button "Generate Ringkasan" → `/summary` (halaman hasil generate)
- Button "Simpan sebagai Draft" → Save ke localStorage/database
- Button "Batal" → Kembali ke Dashboard

---

### 6. **Halaman Hasil Generate Ringkasan Awal** (`/summary`)
**Tujuan**: Menampilkan hasil analisis awal berdasarkan input

**Sections:**

#### A. Skor Kelayakan
- Score card (0-100) dengan visual indicator
- Color coding: Red (<50), Yellow (50-70), Green (>70)
- Breakdown skor per aspek

#### B. Potensi Pasar
- Analisis demand lokal/nasional
- Harga rata-rata per kg
- Tren pasar (growing/stable/declining)
- Visual chart (line/bar)

#### C. Estimasi Modal
- Total modal yang dibutuhkan: Currency
- Breakdown:
  - Modal awal (pembuatan kolam, bibit, dll)
  - Modal operasional bulanan
- Perbandingan dengan modal tersedia

#### D. Estimasi Balik Modal (ROI Timeline)
- Perkiraan waktu ROI (bulan/tahun)
- Visual timeline/gantt chart
- Break-even point indicator

#### E. Kesimpulan Ringkasan
- Summary text (generated)
- Rekomendasi (layak/tidak layak)
- Catatan penting

**Aksi:**
- Button "Generate Rencana Lengkap" → `/plan` (halaman rencana lengkap)
- Button "Kembali ke Inputan" → `/input` (edit input)
- Button "Simpan Project" → Save ke dashboard
- Button "Download PDF" → Export ringkasan

---

### 7. **Halaman Generate Rencana Lengkap** (`/plan`)
**Tujuan**: Rencana detail dan komprehensif proyek

**Layout**: Sidebar navigation + Main content area

#### **Navigation Tabs/Submenu:**
1. **Ringkasan** (default)
2. **Spesifikasi Teknis**
3. **Tahapan Pelaksanaan** (Roadmap)
4. **Modal**
   - Simulasi Modal Awal
   - Biaya Operasional Bulanan
   - Proyeksi Pendapatan per Panen
   - ROI dengan Grafik
5. **Peta Supplier**

---

### 7.1. **Submenu: Ringkasan** (`/plan#ringkasan`)
**Isi:**
- Summary dari ringkasan awal
- Quick stats cards
- Highlights utama

---

### 7.2. **Submenu: Spesifikasi Teknis** (`/plan#spesifikasi`)
**Sections:**

#### A. Spesifikasi Kolam
- Ukuran kolam (panjang, lebar, kedalaman)
- Volume air (m³)
- Kapasitas ikan (ekor/kg)
- Sistem sirkulasi air

#### B. Spesifikasi Bibit
- Jumlah bibit awal
- Ukuran bibit (cm/gram)
- Supplier recommended
- Kualitas bibit

#### C. Spesifikasi Pakan
- Jenis pakan
- Jumlah pakan per hari (kg)
- Frekuensi pemberian
- Harga per kg

#### D. Peralatan & Perlengkapan
- List peralatan lengkap
- Spesifikasi teknis
- Harga per unit
- Total biaya

---

### 7.3. **Submenu: Tahapan Pelaksanaan** (`/plan#roadmap`)
**Tujuan**: Roadmap step-by-step pelaksanaan

**Komponen:**
- Timeline vertical/horizontal
- Steps dengan:
  - Nomor step
  - Nama tahapan
  - Durasi (hari/minggu)
  - Status (todo/in-progress/done)
  - Checklist items
  - Dependencies (tahapan sebelumnya)

**Tahapan Contoh:**
1. Persiapan Lahan (1-2 minggu)
   - Survey lokasi
   - Penggalian kolam
   - Pemasangan sistem air
2. Persiapan Bibit (1 minggu)
   - Pemesanan bibit
   - Transportasi
   - Aklimatisasi
3. Penebaran (1 hari)
4. Pemeliharaan (ongoing)
   - Pemberian pakan
   - Monitoring kesehatan
   - Penggantian air
5. Panen (1 hari)
6. Pasca Panen (1 minggu)

---

### 7.4. **Submenu: Modal**

#### 7.4.1. **Simulasi Modal Awal** (`/plan#modal-awal`)
**Breakdown:**
- **Pembuatan Kolam**
  - Penggalian: Rp X
  - Lining/Plastik: Rp X
  - Sistem air: Rp X
  - Subtotal: Rp X
- **Pembelian Bibit**
  - Jumlah: X ekor
  - Harga per ekor: Rp X
  - Subtotal: Rp X
- **Pakan Awal**
  - Jumlah: X kg
  - Harga per kg: Rp X
  - Subtotal: Rp X
- **Peralatan & Perlengkapan**
  - List itemized
  - Harga per item
  - Subtotal: Rp X
- **Biaya Lain-lain**
  - Transportasi
  - Ijin/perizinan
  - Tenaga kerja
  - Subtotal: Rp X

**Total Modal Awal**: Rp X (sum semua subtotal)

---

#### 7.4.2. **Biaya Operasional Bulanan** (`/plan#operasional`)
**Sections:**

**List Biaya:**
- **Listrik**: Rp X/bulan
  - Detail: Watt × Tarif × Jam operasi
- **Air**: Rp X/bulan
  - Detail: Volume (m³) × Tarif
- **Tenaga Kerja**: Rp X/bulan
  - Detail: Jumlah karyawan × Gaji
- **Pakan**: Rp X/bulan
  - Detail: Jumlah pakan (kg) × Harga per kg
- **Obat & Vitamin**: Rp X/bulan
- **Maintenance**: Rp X/bulan
- **Lain-lain**: Rp X/bulan

**Total Operasional Bulanan**: Rp X

**Visual:**
- Pie chart breakdown persentase
- Bar chart per kategori

---

#### 7.4.3. **Proyeksi Pendapatan per Panen** (`/plan#pendapatan`)
**Sections:**

**Input:**
- Jumlah panen per tahun: Number
- Bobot rata-rata ikan: kg/ekor
- Harga jual per kg: Currency
- Jumlah ikan panen: ekor

**Perhitungan:**
- **Total Bobot**: Jumlah ikan × Bobot rata-rata = X kg
- **Pendapatan Kotor**: Total bobot × Harga jual = Rp X
- **Biaya Produksi**: Modal awal + (Operasional bulanan × Durasi) = Rp X
- **Pendapatan Bersih**: Pendapatan kotor - Biaya produksi = Rp X
- **Margin**: (Pendapatan bersih / Pendapatan kotor) × 100 = X%

**Visual:**
- Bar chart: Pendapatan vs Biaya
- Timeline: Projection per panen

---

#### 7.4.4. **ROI dengan Grafik** (`/plan#roi`)
**Sections:**

**Metrics:**
- **ROI**: X% (per tahun)
- **Payback Period**: X bulan/tahun
- **Net Present Value (NPV)**: Rp X
- **Internal Rate of Return (IRR)**: X%

**Visual:**
- **Line Chart**: Cash flow timeline
  - X-axis: Bulan/Tahun
  - Y-axis: Cash flow (Rp)
  - Series: Cumulative cash flow
  - Marker: Break-even point, ROI milestone
- **Area Chart**: Pendapatan vs Biaya over time

**Scenarios:**
- Best case (optimistic)
- Base case (realistic)
- Worst case (pessimistic)

---

### 7.5. **Submenu: Peta Supplier** (`/plan#supplier`)
**Tujuan**: Lokasi supplier di peta interaktif

**Tabs/Filters:**
1. **Bibit Ikan**
   - Marker di peta
   - Info: Nama supplier, alamat, kontak, harga
2. **Pakan**
   - Marker di peta
   - Info: Nama supplier, produk, harga per kg
3. **Pasar/Penjualan**
   - Marker di peta
   - Info: Nama pasar, alamat, range harga
4. **Peralatan**
   - Marker di peta
   - Info: Nama toko, alamat, produk yang dijual

**Features:**
- Interactive map (Google Maps / Leaflet)
- Search location
- Filter by kategori
- Info popup pada marker
- Distance calculation dari lokasi proyek
- Routing/directions

---

## 🧩 Komponen yang Perlu Dibuat

### Navigation & Layout
- ✅ Navbar (sudah ada)
- [ ] Sidebar navigation untuk halaman plan
- [ ] Breadcrumbs (ada, perlu diintegrasikan)

### Forms
- ✅ Input, Select, Textarea (sudah ada)
- [ ] FormInput (wrapper dengan label & validation)
- [ ] FormCurrencyInput (currency formatting)
- [ ] FormLocationPicker (GPS picker)
- [ ] FormRiskLevelSelector (radio dengan description)

### Charts & Visualization
- [ ] LineChart (untuk ROI, cash flow)
- [ ] BarChart (untuk breakdown biaya)
- [ ] PieChart (untuk persentase)
- [ ] AreaChart (untuk projection)
- [ ] TimelineChart (untuk roadmap)

### Maps
- [ ] MapComponent (Google Maps / Leaflet wrapper)
- [ ] MapMarker (custom marker)
- [ ] MapPopup (info popup)

### Cards & Display
- ✅ Card (sudah ada)
- [ ] ProjectCard (untuk dashboard)
- [ ] StatCard (untuk metrics)
- [ ] ScoreCard (untuk skor kelayakan)
- [ ] RoadmapStep (untuk tahapan)

### Tables
- ✅ Table (sudah ada)
- [ ] CostBreakdownTable (untuk breakdown biaya)

### Modals & Overlays
- ✅ Modal, Drawer (sudah ada)
- [ ] ConfirmDialog (untuk konfirmasi delete)

---

## 🔄 Flow Navigation

```
Landing → Login/Register → Dashboard
                              ↓
                          Tambah Project
                              ↓
                          Input Data
                              ↓
                    Generate Ringkasan Awal
                              ↓
                    Generate Rencana Lengkap
                              ↓
                    ┌─────────┴─────────┐
                    ↓                    ↓
              Ringkasan           Spesifikasi Teknis
                    ↓                    ↓
              Roadmap              Modal (submenu)
                    ↓                    ↓
              Peta Supplier        ROI Grafik
```

---

## 📊 Data Models

### Project
```typescript
interface Project {
  id: string;
  name: string;
  location: {
    province: string;
    city: string;
    address: string;
    coordinates?: { lat: number; lng: number };
  };
  fishType: string;
  initialCapital: number;
  riskLevel: 'low' | 'medium' | 'high';
  status: 'draft' | 'generating' | 'completed';
  createdAt: Date;
  updatedAt: Date;
}
```

### Summary
```typescript
interface Summary {
  feasibilityScore: number;
  marketPotential: {
    demand: 'high' | 'medium' | 'low';
    averagePrice: number;
    trend: 'growing' | 'stable' | 'declining';
  };
  capitalEstimate: {
    initial: number;
    operational: number;
    total: number;
  };
  roiEstimate: {
    paybackPeriod: number; // months
    roi: number; // percentage
  };
  conclusion: string;
}
```

---

## 🎨 UI/UX Considerations

- Responsive design (mobile-first)
- Loading states untuk generate
- Error handling & validation
- Confirmation dialogs untuk destructive actions
- Toast notifications untuk feedback
- Skeleton loaders untuk async data
- Empty states untuk no data
- Accessibility (WCAG AA compliance)

---

## 🔐 Authentication & Authorization

- JWT-based auth (optional, bisa start dengan localStorage)
- Protected routes (Dashboard, Input, Plan, Summary)
- Public routes (Landing, Login, Register)

