import {
  PDFDocument,
  rgb,
  rotateRadians,
  translate,
  pushGraphicsState,
  popGraphicsState,
} from 'pdf-lib'

/* ------------------------------------------
   TYPES
------------------------------------------ */

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

/* ------------------------------------------
   EXAM TYPE LABEL
------------------------------------------ */

const getExamTypeLabel = (examType: string) => {
  switch (examType) {
    case 'unit1':
      return 'प्रथम घटक चाचणी परीक्षा'
    case 'term1':
      return 'प्रथम सत्र परीक्षा'
    case 'unit2':
      return 'द्वितीय घटक चाचणी परीक्षा'
    case 'prelim1':
      return 'पूर्व/सराव परीक्षा-१'
    case 'prelim2':
      return 'पूर्व/सराव परीक्षा-२'
    case 'prelim3':
      return 'पूर्व/सराव परीक्षा-३'
    case 'term2':
      return 'द्वितीय सत्र परीक्षा'
    case 'internal':
      return 'अंतर्गत मूल्यमापन परीक्षा'
    case 'chapter':
      return 'प्रकरणानुसार परीक्षा'
    case 'final':
      return 'द्वितीय सत्र परीक्षा'
    default:
      return examType.charAt(0).toUpperCase() + examType.slice(1)
  }
}

const containsDevanagari = (text: string): boolean =>
  /[\u0900-\u097F]/.test(text)

/* ------------------------------------------
   HEADER (MARATHI) AS IMAGE
------------------------------------------ */

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
    canvas.height = 120

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

    const imageBytes = await fetch(canvas.toDataURL('image/png')).then((r) =>
      r.arrayBuffer(),
    )

    // IMPORTANT: embed image using pdf document
    const pdfDoc = page.doc || page._doc
    const image = await pdfDoc.embedPng(imageBytes)

    const scale = Math.min((pageWidth * 0.9) / canvas.width, 0.6)
    const dims = image.scale(scale)

    page.drawImage(image, {
      x: (pageWidth - dims.width) / 2,
      y: pageHeight - 50,
      width: dims.width,
      height: dims.height,
    })
  } catch (e) {
    console.warn('Marathi header failed:', e)
  }
}

/* ------------------------------------------
   WATERMARK (MARATHI) AS IMAGE
------------------------------------------ */

async function addSingleMarathiWatermark(
  page: any,
  text: string,
  pageWidth: number,
  pageHeight: number,
) {
  try {
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

    const imgBytes = await fetch(canvas.toDataURL('image/png')).then((r) =>
      r.arrayBuffer(),
    )

    const pdfDoc = page.doc || page._doc
    const img = await pdfDoc.embedPng(imgBytes)
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
  } catch (e) {
    console.warn('Marathi watermark failed:', e)
  }
}

/* ------------------------------------------
   WATERMARK (ENGLISH) TEXT
------------------------------------------ */

async function addSingleEnglishWatermark(
  page: any,
  text: string,
  pageWidth: number,
  pageHeight: number,
  pdfDoc: any,
) {
  const font = await pdfDoc.embedFont('Helvetica-Bold')
  let fontSize = Math.min((pageWidth / text.length) * 2, 180)

  while (
    font.widthOfTextAtSize(text, fontSize) > pageWidth * 0.8 &&
    fontSize > 30
  ) {
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

/* ------------------------------------------
   MAIN FUNCTION: APPLY + DOWNLOAD PDF
------------------------------------------ */

export const downloadActualPDF = async (paper: Paper, userInfo: UserInfo) => {
  try {
    // 1) Fetch original PDF
    const existingPdfBytes = await fetch(paper.file_url).then((res) =>
      res.arrayBuffer(),
    )

    // 2) Load PDF
    const pdfDoc = await PDFDocument.load(existingPdfBytes)

    // 3) Pages
    const pages = pdfDoc.getPages()

    // Title/Header text
    const examTypeLabel = getExamTypeLabel(paper.exam_type)
    const headerTitle = `${paper.standard} | ${paper.subject} | ${examTypeLabel} | ${paper.paper_type.toUpperCase()}`

    // Watermark text
    const watermarkText = `${userInfo.collegeName}`

    // 4) Apply to every page
    for (const page of pages) {
      const { width, height } = page.getSize()

      // ✅ Header / Title
      if (containsDevanagari(headerTitle)) {
        await addMarathiTextAsImage(page, headerTitle, width, height)
      } else {
        page.drawText(headerTitle, {
          x: 40,
          y: height - 30,
          size: 12,
          color: rgb(0, 0, 0),
        })
      }

      // ✅ Watermark
      if (containsDevanagari(watermarkText)) {
        await addSingleMarathiWatermark(page, watermarkText, width, height)
      } else {
        await addSingleEnglishWatermark(
          page,
          watermarkText,
          width,
          height,
          pdfDoc,
        )
      }
    }

    // 5) Save edited PDF
    const modifiedPdfBytes = await pdfDoc.save()

    // 6) Download edited PDF
    const blob = new Blob([modifiedPdfBytes], { type: 'application/pdf' })
    const url = URL.createObjectURL(blob)

    const examTypeFile = examTypeLabel.replace(/\s+/g, '_')

    const downloadName =
      `${userInfo.collegeName.replace(/\s+/g, '_')}_` +
      `${paper.standard}_${paper.subject}_${examTypeFile}_${paper.paper_type}.pdf`

    const link = document.createElement('a')
    link.href = url
    link.download = downloadName

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Error downloading PDF with watermark/title:', error)
    throw error
  }
}

export const generatePDF = async (paper: Paper, userInfo: UserInfo) =>
  downloadActualPDF(paper, userInfo)
