import "./globals.css";

export const metadata = {
  title: "Superpower — Your new health membership",
  description:
    "Members start with 100+ lab tests. $199 per year. Portfolio remake.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
