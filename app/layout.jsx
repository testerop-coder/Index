import "./globals.css";

export const metadata = {
  title: "Anilot Hindi",
  description: "Discover Your Favourite Anime",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
