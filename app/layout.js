import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Header from "@/components/header";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { Toaster } from "sonner";

const inter=Inter({ subsets: ['latin'] })

export const metadata = {
  title: "Tensai - AI Career Coach",
  description: "Tensai provides personalized career guidance, job recommendations, and skill-building strategies using AI-driven insights to help you achieve your professional goals efficiently",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider appearance={{
      baseTheme:dark,
    }}>

    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
          >
          {/* header */}
          <Header />
            <main className="min-h-screen">{children}</main>
            <Toaster richColors/>
          {/* footer */}
          <footer className="bg-muted/50 py-12">
            <div className="container mx-auto px-4 text-center text-gray-200">
              <p>🚀 Built with Next.js • Fueled by Gemini AI • Crafted for Curious Minds</p>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
          </ClerkProvider>
  );
}
