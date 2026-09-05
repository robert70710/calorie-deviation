# סטיית קלוריות — אפליקציית ווב (PWA)

מעקב יומי אחר סטיית קלוריות מהיעד. נתונים ב-Supabase עם אימות אימייל+סיסמה (RLS לפי auth.uid()).

## אימות (Supabase Auth)
1. Authentication → Providers → Email = ON
2. לבדיקות: Confirm email = OFF (אחרת אחרי הרשמה מופיע «בדוק אימייל לאישור»)
3. Anonymous אינו נדרש — האפליקציה דורשת התחברות

## קבצים
index.html, styles.css, app.js, app-loader.js, config.js, sw.js (calorie-deviation-v5), manifest, icons/

## בדיקה מקומית
python3 -m http.server 8080

## Live
https://robert70710.github.io/calorie-deviation/
