import { PDFDocument, rgb, rotateRadians, translate, pushGraphicsState, popGraphicsState } from 'pdf-lib'

export const downloadActualPDF = async (paper: Paper, userInfo: UserInfo) => {
  try {
    // 1) Fetch original PDF bytes
    const existingPdfBytes = await fetch(paper.file_url).then((res) => res.arrayBuffer())

    // 2) Load PDF in pdf-lib
    const pdfDoc = await PDFDocument.load(existingPdfBytes)

    // 3) Get pages
    const pages = pdfDoc.getPages()

    // Watermark Text
    const watermarkText = `${userInfo.collegeName}`

    // Title Text (Top Header)
    const examType = getExamTypeLabel(paper.exam_type)
    const titleText = `${paper.standard} | ${paper.subject} | ${examType} | ${paper.paper_type.toUpperCase()}`

    // 4) Apply watermark + title on every page
    for (const page of pages) {
      const { width, height } = page.getSize()

      // ✅ Title/Header
      if (containsDevanagari(titleText)) {
        await addMarathiTextAsImage(page, titleText, width, height)
      } else {
        page.drawText(titleText, {
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
        await addSingleEnglishWatermark(page, watermarkText, width, height, pdfDoc)
      }
    }

    // 5) Save modified PDF
    const modifiedPdfBytes = await pdfDoc.save()

    // 6) Download modified PDF
    const blob = new Blob([modifiedPdfBytes], { type: 'application/pdf' })
    const url = URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.href = url

    const examTypeFile = getExamTypeLabel(paper.exam_type).replace(/\s+/g, '_')
    link.download =
      `${userInfo.collegeName.replace(/\s+/g, '_')}_` +
      `${paper.standard}_${paper.subject}_${examTypeFile}_${paper.paper_type}.pdf`

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
