import "./globals.css";

export const metadata = {
  title: "General Intelligence Company",
  description:
    "The General Intelligence Company is an applied AI lab working towards automating businesses full-stack with AI.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
