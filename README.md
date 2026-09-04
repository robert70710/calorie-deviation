# מעקב סטיית קלוריות · Calorie Deviation Tracker

אפליקציית iPhone מקורית ב־SwiftUI לרישום **סטייה יומית מהיעד הקלורי** (קק״ל), עם סיכום שבועי וחודשי.  
Native SwiftUI iPhone app: log daily calorie **deviation** (kcal; + over goal, − under), with weekly and monthly totals.

אין שרת, אין HealthKit, אין התחברות — הכל נשמר מקומית ב־SwiftData.  
No backend, no HealthKit, no login — local SwiftData only.

---

## דרישות / Requirements

- macOS עם **Xcode 15+** (מומלץ Xcode 16)
- iOS **17.0+** (סימולטור או מכשיר)
- בחרו את ה־Team שלכם ב־Signing & Capabilities אם מריצים על מכשיר אמיתי

---

## פתיחה ב־Xcode / Open in Xcode

1. פרקו את ה־zip (אם קיבלתם ארכיון) או העתיקו את התיקייה `calorie-deviation`.
2. פתחו את הקובץ:
   ```
   CalorieDeviationTracker.xcodeproj
   ```
3. בחרו סימולטור iPhone (או מכשיר מחובר).
4. לחצו ▶ Run (⌘R).

אם Xcode מבקש Team:  
**Target → Signing & Capabilities → Team** → בחרו את חשבון Apple שלכם.  
`PRODUCT_BUNDLE_IDENTIFIER` כרגע: `com.example.CalorieDeviationTracker` — שנו אותו אם צריך.

---

## גבול השבוע (ישראל) / Week boundary (Israel)

**השבוע באפליקציה הוא ראשון–שבת** (כמקובל בישראל), לא שני–ראשון.

| | |
|---|---|
| **עברית** | סכום שבועי = כל הרישומים מתחילת **יום ראשון** (00:00 לפי שעון המכשיר) ועד סוף **שבת**. |
| **English** | Weekly sum = all entries from **Sunday 00:00** (device local time) through **Saturday**. `Calendar.firstWeekday = 1`. |

הסכום החודשי הוא לפי **חודש לוח שנה** (1–סוף החודש).  
Monthly sum = calendar month (1st through last day).

---

## מסכים / Screens

1. **בית (ContentView)** — סכום שבועי גדול, סכום חודשי, כרטיס «היום» עם כפתור רישום/עריכה, רישומים אחרונים.
2. **עריכת רישום (EntryEditorView)** — בחירת מעל/מתחת ליעד, מספר קק״ל, הערה אופציונלית, מחיקה.
3. **היסטוריה (HistoryView)** — רשימת כל הרישומים; הקשה לעריכה; החלקה למחיקה.
4. **בחירת יום קודם (PastDatePickerSheet)** — DatePicker לעריכת/הוספת יום בעבר.

ממשק בעברית ו־RTL; ספרות מערביות.

---

## איך לארוז ולהעלות ל־GitHub / Zip & upload to GitHub

### יצירת zip (מ־Terminal במק)

```bash
cd /path/to/parent
zip -r calorie-deviation.zip calorie-deviation \
  -x "*.DS_Store" -x "*/xcuserdata/*" -x "*/DerivedData/*"
```

או מהתיקייה עצמה:

```bash
cd calorie-deviation/..
zip -r calorie-deviation.zip calorie-deviation -x "*.DS_Store" -x "*xcuserdata*"
```

### העלאה ל־GitHub

**אופציה א׳ — אתר GitHub**

1. צרו repository חדש (ללא README אם כבר יש כאן).
2. **Add file → Upload files** והעלו את תוכן התיקייה, או העלו את ה־zip ופרקו מקומית לפני push.

**אופציה ב׳ — git מקומי**

```bash
cd calorie-deviation
git init
git add .
git commit -m "Initial Calorie Deviation Tracker app"
git branch -M main
git remote add origin https://github.com/YOUR_USER/YOUR_REPO.git
git push -u origin main
```

אל תכללו `xcuserdata` או `DerivedData` ב־commit (מומלץ `.gitignore`).

---

## מבנה הפרויקט / Project layout

```
calorie-deviation/
├── README.md
├── CalorieDeviationTracker.xcodeproj/
└── CalorieDeviationTracker/
    ├── CalorieDeviationTrackerApp.swift
    ├── Models/DailyEntry.swift
    ├── Helpers/DateHelpers.swift, Formatters.swift
    ├── Views/ContentView, TotalCard, EntryRow,
    │         EntryEditorView, HistoryView, PastDatePickerSheet
    └── Assets.xcassets/
```

---

## רישיון / License

לשימוש אישי / Personal use. שנו bundle id ו־signing לפי הצורך.
