# סטיית קלוריות — אפליקציית ווב (PWA)

מעקב יומי אחר סטיית קלוריות מהיעד, משקל, גרפים ותובנות. נתונים ב-Supabase עם אימות אימייל+סיסמה (RLS לפי auth.uid()).

## אימות (Supabase Auth)
1. Authentication → Providers → Email = ON
2. לבדיקות: Confirm email = OFF (אחרת אחרי הרשמה מופיע «בדוק אימייל לאישור»)
3. **איפוס סיסמה:** ב-Authentication → URL Configuration הגדירו:
   - Site URL: `https://robert70710.github.io/calorie-deviation/`
   - Redirect URLs: הוסיפו את אותה כתובת (חובה ל-`resetPasswordForEmail`)
4. Anonymous אינו נדרש — האפליקציה דורשת התחברות

## טבלאות
- `calorie_entries` — סטיית קק״ל ליום
- `weight_entries` — משקל (ק״ג) ליום
- `user_settings` — `daily_deficit_goal` (שלילי, ברירת מחדל −500), `kcal_per_kg` (7700)

## נוסחאות תובנות
- `deviationSum` = סכום סטיות יומיות בתקופה
- `goalSum` = יעד גרעון יומי × מספר ימים (בתקופה נוכחית: מתחילת התקופה עד היום כולל)
- תחזית משקל ק״ג = `deviationSum / kcal_per_kg`
- סטייה מהיעד ← תחזית = `(deviationSum - goalSum) / kcal_per_kg`
- התאמה יומית ממוצעת = `(actualDeltaKg * kcal_per_kg - deviationSum) / nDays`

## קבצים
index.html, styles.css, app.js (מאוחד), config.js, sw.js (`calorie-deviation-v6`), manifest, icons/

## בדיקה מקומית
python3 -m http.server 8080

## Live
https://robert70710.github.io/calorie-deviation/

לאחר פריסה: רענון קשיח בטלפון כדי לטעון את ה-SW החדש.
