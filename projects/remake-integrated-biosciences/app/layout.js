import "./globals.css";

export const metadata = {
  title: "Integrated Biosciences — Engineering the future of aging medicine",
  description:
    "We unravel complex biology with optogenetics, chemistry, and AI for small molecule therapeutic discovery.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
