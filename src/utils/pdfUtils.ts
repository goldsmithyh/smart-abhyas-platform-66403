import {
  PDFDocument,
  rgb,
  rotateRadians,
  translate,
  pushGraphicsState,
  popGraphicsState,
} from 'pdf-lib'

interface Paper {
  id: string
  title: string
  paper_type: 'question' | 'answer'
  standard: '10th' | '11th' | '12th'
  exam_type:
    | 'unit1'
    | 'term1'
    | 'unit2'
    | 'prelim1'
    | 'prelim2'
    | 'prelim3'
    | 'term2'
    | 'internal'
    | 'chapter'
    | 'final'
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
    default:
      return examType.charAt(0).toUpperCase() + examType.slice(1)
  }
}

const containsDevanagari = (text: string): boolean =>
  /[\u0900-\u097F]/.test(text)

/* -------------------------------------------------- */
/* WATERMARK HELPERS (UNCHANGED) */
/* -------------------------------------------------- */

async function addMarathiTextAsImage(
  page: any,
  text: string,
  pageWidth: number,
  pageHeight: number,
) {
  try {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = Math.min(Math.max(800, text.length * 25), 1400)
    canvas.height = 100

    let fontSize = 42
    ctx.font = `bold ${fontSize}px "Noto Sans Devanagari", Arial, sans-serif`
    ctx.fillStyle = 'black'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    while (ctx.measureText(text).width > canvas.width * 0.9 && fontSize > 16) {
      fontSize -= 2
      ctx.font = `bold ${fontSize}px "Noto Sans Devanagari", Arial, sans-serif`
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillText(text, canvas.width / 2, canvas.height / 2)

    const imageBytes = await fetch(canvas.toDataURL('image/png')).then(r =>
      r.arrayBuffer(),
    )
    const image = await page.doc.embedPng(imageBytes)

    const scale = Math.min((pageWidth * 0.8) / canvas.width, 0.5)
    const dims = image.scale(scale)

    page.drawImage(image, {
      x: (pageWidth - dims.width) / 2,
      y: pageHeight - 45,
      width: dims.width,
      height: dims.height,
    })
  } catch (e) {
    console.warn('Marathi header failed:', e)
  }
}

async function addSingleMarathiWatermark(
  page: any,
  text: string,
  pageWidth: number,
  pageHeight: number,
) {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  canvas.width = 2000
  canvas.height = 600

  let fontSize = 200
  ctx.font = `bold ${fontSize}px "Noto Sans Devanagari", Arial, sans-serif`
  ctx.fillStyle = 'rgba(120,120,120,0.35)'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  while (ctx.measureText(text).width > canvas.width * 0.9 && fontSize > 40) {
    fontSize -= 5
    ctx.font = `bold ${fontSize}px "Noto Sans Devanagari", Arial, sans-serif`
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.fillText(text, canvas.width / 2, canvas.height / 2)

  const imgBytes = await fetch(canvas.toDataURL('image/png')).then(r =>
    r.arrayBuffer(),
  )
  const img = await page.doc.embedPng(imgBytes)
  const dims = img.scale(1)

  page.pushOperators(pushGraphicsState())
  page.pushOperators(translate(pageWidth / 2, pageHeight / 2))
  page.pushOperators(rotateRadians(Math.PI / 4))
  page.drawImage(img, {
    x: -dims.width / 2,
    y: -dims.height / 2,
    width: dims.width,
    height: dims.height,
  })
  page.pushOperators(popGraphicsState())
}

async function addSingleEnglishWatermark(
  page: any,
  text: string,
  pageWidth: number,
  pageHeight: number,
  pdfDoc: any,
) {
  const font = await pdfDoc.embedFont('Helvetica-Bold')
  let fontSize = Math.min(pageWidth / text.length * 2, 180)

  while (font.widthOfTextAtSize(text, fontSize) > pageWidth * 0.8 && fontSize > 30) {
    fontSize -= 5
  }

  page.pushOperators(pushGraphicsState())
  page.pushOperators(translate(pageWidth / 2, pageHeight / 2))
  page.pushOperators(rotateRadians(Math.PI / 4))
  page.drawText(text, {
    x: -font.widthOfTextAtSize(text, fontSize) / 2,
    y: -fontSize / 2,
    size: fontSize,
    font,
    color: rgb(0.45, 0.45, 0.45),
    opacity: 0.35,
  })
  page.pushOperators(popGraphicsState())
}

/* -------------------------------------------------- */
/* ✅ FINAL FIXED DOWNLOAD FUNCTION */
/* -------------------------------------------------- */

export const downloadActualPDF = async (paper: Paper, userInfo: UserInfo) => {
  try {
    const isAndroidWebView =
      typeof navigator !== 'undefined' &&
      /Android/i.test(navigator.userAgent) &&
      navigator.userAgent.includes('wv')

    /* ✅ ANDROID WEBVIEW FIX (THIS WAS BROKEN BEFORE) */
    if (isAndroidWebView) {
      const examType = getExamTypeLabel(paper.exam_type).replace(/\s+/g, '_')
      const filename =
        `${userInfo.collegeName.replace(/\s+/g, '_')}_` +
        `${paper.standard}_${paper.subject}_${examType}_${paper.paper_type}.pdf`

      // 🔥 FIX: NEVER ALLOW baseUrl TO BE undefined
      const baseUrl =
        import.meta.env.VITE_SUPABASE_URL || window.location.origin

      const downloadUrl =
        `${baseUrl}/functions/v1/download-paper` +
        `?fileUrl=${encodeURIComponent(paper.file_url)}` +
        `&filename=${encodeURIComponent(filename)}`

      window.location.href = downloadUrl
      return
    }

    /* ---------------- BROWSER FLOW (UNCHANGED) ---------------- */

    const response = await fetch(paper.file_url)
    if (!response.ok) throw new Error('PDF fetch failed')

    const pdfBytes = await response.arrayBuffer()
    const pdfDoc = await PDFDocument.load(pdfBytes)
    const pages = pdfDoc.getPages()
    const firstPage = pages[0]
    const { width, height } = firstPage.getSize()

    const collegeName = userInfo.collegeName.toUpperCase()
    const hasMarathi = containsDevanagari(collegeName)

    if (hasMarathi) {
      await addMarathiTextAsImage(firstPage, collegeName, width, height)
    }

    await Promise.all(
      pages.map(async page => {
        const { width: pw, height: ph } = page.getSize()
        hasMarathi
          ? await addSingleMarathiWatermark(page, collegeName, pw, ph)
          : await addSingleEnglishWatermark(page, collegeName, pw, ph, pdfDoc)
      }),
    )

    const finalBytes = await pdfDoc.save()
    const blob = new Blob([finalBytes], { type: 'application/pdf' })
    const url = URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = url
    a.download = paper.file_name
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  } catch (err) {
    console.error('PDF download error:', err)
    throw err
  }
}

export const generatePDF = async (paper: Paper, userInfo: UserInfo) =>
  downloadActualPDF(paper, userInfo)
