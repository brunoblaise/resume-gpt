import { CV } from '@/components/modules/resume'
import { getUser } from '@/lib/db'
import { renderResumeTemplate } from '@/lib/templates'
import { NextResponse } from 'next/server'
import puppeteer from 'puppeteer';
 
export async function GET() {
  const user = await getUser()
  const resumeData = user?.resumeData as CV
  const resumeHtmlData = renderResumeTemplate(resumeData)

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(resumeHtmlData);
  const pdfBuffer = await page.pdf();
  await browser.close();
  return new Response(pdfBuffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=resume.pdf',
    },
  });
}