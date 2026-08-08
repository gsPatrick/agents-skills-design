import "./globals.css";

export const metadata = {
  title: "Seed • Whole Body Health Starts in the Gut",
  description:
    "A life-changing health routine, built for your microbiome.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
