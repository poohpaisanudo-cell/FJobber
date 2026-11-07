import Link from "next/link";
import { applications, statusLabels } from "@/lib/mock-data";

const features = [
  { title: "ติดตามการสมัคร", desc: "เก็บบริษัท ตำแหน่ง สถานะ และวันปิดรับสมัครไว้ในที่เดียว" },
  { title: "รีวิวจากรุ่นพี่", desc: "ดูค่าตอบแทน คำถามสัมภาษณ์ และประสบการณ์จริงของแต่ละบริษัท" },
  { title: "เตือนก่อนหมดเวลา", desc: "ดูรายการที่ใกล้ครบกำหนดในแดชบอร์ดเดียว ไม่พลาดวันสมัคร" },
];

export default function Home() {
  const upcoming = [...applications]
    .sort((a, b) => a.deadline.localeCompare(b.deadline))
    .slice(0, 3);

  return (
    <main className="mx-auto max-w-5xl px-4 py-12">
      <section className="text-center">
        <h1 className="text-3xl font-bold sm:text-4xl">
          หาที่ฝึกงานให้ง่ายขึ้น ไม่พลาดทุกกำหนดการ
        </h1>
        <p className="mt-4 text-gray-600 dark:text-gray-400">
          เว็บติดตามการสมัครฝึกงานและแชร์รีวิวสำหรับนักศึกษา
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link
            href="/login"
            className="rounded-md bg-blue-600 px-5 py-2.5 text-white hover:bg-blue-700"
          >
            เริ่มใช้งาน
          </Link>
          <Link
            href="/companies"
            className="rounded-md border border-gray-300 px-5 py-2.5 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
          >
            ดูรีวิวบริษัท
          </Link>
        </div>
      </section>

      <section className="mt-12 grid gap-4 sm:grid-cols-3">
        {features.map((f) => (
          <div key={f.title} className="rounded-lg border border-gray-200 p-5 dark:border-gray-800">
            <h2 className="font-semibold">{f.title}</h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{f.desc}</p>
          </div>
        ))}
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-semibold">ใกล้ครบกำหนด (ข้อมูลตัวอย่าง)</h2>
        <ul className="mt-4 divide-y divide-gray-200 rounded-lg border border-gray-200 dark:divide-gray-800 dark:border-gray-800">
          {upcoming.map((a) => (
            <li key={a.id} className="flex items-center justify-between p-4">
              <div>
                <p className="font-medium">{a.company}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{a.position}</p>
              </div>
              <div className="text-right text-sm">
                <p>{a.deadline}</p>
                <p className="text-gray-600 dark:text-gray-400">{statusLabels[a.status]}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}