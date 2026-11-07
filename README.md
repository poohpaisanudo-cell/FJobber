# FJobber
สถาปัตยกรรมระบบแบบ Microservices (System Architecture)
โครงการ FJobber: เว็บช่วยติดตามการสมัครฝึกงานและแชร์รีวิวสำหรับนักศึกษา
1. ภาพรวม

FJobber แบ่งเป็นบริการย่อยตามหน้าที่ทางธุรกิจ 3 ตัว (Auth, Tracker, Review) มี API Gateway เป็นประตูทางเข้าเดียว และมีหน้าบ้านที่สร้างด้วย Next.js ทุกบริการรันแยกกันในรูปแบบ container ผ่าน Docker Compose ข้อมูลเก็บ 2 ฐาน คือ MySQL สำหรับข้อมูลที่มีโครงสร้างและความสัมพันธ์ และ MongoDB สำหรับข้อมูลที่รูปแบบยืดหยุ่นหรือเพิ่มขึ้นเรื่อยๆ

2. ตารางเซอร์วิส
เซอร์วิส / โฟลเดอร์	พอร์ต	เทคโนโลยีหลัก	หน้าที่รับผิดชอบ
frontend/	3000	Next.js, TypeScript, Tailwind CSS, React Hook Form, dnd-kit	ส่วนติดต่อผู้ใช้ทั้งหมด เช่น หน้าสมัคร/ล็อกอิน บอร์ด Kanban แดชบอร์ดรายการใกล้ครบกำหนด ฟอร์มรีวิว หน้าบริษัท
gateway/	4000	Node.js, Express, TypeScript, http-proxy-middleware, jsonwebtoken	ประตูทางเข้าเดียวของระบบ ตรวจ JWT ส่งต่อคำขอไปยังบริการที่ถูกต้อง แนบ x-user-id ให้บริการหลังบ้าน จัดการ CORS และ rate limit
services/auth/	4001	Express, TypeScript, Prisma, bcryptjs, jsonwebtoken, Zod	สมัครสมาชิก (จำกัดอีเมล .ac.th) ล็อกอิน ออก JWT จัดการโปรไฟล์ (คณะ สาขา ชั้นปี)
services/tracker/	4002	Express, TypeScript, Prisma (MySQL), Mongoose (MongoDB), Zod	จัดการใบสมัครฝึกงาน (เพิ่ม/แก้/ลบ/ย้ายสถานะ) รายการใกล้ครบกำหนด โน้ตและ checklist ประวัติการย้ายสถานะ การตั้งค่าตัวกรองของผู้ใช้
services/review/	4003	Express, TypeScript, Prisma (MySQL), Mongoose (MongoDB), Zod	จัดการข้อมูลบริษัท รีวิวหลังฝึกงานแบบไม่ระบุชื่อ รายละเอียดรีวิว (คำถามสัมภาษณ์ ขั้นตอน เคล็ดลับ) ค้นหาบริษัท สรุปคะแนนรวม
mysql (container)	3306	MySQL 8	ฐานข้อมูลเชิงสัมพันธ์ แยกเป็น 3 database: auth_db, tracker_db, review_db
mongodb (container)	27017	MongoDB 7	ฐานข้อมูลเอกสาร แยกเป็น 2 database: tracker_mongo, review_mongo

4. โครงสร้างโฟลเดอร์
fjobber/
├── docker-compose.yml
├── .env
├── .gitignore
├── .env.example
├── frontend/
├── gateway/
└── services/
    ├── auth/
    ├── tracker/
    └── review/

แต่ละบริการมี package.json, Dockerfile และ .env ของตัวเอง

4. การไหลของคำขอ (Request Flow)
ผู้ใช้ใช้งานผ่านเบราว์เซอร์ หน้าบ้าน (3000) ส่งคำขอไปที่ Gateway (4000) เท่านั้น
Gateway ตรวจว่าเส้นทางนั้นเปิดสาธารณะหรือไม่ เช่น /api/auth/register และ /api/auth/login ผ่านได้โดยไม่ต้องมี token ส่วนเส้นทางอื่นต้องมี JWT ที่ถูกต้อง
ถ้า JWT ผ่าน Gateway แนบ x-user-id ลงใน header แล้วส่งต่อไปยังบริการเป้าหมาย
บริการหลังบ้านเชื่อ x-user-id จาก Gateway และใช้ตรวจสิทธิ์ว่าข้อมูลเป็นของผู้ใช้คนนั้นจริง
บริการประมวลผล อ่าน/เขียนฐานข้อมูลของตัวเอง แล้วตอบกลับผ่าน Gateway

ตารางเส้นทางของ Gateway

เส้นทางที่เข้า Gateway	ส่งต่อไปที่	ต้องมี JWT
/api/auth/register, /api/auth/login	Auth (4001)	ไม่ต้อง
/api/auth/me, /api/auth/profile	Auth (4001)	ต้อง
/api/applications/*	Tracker (4002)	ต้อง
/api/companies/*, /api/reviews/*	Review (4003)	ต้อง
5. ข้อมูลที่แต่ละบริการเป็นเจ้าของ
บริการ	MySQL	MongoDB
Auth	users (อีเมล รหัสผ่านแบบ hash คณะ สาขา ชั้นปี)	ไม่มี
Tracker	applications (ผู้ใช้ บริษัท ตำแหน่ง สถานะ วันปิดรับสมัคร วันสัมภาษณ์)	application_notes, activity_logs, user_preferences
Review	companies, reviews (ค่าตอบแทน ความยาก คะแนนรวม)	review_details (คำถามสัมภาษณ์ ขั้นตอน งานที่ได้ทำ เคล็ดลับ)

เหตุผลที่ใช้สองฐานข้อมูล

MySQL เหมาะกับข้อมูลที่ฟิลด์ตายตัว ต้องการความสัมพันธ์และความถูกต้อง เช่น ผู้ใช้ ใบสมัคร บริษัท
MongoDB เหมาะกับข้อมูลที่แต่ละรายการมีรูปแบบต่างกัน เช่น รายการคำถามสัมภาษณ์ที่มีจำนวนไม่เท่ากัน หรือ log ที่เพิ่มขึ้นเรื่อยๆ
6. หลักการออกแบบ
Single Responsibility: แต่ละบริการดูแลเรื่องเดียว และแยกตามหน้าที่ทางธุรกิจ
Database per Service: บริการอื่นห้ามเชื่อมฐานข้อมูลของบริการอื่นโดยตรง ต้องเรียกผ่าน API
Single Entry Point: ทุกคำขอจากภายนอกผ่าน Gateway ทำให้ตรวจสิทธิ์ที่เดียว
Stateless Authentication: ใช้ JWT ที่ Auth เป็นผู้ออก บริการอื่นตรวจลายเซ็นได้เองโดยไม่ต้องถามกลับไปที่ Auth ทุกครั้ง
Containerization: ทุกส่วนรันใน Docker ด้วยคำสั่ง docker compose up ได้ผลเหมือนกันทุกเครื่อง
Loose Coupling: เอกสารใน MongoDB อ้างอิง userId, applicationId, reviewId ที่อยู่ใน MySQL ของบริการเดียวกัน ไม่มีการ JOIN ข้ามบริการ
7. ความปลอดภัย
รหัสผ่านเข้ารหัสด้วย bcrypt ก่อนเก็บ
ตรวจรูปแบบข้อมูลทุก endpoint ด้วย Zod
จำกัดโดเมนอีเมล .ac.th ที่ฝั่งเซิร์ฟเวอร์ของ Auth
ผู้เขียนรีวิวไม่ถูกเปิดเผย ข้อมูลที่ส่งออกจาก Review service ไม่มี userId
ค่าลับ (รหัสผ่านฐานข้อมูล, JWT_SECRET) เก็บใน .env และไม่ commit ขึ้น Git
บริการหลังบ้านไม่เปิดพอร์ตออกสู่ภายนอกใน production เข้าถึงได้ผ่าน Gateway เท่านั้น
8. ข้อจำกัดและแนวทางพัฒนาต่อ
การเขียนข้อมูลสองฐานในคำขอเดียว (เช่น บันทึกรีวิว) ไม่มี transaction ข้ามฐาน จึงเขียน MySQL ก่อน แล้วค่อยเขียน MongoDB และ rollback ฝั่งแรกถ้าฝั่งหลังล้มเหลว
สื่อสารระหว่างบริการด้วย HTTP/REST แบบซิงโครนัส ในอนาคตอาจเพิ่ม message queue เช่น RabbitMQ สำหรับงานแจ้งเตือน
งานในอนาคต: ส่งอีเมลแจ้งเตือนก่อนครบกำหนด, AI สรุปรีวิวและซ้อมสัมภาษณ์, ซิงก์ Google Calendar, ระบบ Admin ตรวจรีวิวที่ถูกรายงาน
