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
              <script src='https://www.noupe.com/embed/019bcd2db7a97374a2a05c1d9569d0fa2144.js'></script>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}