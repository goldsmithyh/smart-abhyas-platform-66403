import { PDFDocument, rgb, degrees, rotateRadians, translate, pushGraphicsState, popGraphicsState } from 'pdf-lib'

interface Paper {
  id: string
  title: string
  paper_type: 'question' | 'answer'
  standard: '10th' | '11th' | '12th'
  exam_type: 'unit1' | 'term1' | 'unit2' | 'prelim1' | 'prelim2' | 'prelim3' | 'term2' | 'internal' | 'chapter' | 'final'
  subject: string
  file_url: string
  file_name: string
}

interface UserInfo {
  collegeName: string
  email: string
  phone: string
}

const getExamTypeLabel = (examType: string) => {
  switch (examType) {
    case 'unit1': return 'प्रथम घटक चाचणी परीक्षा'
    case 'term1': return 'प्रथम सत्र परीक्षा'
    case 'unit2': return 'द्वितीय घटक चाचणी परीक्षा'
    case 'prelim1': return 'पूर्व/सराव परीक्षा-१'
    case 'prelim2': return 'पूर्व/सराव परीक्षा-२'
    case 'prelim3': return 'पूर्व/सराव परीक्षा-३'
    case 'term2': return 'द्वितीय सत्र परीक्षा'
    case 'internal': return 'अंतर्गत मूल्यमापन परीक्षा'
    case 'chapter': return 'प्रकरणानुसार परीक्षा'
    case 'final': return 'द्वितीय सत्र परीक्षा'
    default: return examType.charAt(0).toUpperCase() + examType.slice(1)
  }
}

const containsDevanagari = (text: string): boolean => /[\u0900-\u097F]/.test(text)

async function addMarathiTextAsImage(page: any, text: string, pageWidth: number, pageHeight: number) {
  try {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const baseWidth = Math.max(800, text.length * 25)
    canvas.width = Math.min(baseWidth, 1400)
    canvas.height = 100

    let fontSize = 42
    ctx.font = `bold ${fontSize}px "Noto Sans Devanagari", Arial, sans-serif`
    ctx.fillStyle = 'black'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    let textMetrics = ctx.measureText(text)
    while (textMetrics.width > canvas.width * 0.9 && fontSize > 16) {
      fontSize -= 2
      ctx.font = `bold ${fontSize}px "Noto Sans Devanagari", Arial, sans-serif`
      textMetrics = ctx.measureText(text)
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillText(text, canvas.width / 2, canvas.height / 2)

    const imageData = canvas.toDataURL('image/png')
    const imageBytes = await fetch(imageData).then(res => res.arrayBuffer())
    const image = await page.doc.embedPng(imageBytes)

    const maxWidth = pageWidth * 0.8
    const scale = Math.min(maxWidth / canvas.width, 0.5)
    const imageDims = image.scale(scale)

    page.drawImage(image, {
      x: (pageWidth - imageDims.width) / 2,
      y: pageHeight - 45,
      width: imageDims.width,
      height: imageDims.height,
    })
  } catch (error) {
    console.warn('Could not add Marathi text as image:', error)
  }
}

// Marathi watermark — Bigger and centered rotation
async function addSingleMarathiWatermark(page: any, text: string, pageWidth: number, pageHeight: number) {
  try {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const maxDimension = Math.max(pageWidth, pageHeight)
    canvas.width = Math.min(maxDimension * 1.5, 2500)
    canvas.height = Math.min(maxDimension * 0.5, 900)

    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = 'high'

    let fontSize = Math.min(canvas.width / text.length * 1.5, 220)
    ctx.font = `bold ${fontSize}px "Noto Sans Devanagari", Arial, sans-serif`
    ctx.fillStyle = 'rgba(120, 120, 120, 0.35)'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    let textMetrics = ctx.measureText(text)
    while (textMetrics.width > canvas.width * 0.9 && fontSize > 40) {
      fontSize -= 2
      ctx.font = `bold ${fontSize}px "Noto Sans Devanagari", Arial, sans-serif`
      textMetrics = ctx.measureText(text)
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillText(text, canvas.width / 2, canvas.height / 2)

    const imageData = canvas.toDataURL('image/png', 1.0)
    const imageBytes = await fetch(imageData).then(res => res.arrayBuffer())
    const image = await page.doc.embedPng(imageBytes)

    const maxScale = Math.min(pageWidth / canvas.width, pageHeight / canvas.height) * 1.2
    const imageDims = image.scale(maxScale)

    // Centered rotation
    page.pushOperators(pushGraphicsState())
    page.pushOperators(translate(pageWidth / 2, pageHeight / 2))
    page.pushOperators(rotateRadians((45 * Math.PI) / 180))
    page.drawImage(image, {
      x: -imageDims.width / 2,
      y: -imageDims.height / 2,
      width: imageDims.width,
      height: imageDims.height,
    })
    page.pushOperators(popGraphicsState())
  } catch (error) {
    console.warn('Could not add single Marathi watermark:', error)
  }
}

// English watermark — Bigger and centered rotation
async function addSingleEnglishWatermark(page: any, text: string, pageWidth: number, pageHeight: number, pdfDoc: any) {
  try {
    const watermarkFont = await pdfDoc.embedFont('Helvetica-Bold')

    let fontSize = Math.min(pageWidth / text.length * 2.2, pageHeight / 8, 200)
    let textWidth = watermarkFont.widthOfTextAtSize(text, fontSize)

    const maxWidth = pageWidth * 0.8
    while (textWidth > maxWidth && fontSize > 30) {
      fontSize -= 2
      textWidth = watermarkFont.widthOfTextAtSize(text, fontSize)
    }

    // Centered rotation
    page.pushOperators(pushGraphicsState())
    page.pushOperators(translate(pageWidth / 2, pageHeight / 2))
    page.pushOperators(rotateRadians((45 * Math.PI) / 180))
    page.drawText(text, {
      x: -textWidth / 2,
      y: -fontSize / 2,
      size: fontSize,
      font: watermarkFont,
      color: rgb(0.45, 0.45, 0.45),
      opacity: 0.35,
    })
    page.pushOperators(popGraphicsState())
  } catch (error) {
    console.warn('Could not add single English watermark:', error)
  }
}

export const downloadActualPDF = async (paper: Paper, userInfo: UserInfo) => {
  try {
    const isAndroidWebView =
      typeof navigator !== 'undefined' &&
      /Android/i.test(navigator.userAgent) &&
      navigator.userAgent.includes('wv');

    // Android WebView often fails to download Blob URLs; use backend attachment download instead.
    if (isAndroidWebView) {
      const examTypeForFile = getExamTypeLabel(paper.exam_type).replace(/\s+/g, '_');
      const filename = `${userInfo.collegeName.replace(/\s+/g, '_')}_${paper.standard}_${paper.subject}_${examTypeForFile}_${paper.paper_type}.pdf`;

      const baseUrl = import.meta.env.VITE_SUPABASE_URL;
      const downloadUrl = `${baseUrl}/functions/v1/download-paper?fileUrl=${encodeURIComponent(
        paper.file_url,
      )}&filename=${encodeURIComponent(filename)}`;

      // Trigger a real navigation to a downloadable response (Content-Disposition: attachment)
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.rel = 'noopener';
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    }

    const response = await fetch(paper.file_url);
    if (!response.ok) throw new Error(`Failed to fetch PDF file: ${response.status} ${response.statusText}`);
    const contentType = response.headers.get('Content-Type');
    if (contentType && !contentType.includes('application/pdf')) throw new Error(`Invalid file type: Expected PDF but got ${contentType}`);
    const existingPdfBytes = await response.arrayBuffer();
    if (existingPdfBytes.byteLength === 0) throw new Error('Empty file received');
    const uint8Array = new Uint8Array(existingPdfBytes);
    if (String.fromCharCode(...uint8Array.slice(0, 4)) !== '%PDF') throw new Error('Invalid PDF file');

    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];
    const { width, height } = firstPage.getSize();

    const collegeName = userInfo.collegeName.toUpperCase();
    const hasMarathiText = containsDevanagari(collegeName);

    let font;
    if (hasMarathiText) {
      try {
        const fontResponse = await fetch('https://fonts.gstatic.com/s/notosansdevanagari/v25/TuGoUUFzXI5FBtUq5a8bjKYTZjtRU6Sgv3NaV_SNmI0b8QQCQmHn6B2OHjbL_08AlXQly_AzOy8.woff2');
        if (fontResponse.ok) {
          const fontBytes = await fontResponse.arrayBuffer();
          font = await pdfDoc.embedFont(fontBytes);
        } else throw new Error('Font not available');
      } catch {
        await addMarathiTextAsImage(firstPage, collegeName, width, height);
        font = null;
      }
    } else {
      font = await pdfDoc.embedFont('Helvetica-Bold');
    }

    if (font) {
      let fontSize = hasMarathiText ? 22 : 24;
      let collegeNameWidth = font.widthOfTextAtSize(collegeName, fontSize);
      const maxWidth = width * 0.9;
      while (collegeNameWidth > maxWidth && fontSize > 8) {
        fontSize -= 1;
        collegeNameWidth = font.widthOfTextAtSize(collegeName, fontSize);
      }
      firstPage.drawText(collegeName, {
        x: (width - collegeNameWidth) / 2,
        y: height - 30,
        size: fontSize,
        font,
        color: rgb(0, 0, 0),
      });
    }

    await Promise.all(
      pages.map(async (page) => {
        const { width: pw, height: ph } = page.getSize();
        if (hasMarathiText) {
          await addSingleMarathiWatermark(page, collegeName, pw, ph);
        } else {
          await addSingleEnglishWatermark(page, collegeName, pw, ph, pdfDoc);
        }
      }),
    );

    const modifiedPdfBytes = await pdfDoc.save();
    const blob = new Blob([modifiedPdfBytes as BlobPart], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const examTypeForFile = getExamTypeLabel(paper.exam_type).replace(/\s+/g, '_');
    link.download = `${userInfo.collegeName.replace(/\s+/g, '_')}_${paper.standard}_${paper.subject}_${examTypeForFile}_${paper.paper_type}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading PDF:', error);
    throw error;
  }
};

export const generatePDF = async (paper: Paper, userInfo: UserInfo) => {
  return downloadActualPDF(paper, userInfo)
}

export const addWatermarkToPdf = async (pdfBytes: ArrayBuffer, watermarkText: string): Promise<Uint8Array> => {
  console.warn('addWatermarkToPdf is deprecated, use downloadActualPDF instead')
  const pdfDoc = await PDFDocument.load(pdfBytes)
  const modifiedPdfBytes = await pdfDoc.save()
  return modifiedPdfBytes
}
