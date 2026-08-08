import "./globals.css";

export const metadata = {
  title: "Steep — AI analytics for faster insights and zero chaos",
  description:
    "Steep is an AI analytics platform built on governed metrics that powers analysis, reporting and company-wide engagement.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
