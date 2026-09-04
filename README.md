# סטיית קלוריות — אפליקציית ווב (PWA)

מעקב יומי אחר סטיית קלוריות מהיעד (חיובי = מעל היעד, שלילי = מתחת). מציג סה״כ שבועי (ראשון–שבת, שבוע ישראלי) וסה״כ חודשי (חודש לוח שנה). הנתונים נשמרים ב־Supabase (טבלת `calorie_entries`) עם כניסה אנונימית; יש מיגרציה חד־פעמית מ־localStorage.

**Live:** https://robert70710.github.io/calorie-deviation/

## חשוב — הפעלת Anonymous Auth

האפליקציה קוראת ל־`signInAnonymously()`. אם Anonymous כבוי בפרויקט, תופיע הודעת שגיאה בעברית.

בלוח הבקרה של Supabase: **Authentication → Providers → Anonymous → Enable**, ואז רעננו את העמוד.

## קבצים

- `index.html` — ממשק בעברית (RTL)
- `styles.css` — עיצוב דמוי iOS (+ סטטוס סנכרון)
- `config.js` — כתובת ו־anon key של Supabase (publishable)
- `app-loader.js` + `app.p1.*.js` / `app.p2.*.js` — לוגיקה (Supabase CRUD)
- supabase-js נטען מ־CDN (unpkg)
- `manifest.webmanifest` — הגדרות PWA
- `sw.js` — Service Worker (`calorie-deviation-v4`)
- `icons/` — אייקונים (SVG + PNG)

אין צורך ב־npm או ב־build — קבצים סטטיים בלבד.

## פתיחה מקומית (בדיקה)

```bash
cd calorie-deviation-web
python3 -m http.server 8080
```

ואז בדפדפן: `http://localhost:8080`

(Service Worker דורש `http://` או `https://` — לא `file://`.)

## פתיחה באייפון (Safari) והוספה למסך הבית

1. פתחו את כתובת GitHub Pages ב־Safari באייפון.
2. ב־Safari לחצו על כפתור **שיתוף** (□↑).
3. גללו ובחרו **הוסף למסך הבית** (Add to Home Screen).
4. אשרו את השם «סטיית קלוריות» ולחצו **הוסף**.

לאחר עדכון גרסה, רעננו פעם אחת ב־Safari (או נקו cache של ה־SW) לפני שה־Home Screen מתעדכן.

## שימוש

- **רישום היום** — רישום/עריכת סטיית היום.
- ניווט שבוע/חודש — חיצים בכרטיסי הסה״כ.
- **מעל / מתחת ליעד** — בטוגל במודל.
- היסטוריה — עריכה ומחיקה; סינון שבוע/חודש/הכל.
