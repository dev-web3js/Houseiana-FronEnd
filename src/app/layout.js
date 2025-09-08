import "./globals.css";
import Providers from "@/components/Providers";

export const metadata = {
  title: "Houseiana - Global Vacation Rentals",
  description: "Book comfort-first homes with transparent pricing for daily, weekly, and monthly stays",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}