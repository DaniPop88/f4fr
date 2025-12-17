# ✅ LOTTERY DASHBOARD - FIXED VERSION

## 🚨 IMPORTANT: FILE STRUCTURE

Your dashboard MUST have this EXACT structure:

```
lottery-dashboard/
├── index.html                 ← Main dashboard (OPEN THIS FIRST!)
├── data-fetcher.js
├── validator.js
├── recharge-validator.js      ← NEW! For validity checking
├── script.js
├── styles.css
├── sample-recharge-data.csv   ← Sample data for testing
├── pages/
│   ├── entries.html          ← Upload recharge CSV here!
│   ├── results.html
│   ├── winners.html
│   └── reports.html
└── README.md
```

## 🚀 HOW TO USE (3 STEPS)

### **STEP 1: Extract All Files**
Extract semua files ke satu folder dengan struktur di atas.
**JANGAN** ubah struktur folder!

### **STEP 2: Open Dashboard**
```
1. Buka file: index.html di browser
2. Klik menu: "All Entries"
```

### **STEP 3: Upload Recharge CSV**
```
Di halaman Entries:
1. Klik "Choose File"
2. Pilih CSV recharge (account_change-xxx.csv)
3. Klik "Upload & Validate"
4. DONE! ✅
```

## 🔥 QUICK TEST

Mau test dulu sebelum pakai real data?

1. Buka `index.html`
2. Klik "All Entries"
3. Upload file `sample-recharge-data.csv`
4. Klik "Upload & Validate"
5. Lihat hasilnya!

## ❌ COMMON ERRORS & FIXES

### Error: "Failed to fetch data"
**Fix:** Make sure `data-fetcher.js` ada di folder yang sama dengan `index.html`

### Error: "rechargeValidator is not defined"
**Fix:** Make sure `recharge-validator.js` ada di folder root (bukan di pages/)

### Error: "Cannot read property 'parseRechargeCSV'"
**Fix:** Make sure script load order correct:
```html
<script src="../data-fetcher.js"></script>
<script src="../validator.js"></script>
<script src="../recharge-validator.js"></script>
```

### Error: "Navigation links don't work"
**Fix:** Make sure file structure exactly matches the structure above

## 📁 FILES EXPLAINED

### **Root Files (Must be in root folder):**
- `index.html` - Homepage dashboard
- `data-fetcher.js` - Load tickets from Google Sheets
- `validator.js` - Winner validation
- `recharge-validator.js` - **NEW!** Ticket validity validation
- `script.js` - Dashboard scripts
- `styles.css` - Styling

### **Pages Folder (Must be in pages/ subfolder):**
- `entries.html` - **THIS IS WHERE YOU UPLOAD RECHARGE CSV!**
- `results.html` - Contest results
- `winners.html` - Winners list
- `reports.html` - Reports

## 🎯 WHAT HAPPENS AFTER UPLOAD?

### Before Upload:
```
All tickets show: ❓ UNKNOWN
```

### After Upload:
```
✅ VALID tickets (green badge)
❌ INVALID tickets (red badge)
⚠️ CUTOFF flags (yellow badge)
```

### Click "🔍 Details" on any ticket to see:
- Why it's valid/invalid
- Which recharge it's bound to
- Recharge time & amount
- Full explanation

## 📊 DASHBOARD FEATURES

### Validation Stats Cards:
- **✅ Valid Tickets** - Tickets yang valid
- **❌ Invalid Tickets** - Tickets yang invalid
- **⚠️ Cutoff Shifts** - Tickets yang cross cutoff time
- **📊 Total Recharges** - Total recharges loaded

### Filters:
- **Validity** → Filter by VALID/INVALID/UNKNOWN
- **Cutoff Flag** → Show only cutoff cases
- **Game ID, WhatsApp, Contest, Draw Date** → Standard filters

### Table Columns:
- **Validity Badge** - VALID ✅ / INVALID ❌ / UNKNOWN ❓
- **Registration DateTime** - When ticket created
- **Game ID** - Member ID
- **WhatsApp** - Contact
- **Chosen Numbers** - Selected numbers
- **Draw Date** - Draw date
- **Contest** - Contest number
- **Ticket #** - Ticket number
- **Recharge Info** - Bound recharge details
- **Actions** - "🔍 Details" button

## 🛠 TROUBLESHOOTING

### Problem: "All tickets showing UNKNOWN"
**Solution:** You haven't uploaded recharge CSV yet!
1. Go to "All Entries" page
2. Click "Choose File"
3. Select recharge CSV
4. Click "Upload & Validate"

### Problem: "Upload button doesn't do anything"
**Solution:** Check browser console (F12):
- If error says "rechargeValidator is not defined" → `recharge-validator.js` missing
- If error says "Cannot read property" → Script load order wrong

### Problem: "CSV upload fails"
**Solution:** Make sure CSV format is correct:
- Must have Chinese headers: 会员id, 订单号, 记录时间, etc.
- Column 6 must have "充值" for recharge records
- Time format: `YYYY-MM-DD HH:mm:ss.SSS`

### Problem: "Page shows blank after upload"
**Solution:** Check browser console for JavaScript errors
- Press F12
- Look for red errors
- Screenshot and send to developer

## 📱 BROWSER COMPATIBILITY

Works on:
- ✅ Chrome (recommended)
- ✅ Firefox
- ✅ Edge
- ✅ Safari
- ⚠️ Mobile browsers (responsive but desktop recommended)

## 🔒 DATA SECURITY

- All processing happens **client-side** (in your browser)
- No data sent to external servers
- CSV data stored in memory only
- Refresh page = data cleared
- Safe to use with real data

## 💡 PRO TIPS

1. **Always upload recharge CSV first** before checking tickets
2. **Use filters** to quickly find invalid tickets
3. **Click "🔍 Details"** to get instant explanation for disputes
4. **Export CSV** to save validation results
5. **Clear Recharge Data** to upload new/updated recharge file

## 📞 SUPPORT

If still not working after following this:
1. Take screenshot of error (F12 console)
2. Check file structure matches exactly
3. Try with sample-recharge-data.csv first
4. Contact developer with:
   - Screenshot of error
   - Browser name & version
   - What you tried to do

---

**VERSION:** 2.0 (Fixed)  
**LAST UPDATE:** December 2025  
**STATUS:** ✅ Working (if file structure correct!)
