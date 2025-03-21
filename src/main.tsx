import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

import { ClerkProvider } from "@clerk/clerk-react";

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ClerkProvider
      publishableKey={clerkPubKey}
      appearance={{
        variables: {
          colorPrimary: "#3b82f6",
          colorBackground: "#ffffff", // 纯白背景
          colorInputBackground: "#f8fafc", // 浅灰色输入框背景
          colorTextOnPrimaryBackground: "#ffffff", // 主按钮上的文字保持白色
          colorText: "#1e293b", // 主要文字改为深蓝灰色
          colorTextSecondary: "#64748b", // 次要文字改为中等蓝灰色
          borderRadius: "0.75rem",
        },
        elements: {
          card: "bg-white shadow-lg w-[90%] max-w-[380px] mx-auto p-5 rounded-xl border border-gray-100",
          formButtonPrimary:
            "bg-gradient-to-r from-blue-500 to-indigo-500 text-sm h-10 hover:from-blue-600 hover:to-indigo-600 transition-colors",
          formFieldInput: "bg-gray-50 border-gray-200 text-sm text-gray-900",
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
      <App />
    </ClerkProvider>
  </React.StrictMode>
);
