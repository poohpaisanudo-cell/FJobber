export type Status = "interested" | "applied" | "interview" | "result";

export const statusLabels: Record<Status, string> = {
  interested: "สนใจ",
  applied: "สมัครแล้ว",
  interview: "สัมภาษณ์",
  result: "ได้ผลแล้ว",
};

export const applications = [
  { id: 1, company: "บริษัท เอบีซี เทคโนโลยี", position: "Frontend Intern", status: "applied" as Status, deadline: "2026-11-20" },
  { id: 2, company: "ธนาคารตัวอย่าง", position: "Data Analyst Intern", status: "interview" as Status, deadline: "2026-11-15" },
  { id: 3, company: "สตาร์ทอัพ XYZ", position: "Backend Intern", status: "interested" as Status, deadline: "2026-12-01" },
  { id: 4, company: "บริษัท ดีไซน์ จำกัด", position: "UX/UI Intern", status: "result" as Status, deadline: "2026-10-30" },
];

export const companies = [
  { id: 1, name: "บริษัท เอบีซี เทคโนโลยี", province: "กรุงเทพฯ", reviewCount: 4, rating: 4.2 },
  { id: 2, name: "ธนาคารตัวอย่าง", province: "กรุงเทพฯ", reviewCount: 7, rating: 3.8 },
  { id: 3, name: "สตาร์ทอัพ XYZ", province: "เชียงใหม่", reviewCount: 2, rating: 4.6 },
];