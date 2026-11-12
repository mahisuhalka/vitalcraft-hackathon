// Generates public/downloads/vitalcraft-pitch-deck-outline.pdf with no dependencies.
// Run: npm run generate:outline
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const out = resolve(root, "public/downloads/vitalcraft-pitch-deck-outline.pdf");

const esc = (s) => s.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");

const slides = [
  ["1. Team and track", "Team name, members and roles, and your track (Hardware or Software)."],
  ["2. Problem and users", "The problem in one sentence. Who experiences it, and how today's options fall short."],
  ["3. Proposed solution", "What you will build and how it addresses the problem for those users."],
  ["4. Architecture", "A simple block diagram of components, data flow and interfaces."],
  ["5. Components / stack", "Hardware parts and sensors, or software frameworks, services and data."],
  ["6. Impact", "Who benefits and how you would know it works. Avoid unsupported claims."],
  ["7. 24-hour MVP and demo plan", "What will work by the end of the finale, and exactly what you will show."],
];

const ops = [];
// Pixel header band
ops.push("0.055 0.051 0.047 rg 0 742 612 50 re f");
const blocks = ["0.31 0.60 0.18", "0.42 0.29 0.17", "0.18 0.88 0.48", "0.36 0.91 0.88", "0.96 0.77 0.26"];
for (let i = 0; i < 51; i++) ops.push(`${blocks[i % blocks.length]} rg ${i * 12} 730 12 12 re f`);
ops.push("BT 0.95 0.92 0.85 rg /F2 22 Tf 48 758 Td (VitalCraft) Tj ET");
ops.push("BT 0.95 0.92 0.85 rg /F1 10 Tf 420 762 Td (IEEE EMBS - BMSIT&M) Tj ET");
ops.push("BT 0.1 0.1 0.1 rg /F2 18 Tf 48 690 Td (Suggested pitch-deck outline) Tj ET");
ops.push(`BT 0.3 0.3 0.3 rg /F1 10.5 Tf 48 670 Td (${esc("Seven slides that help reviewers understand your idea quickly. PDF is recommended.")}) Tj ET`);

let y = 630;
for (const [title, body] of slides) {
  ops.push(`0.07 0.50 0.25 rg 48 ${y - 4} 8 8 re f`);
  ops.push(`BT 0.1 0.1 0.1 rg /F2 13 Tf 66 ${y - 3} Td (${esc(title)}) Tj ET`);
  ops.push(`BT 0.25 0.25 0.25 rg /F1 11 Tf 66 ${y - 21} Td (${esc(body)}) Tj ET`);
  y -= 58;
}
ops.push("0.85 0.85 0.85 RG 1 w 48 190 m 564 190 l S");
const notes = [
  "Proposed format: PDF or PPTX, up to 10 MB. Final requirements will be announced by the organizers.",
  "Keep it short: aim for one idea per slide and readable text.",
  "VitalCraft is a 24-hour Hardware & Software Hackathon - 28-29 November 2026, BMSIT&M.",
];
notes.forEach((n, i) => ops.push(`BT 0.35 0.35 0.35 rg /F1 9.5 Tf 48 ${170 - i * 16} Td (${esc(n)}) Tj ET`));

const content = ops.join("\n");
const objects = [
  "<< /Type /Catalog /Pages 2 0 R >>",
  "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
  "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents 6 0 R >>",
  "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>",
  "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>",
  `<< /Length ${Buffer.byteLength(content, "latin1")} >>\nstream\n${content}\nendstream`,
  "<< /Title (VitalCraft - Suggested pitch-deck outline) /Author (IEEE EMBS - BMSIT&M) >>",
];

let pdf = "%PDF-1.4\n";
const offsets = [];
objects.forEach((o, i) => {
  offsets.push(Buffer.byteLength(pdf, "latin1"));
  pdf += `${i + 1} 0 obj\n${o}\nendobj\n`;
});
const xref = Buffer.byteLength(pdf, "latin1");
pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
pdf += offsets.map((o) => `${String(o).padStart(10, "0")} 00000 n \n`).join("");
pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R /Info 7 0 R >>\nstartxref\n${xref}\n%%EOF\n`;

mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, pdf, "latin1");
console.log(`Wrote ${out} (${Buffer.byteLength(pdf, "latin1")} bytes)`);
