# MediBook Backend (Node.js / Express)

باك إند جاهز ومطابق تمامًا لكل اللي الفرونت بتاعك (`doctorService`, `authService`, `appointmentService`, `adminService`) متوقعه. مفيش أي تعديل مطلوب في الفرونت غير `.env`.

## التشغيل

```bash
npm install
cp .env.example .env
npm run seed     # بيعمل بيانات تجريبية (دكاترة + specialties + مريض + أدمن)
npm start        # أو npm run dev للتشغيل مع auto-restart
```

السيرفر هيشتغل على `http://localhost:8000/api`.

> البيانات متخزنة في ملف `data.json` (هيتعمل تلقائي أول مرة تشغّل فيها السيرفر/الـ seed). معندكش قاعدة بيانات خارجية لازم تتثبت — كل حاجة JS pure من غير أي native build، عشان كده مفيش مشاكل تثبيت زي اللي بتحصل مع `better-sqlite3` أو حاجة زيها.

## حسابات تجريبية (بعد عمل seed)

كل الباسورد: `password123`

| الدور | الإيميل |
|---|---|
| Patient | patient@medibook.test |
| Admin | admin@medibook.test |
| Doctor | ahmed.hassan@medibook.test (وكمان sara.mostafa@, omar.khalil@, mona.adel@, youssef.tarek@, laila.farouk@medibook.test) |

## ربطه بالفرونت

في مجلد الفرونت (`medical-final`)، اعمل ملف `.env`:

```
VITE_API_URL=http://localhost:8000/api
```

وبعدين شغل الفرونت زي العادة (`npm run dev`). الـ axios instance في `src/services/api.js` بيقرأ `VITE_API_URL` تلقائيًا، فمفيش أي تعديل تاني مطلوب.

## الـ Endpoints المتاحة

### Auth (`/api/auth`)
- `POST /register` — `{ first_name, last_name, email, phone, password, role }` → `{ access, user }`
- `POST /login` — `{ email, password }` → `{ access, user }`
- `GET /profile` — يحتاج توكين
- `PUT /profile` — يحتاج توكين
- `POST /logout`

### Doctors (عام، مش محتاج تسجيل دخول)
- `GET /doctors?search=&specialty=&sort_by=&page=&page_size=` → `{ results, count }`
- `GET /doctors/:id`
- `GET /doctors/:id/availability`

### Doctor (يحتاج توكين بدور doctor)
- `PUT /doctor/profile`
- `POST /doctor/availability` — `{ day, start_time, end_time, is_available }` أو `{ slots: [...] }`
- `GET /doctor/appointments`

### Appointments (يحتاج توكين)
- `POST /appointments/book` — `{ doctor_id, slot_id }`
- `GET /appointments` — مواعيد المريض الحالي
- `PUT /appointments/:id/status` — `{ status, notes }`

### Admin (يحتاج توكين بدور admin، ما عدا specialties اللي للقراءة فقط متاحة للكل)
- `GET /admin/specialties`
- `GET /admin/users?role=`
- `PUT /admin/users/:id`
- `POST /admin/specialties`
- `DELETE /admin/specialties/:id`
- `GET /admin/appointments`

## ملاحظات مهمة

1. **JWT_SECRET**: غيّره في `.env` لأي قيمة عشوائية طويلة قبل أي استخدام حقيقي (مش بس للتجربة المحلية).
2. **CORS_ORIGIN**: لو الفرونت بتشتغله على بورت مختلف عن `5173`، عدّل القيمة في `.env`.
3. **يوم الأسبوع (`day`)**: 0 = الأحد، 1 = الاثنين ... 6 = السبت (زي ما الفرونت متوقع بالظبط في `AvailabilityTable.jsx`).
4. لو عايز ترجع للبيانات الافتراضية تاني، امسح `data.json` وشغل `npm run seed` تاني.
