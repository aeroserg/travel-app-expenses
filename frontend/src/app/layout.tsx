import type { Metadata } from "next";
import "./globals.css";
import { ChakraProvider } from "@chakra-ui/react";
import { Providers } from "../store/providers";

export const metadata: Metadata = {
  title: "Финансы",
  description: "ФинТрекер для мониторинга финансов в поездках",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="ru">
      <body>
        <ChakraProvider>
          <Providers>{children}</Providers>
        </ChakraProvider>
      </body>
    </html>
  );
}
