import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from 'next-themes';
import { AuthProvider } from '@/src/context/AuthContext';
import "@/src/styles/globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "SevaHealth - ASHA Workers Management",
  description: "Platform for ASHA workers workload management in low-bandwidth areas",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <main className="flex-1">
              {children}
            </main>

            <script src="https://cdn.botpress.cloud/webchat/v3.5/inject.js"></script>
            <script src="https://files.bpcontent.cloud/2026/01/17/19/20260117192945-LU810R2V.js" defer></script>

          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}