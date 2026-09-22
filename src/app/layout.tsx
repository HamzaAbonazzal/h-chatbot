import type { Metadata } from "next";
import Script from "next/script";
import { ToastProvider } from "@/components/Toast/ToastContext";
import "./globals.scss";

export const metadata: Metadata = {
  title: "Chatbot",
  description: "Simple AI chatbot",
};

const themeInit = `
(function() {
  try {
    var t = localStorage.getItem('chatbot:theme') || 'dark';
    document.documentElement.setAttribute('data-theme', t);
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <meta
          name="format-detection"
          content="telephone=no, date=no, email=no, address=no"
        />
        <Script id="theme-init" strategy="beforeInteractive">
          {themeInit}
        </Script>
      </head>
      <body suppressHydrationWarning>
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}