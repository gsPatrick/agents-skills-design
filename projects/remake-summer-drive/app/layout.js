import "./globals.css";

export const metadata = {
  title: "The Summer Drive — Drive Capital",
  description:
    "A no-work, work-event for teams in the Drive Capital portfolio. Dinner, drinks, DJ, and a dunk tank. Reserve your seat.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
