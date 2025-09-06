import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "Houseiana - Monthly Rentals in Qatar",
  description: "Book comfort-first homes with transparent monthly pricing",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background">
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}