import {
  PDFDocument,
  rgb,
  rotateRadians,
  translate,
  pushGraphicsState,
  popGraphicsState,
} from "pdf-lib";

/* ------------------------------------------
   TYPES
------------------------------------------ */

interface Paper {
  id: string;
  title: string;
  paper_type: "question" | "answer";
  standard: "10th" | "11th" | "12th";
  exam_type:
    | "unit1"
    | "term1"
    | "unit2"
    | "prelim1"
    | "prelim2"
    | "prelim3"
    | "term2"
    | "internal"
    | "chapter"
    | "final";
  subject: string;
  file_url: string;
  file_name: string;
}

interface UserInfo {
  collegeName: string;
  email: string;
  phone: string;
}

/* ------------------------------------------
   EXAM TYPE LABEL
------------------------------------------ */

const getExamTypeLabel = (examType: string) => {
  switch (examType) {
    case "unit1":
      return "प्रथम घटक चाचणी परीक्षा";
    case "term1":
      return "प्रथम सत्र परीक्षा";
    case "unit2":
      return "द्वितीय घटक चाचणी परीक्षा";
    case "prelim1":
      return "पूर्व/सराव परीक्षा-१";
    case "prelim2":
      return "पूर्व/सराव परीक्षा-२";
    case "prelim3":
      return "पूर्व/सराव परीक्षा-३";
    case "term2":
      return "द्वितीय सत्र परीक्षा";
    case "internal":
      return "अंतर्गत मूल्यमापन परीक्षा";
    case "chapter":
      return "प्रकरणानुसार परीक्षा";
    case "final":
      return "द्वितीय सत्र परीक्षा";
    default:
      return examType.charAt(0).toUpperCase() + examType.slice(1);
  }
};

const containsDevanagari = (text: string): boolean =>
  /[\u0900-\u097F]/.test(text);

/* ------------------------------------------
   ENGLISH HEADER AUTO RESIZE
------------------------------------------ */
async function drawAutoSizedEnglishHeader(
  page: any,
  pdfDoc: any,
  text: string,
  pageWidth: number,
  pageHeight: number
) {
  const font = await pdfDoc.embedFont("Helvetica-Bold");

  let fontSize = 20;
  const maxWidth = pageWidth - 60;

  while (font.widthOfTextAtSize(text, fontSize) > maxWidth && fontSize > 8) {
    fontSize -= 1;
  }

  page.drawText(text, {
    x: (pageWidth - font.widthOfTextAtSize(text, fontSize)) / 2,
    y: pageHeight - 28,
    size: fontSize,
    font,
    color: rgb(0, 0, 0),
  });
}

/* ------------------------------------------
   MARATHI HEADER AS IMAGE
------------------------------------------ */
async function addMarathiTextAsImage(
  page: any,
  text: string,
  pageWidth: number,
  pageHeight: number
) {
  try {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 1800;
    canvas.height = 140;

    let fontSize = 60;
    ctx.font = `bold ${fontSize}px "Noto Sans Devanagari", Arial, sans-serif`;
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    while (ctx.measureText(text).width > canvas.width * 0.92 && fontSize > 18) {
      fontSize -= 2;
      ctx.font = `bold ${fontSize}px "Noto Sans Devanagari", Arial, sans-serif`;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);

    const imageBytes = await fetch(canvas.toDataURL("image/png")).then((r) =>
      r.arrayBuffer()
    );

    const pdfDoc = page.doc || page._doc;
    const image = await pdfDoc.embedPng(imageBytes);

    const scale = Math.min((pageWidth * 0.95) / canvas.width, 0.75);
    const dims = image.scale(scale);

    page.drawImage(image, {
      x: (pageWidth - dims.width) / 2,
      y: pageHeight - 48,
      width: dims.width,
      height: dims.height,
    });
  } catch (e) {
    console.warn("Marathi header failed:", e);
  }
}

/* ------------------------------------------
   WATERMARK (MARATHI)
------------------------------------------ */
async function addSingleMarathiWatermark(
  page: any,
  text: string,
  pageWidth: number,
  pageHeight: number
) {
  try {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 2000;
    canvas.height = 700;

    let fontSize = 220;
    ctx.font = `bold ${fontSize}px "Noto Sans Devanagari", Arial, sans-serif`;
    ctx.fillStyle = "rgba(120,120,120,0.25)";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    while (ctx.measureText(text).width > canvas.width * 0.9 && fontSize > 50) {
      fontSize -= 5;
      ctx.font = `bold ${fontSize}px "Noto Sans Devanagari", Arial, sans-serif`;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);

    const imgBytes = await fetch(canvas.toDataURL("image/png")).then((r) =>
      r.arrayBuffer()
    );

    const pdfDoc = page.doc || page._doc;
    const img = await pdfDoc.embedPng(imgBytes);

    const targetWidth = pageWidth * 0.75;
    const dims = img.scale(targetWidth / img.width);

    page.pushOperators(pushGraphicsState());
    page.pushOperators(translate(pageWidth / 2, pageHeight / 2));
    page.pushOperators(rotateRadians(Math.PI / 4));

    page.drawImage(img, {
      x: -dims.width / 2,
      y: -dims.height / 2,
      width: dims.width,
      height: dims.height,
    });

    page.pushOperators(popGraphicsState());
  } catch (e) {
    console.warn("Marathi watermark failed:", e);
  }
}

/* ------------------------------------------
   WATERMARK (ENGLISH)
------------------------------------------ */
async function addSingleEnglishWatermark(
  page: any,
  text: string,
  pageWidth: number,
  pageHeight: number,
  pdfDoc: any
) {
  const font = await pdfDoc.embedFont("Helvetica-Bold");

  let fontSize = 180;
  const maxWidth = pageWidth * 0.75;

  while (font.widthOfTextAtSize(text, fontSize) > maxWidth && fontSize > 30) {
    fontSize -= 5;
  }

  page.pushOperators(pushGraphicsState());
  page.pushOperators(translate(pageWidth / 2, pageHeight / 2));
  page.pushOperators(rotateRadians(Math.PI / 4));

  page.drawText(text, {
    x: -font.widthOfTextAtSize(text, fontSize) / 2,
    y: -fontSize / 2,
    size: fontSize,
    font,
    color: rgb(0.45, 0.45, 0.45),
    opacity: 0.25,
  });

  page.pushOperators(popGraphicsState());
}

/* ------------------------------------------
   MAIN FUNCTION
------------------------------------------ */

export const downloadActualPDF = async (paper: Paper, userInfo: UserInfo) => {
  try {
    const existingPdfBytes = await fetch(paper.file_url).then((res) =>
      res.arrayBuffer()
    );

    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const pages = pdfDoc.getPages();

    const headerTitle = `${userInfo.collegeName}`;
    const watermarkText = `${userInfo.collegeName}`;

    for (let i = 0; i < pages.length; i++) {
      const page = pages[i];
      const { width, height } = page.getSize();

      // ✅ Title ONLY on first page
      if (i === 0) {
        if (containsDevanagari(headerTitle)) {
          await addMarathiTextAsImage(page, headerTitle, width, height);
        } else {
          await drawAutoSizedEnglishHeader(page, pdfDoc, headerTitle, width, height);
        }
      }

      // ✅ Watermark on ALL pages
      if (containsDevanagari(watermarkText)) {
        await addSingleMarathiWatermark(page, watermarkText, width, height);
      } else {
        await addSingleEnglishWatermark(page, watermarkText, width, height, pdfDoc);
      }
    }

    const modifiedPdfBytes = await pdfDoc.save();

    const blob = new Blob([modifiedPdfBytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);

    const examTypeLabel = getExamTypeLabel(paper.exam_type);
    const examTypeFile = examTypeLabel.replace(/\s+/g, "_");

    const downloadName =
      `${userInfo.collegeName.replace(/\s+/g, "_")}_` +
      `${paper.standard}_${paper.subject}_${examTypeFile}_${paper.paper_type}.pdf`;

    const link = document.createElement("a");
    link.href = url;
    link.download = downloadName;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error downloading PDF with watermark/title:", error);
    throw error;
  }
};

export const generatePDF = async (paper: Paper, userInfo: UserInfo) =>
  downloadActualPDF(paper, userInfo);
