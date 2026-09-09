import type { Metadata } from "next";
import "./globals.css";
import PublicLayout from "@/components/PublicLayout";

export const metadata: Metadata = {
  title: "Sneakerz | Limpieza y Restauración de Sneakers en México",
  description:
    "Sneakerz ofrece servicios premium de limpieza, restauración y personalización de sneakers y artículos de lujo en México. Agenda tu recolección hoy.",
  keywords:
    "sneakers, limpieza sneakers, restauración zapatillas, sneaker cleaning, México, Monterrey, lujo",
  openGraph: {
    title: "Sneakerz | Limpieza y Restauración de Sneakers",
    description:
      "Servicios premium de limpieza, restauración y personalización de tus sneakers y artículos de lujo.",
    url: "https://sneakerz.mx",
    siteName: "Sneakerz",
    locale: "es_MX",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <PublicLayout>{children}</PublicLayout>
      </body>
    </html>
  );
}
