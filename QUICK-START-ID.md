# 🚀 QUICK START - CARA PAKAI DASHBOARD (FIXED!)

## ⚠️ PENTING: STRUKTUR FILE

Dashboard ini **HARUS** punya struktur kayak gini:

```
folder-dashboard/
├── index.html              ← Buka ini dulu!
├── data-fetcher.js
├── validator.js
├── recharge-validator.js   ← File baru!
├── script.js
├── styles.css
├── sample-recharge-data.csv
├── TEST-SETUP.html         ← Test dulu pakai ini!
├── pages/
│   ├── entries.html       ← Upload CSV di sini!
│   ├── results.html
│   ├── winners.html
│   └── reports.html
└── README-FIXED.md
```

**JANGAN** ubah struktur ini! Kalau file ada di tempat yang salah, dashboard ga akan jalan!

---

## 🎯 CARA PAKAI (4 LANGKAH GAMPANG)

### 1️⃣ EXTRACT SEMUA FILE
```
1. Download semua files
2. Extract ke satu folder
3. Pastikan struktur sama persis kayak di atas
```

### 2️⃣ TEST SETUP (PENTING!)
```
1. Buka file: TEST-SETUP.html di browser
2. Klik "▶️ Run Tests"
3. Kalau semua ✅ PASS → lanjut step 3
4. Kalau ada yang ❌ FAIL → fix dulu!
```

### 3️⃣ BUKA DASHBOARD
```
1. Buka file: index.html
2. Klik menu: "All Entries"
3. You'll see upload section di atas
```

### 4️⃣ UPLOAD RECHARGE CSV
```
Di halaman Entries:
1. Klik "Choose File"
2. Pilih CSV recharge (account_change-xxx.csv)
3. Klik "Upload & Validate"
4. Wait 2-3 seconds
5. BOOM! ✅ Semua tickets langsung ter-validate!
```

---

## 🧪 TEST DULU (Before Real Data)

Mau test dulu sebelum pakai data beneran?

```
1. Buka TEST-SETUP.html → Run Tests
2. Kalau pass semua, buka index.html
3. Klik "All Entries"
4. Upload: sample-recharge-data.csv
5. Klik "Upload & Validate"
6. Lihat hasilnya!
```

---

## ✅ HASIL SETELAH UPLOAD

### Before:
```
Semua tickets: ❓ UNKNOWN (belum tau valid/invalid)
```

### After:
```
✅ VALID tickets → badge hijau
❌ INVALID tickets → badge merah  
⚠️ CUTOFF flags → badge kuning
```

### Klik "🔍 Details" untuk lihat:
- Kenapa valid/invalid
- Recharge mana yang di-bind
- Kapan recharge, kapan ticket
- Penjelasan lengkap

---

## 🚨 KALAU GA JALAN

### Problem: "TEST-SETUP shows FAIL"
**Fix:**
1. Check file structure EXACT sama
2. `recharge-validator.js` MUST be di folder root
3. `entries.html` MUST be di folder `pages/`

### Problem: "Upload button ga ngapa-ngapain"
**Fix:**
1. Buka browser console (F12)
2. Look for RED errors
3. Screenshot error
4. Check file structure lagi

### Problem: "All tickets masih UNKNOWN after upload"
**Fix:**
1. Check console (F12) for errors
2. Make sure CSV format correct (Chinese headers)
3. Make sure column 6 ada "充值"

### Problem: "Navigation links ga work"
**Fix:**
```
index.html links harus: pages/entries.html
entries.html links harus: ../index.html

Kalau salah, fix paths-nya!
```

---

## 📊 YANG DITAMPILKAN

### Stats Cards (Muncul after upload):
- ✅ **Valid Tickets** → Berapa yang valid
- ❌ **Invalid Tickets** → Berapa yang invalid
- ⚠️ **Cutoff Shifts** → Berapa yang cross cutoff
- 📊 **Total Recharges** → Total recharges yang di-load

### Table Columns:
- **Validity** → Badge VALID/INVALID/UNKNOWN
- **Registration DateTime** → Kapan ticket dibuat
- **Game ID** → Member ID
- **Recharge Info** → Recharge yang di-bind
- **Actions** → Button "🔍 Details"

### Filters:
- **Validity** → Filter VALID/INVALID/UNKNOWN
- **Cutoff Flag** → Show cuma yang cutoff
- **Game ID, WhatsApp, Contest, Draw Date**

---

## 💡 PRO TIPS

### Untuk Tim Ops:
1. **Pas user complain:**
   - Cari ticket di table (filter by Game ID)
   - Klik "🔍 Details"
   - Copy explanation buat user
   - DONE! Ga perlu manual check!

2. **Mau lihat cuma yang invalid:**
   - Filter: Validity → "❌ Invalid Only"
   - Apply Filters
   - Export CSV kalau mau

3. **Mau lihat cutoff cases:**
   - Filter: Cutoff Flag → "⚠️ Flagged Only"
   - Ini yang recharge sebelum 20:00, ticket sesudah 20:00

### Untuk Testing:
1. **Test dengan sample data dulu**
2. **Kalau jalan, baru pakai real data**
3. **Kalau ada issue, screenshot console error (F12)**

---

## 🛡️ SECURITY

- Semua proses di browser (client-side)
- Ga ada data ke server external
- CSV data cuma di memory
- Refresh page = data cleared
- AMAN pakai real data

---

## 📞 KALAU MASIH GA BISA

Send ke developer:
1. ✅ Screenshot TEST-SETUP results
2. ✅ Screenshot browser console (F12) yang error
3. ✅ Browser name & version
4. ✅ What you tried

---

## 🔥 CHECKLIST

Sebelum complain, check ini dulu:

```
☐ Extract semua files ke satu folder
☐ File structure EXACT sama dengan di atas
☐ Run TEST-SETUP.html → all tests PASS
☐ Open index.html → dashboard loads
☐ Click "All Entries" → page loads
☐ Upload CSV → file selected
☐ Click "Upload & Validate" → wait 2-3 seconds
☐ Check console (F12) → no RED errors
```

Kalau semua ☑️ tapi masih ga jalan, baru contact developer dengan screenshots!

---

**INTINYA:**
1. ✅ Extract files with correct structure
2. ✅ Run TEST-SETUP.html first
3. ✅ Open index.html → All Entries
4. ✅ Upload recharge CSV
5. ✅ Klik "🔍 Details" kalau user complain

**DONE!** 🎉

