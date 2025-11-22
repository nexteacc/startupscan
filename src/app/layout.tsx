import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const clerkPubKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

if (!clerkPubKey) {
  throw new Error("Missing NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY");
}

export const metadata: Metadata = {
  title: "StartupScan",
  description: "Capture a photo and turn it into startup ideas instantly.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClerkProvider
          publishableKey={clerkPubKey}
          appearance={{
            variables: {
              colorPrimary: "#3b82f6",
              colorBackground: "#ffffff",
              colorInputBackground: "#f8fafc",
              colorTextOnPrimaryBackground: "#ffffff",
              colorText: "#1e293b",
              colorTextSecondary: "#64748b",
              borderRadius: "0.75rem",
            },
            elements: {
              card: "bg-white shadow-lg w-[90%] max-w-[380px] mx-auto p-5 rounded-xl border border-gray-100",
              formButtonPrimary:
                "bg-gradient-to-r from-blue-500 to-indigo-500 text-sm h-10 hover:from-blue-600 hover:to-indigo-600 transition-colors",
              formFieldInput:
                "bg-gray-50 border-gray-200 text-sm text-gray-900",
              socialButtonsIconButton:
                "bg-gray-50 hover:bg-gray-100 scale-95 p-1.5 rounded-lg transition-all duration-200 border border-gray-200",
              socialButtonsProviderIcon: "w-5 h-5 opacity-90 hover:opacity-100",
              footer: "hidden",
              rootBox: "w-full px-4 py-2",
              headerTitle: "text-xl font-semibold text-gray-900 mb-6",
              formFieldLabel: "text-sm text-gray-600 mb-1",
              formFieldInput__input: "h-10",
              dividerRow: "my-3",
              dividerText: "text-sm text-gray-500",
              formFieldError: "text-red-500 text-xs mt-1",
            },
          }}
        >
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
