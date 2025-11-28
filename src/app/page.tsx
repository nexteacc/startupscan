'use client';

import { useCallback, useEffect, useRef, useState } from "react";
import {
  SignIn,
  SignedIn,
  SignedOut,
  useClerk,
  useUser,
} from "@clerk/nextjs";
import { AuroraBackground } from "@/components/AuroraBackground";
import ResultsView from "@/components/ResultsView";

interface Idea {
  source: string;
  strategy: string;
  marketing: string;
  market_potential: string;
  target_audience: string;
}

const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

export default function HomePage() {
  const { signOut } = useClerk();
  const { user } = useUser();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [lastImageUrl, setLastImageUrl] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [language, setLanguage] = useState("en");

  const LANGUAGES = [
    { code: "en", label: "English", flag: "🇺🇸", short: "EN" },
    { code: "zh", label: "中文", flag: "🇨🇳", short: "ZH" },
    { code: "fr", label: "Français", flag: "🇫🇷", short: "FR" },
    { code: "ja", label: "日本語", flag: "🇯🇵", short: "JA" },
  ];

  const currentLang = LANGUAGES.find(l => l.code === language) || LANGUAGES[0];

  // 检测是否为移动设备
  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
      const mobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase());
      setIsMobile(mobile);
    };
    checkMobile();
  }, []);

  const analyzeIdeas = useCallback(
    async (imageUrl: string) => {
      const response = await fetch("/api/analyze-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user?.id ?? "defaultUserId",
          image_url: imageUrl,
          language: language,
        }),
      });

      if (!response.ok) {
        throw new Error("Analysis failed");
      }

      if (!response.body) {
        throw new Error("No response body");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        // Parse complete JSON objects (one per line)
        const lines = buffer.split("\n");
        buffer = lines.pop() || ""; // Keep incomplete line in buffer

        for (const line of lines) {
          if (line.trim()) {
            try {
              const parsed = JSON.parse(line);
              if (parsed.ideas && Array.isArray(parsed.ideas)) {
                setIdeas(
                  parsed.ideas.map((idea: Idea) => ({
                    source: idea.source?.trim() || "",
                    strategy: idea.strategy?.trim() || "",
                    marketing: idea.marketing?.trim() || "",
                    market_potential: idea.market_potential?.trim() || "",
                    target_audience: idea.target_audience?.trim() || "",
                  }))
                );
              }
            } catch (e) {
              console.error('[Stream Parse Error]', e);
            }
          }
        }
      }
    },
    [user?.id, language]
  );

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      try {
        setIsLoading(true);
        setErrorMessage("");
        setIdeas([]);

        if (!user?.id) {
          throw new Error("User ID is missing");
        }

        if (!cloudName || !uploadPreset) {
          throw new Error("Cloudinary is not configured");
        }

        // Upload to Cloudinary
        const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", uploadPreset);

        const response = await fetch(cloudinaryUrl, {
          method: "POST",
          body: formData,
        });

        const responseJson = await response.json();
        if (!response.ok) {
          throw new Error(responseJson.message || "Image upload failed");
        }

        const imageUrl = responseJson.secure_url.replace(
          "/upload/",
          "/upload/w_800,q_auto/"
        );
        setLastImageUrl(imageUrl);
        setShowResults(true);

        await analyzeIdeas(imageUrl);
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : "Unknown error");
        setShowResults(true);
      } finally {
        setIsLoading(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    },
    [analyzeIdeas, user?.id]
  );

  const handleRetry = useCallback(async () => {
    if (!lastImageUrl) return;
    try {
      setIsLoading(true);
      setErrorMessage("");
      setIdeas([]);
      await analyzeIdeas(lastImageUrl);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  }, [analyzeIdeas, lastImageUrl]);

  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <SignedIn>
        {showResults ? (
          <ResultsView
            ideas={ideas}
            errorMessage={errorMessage}
            onRetry={handleRetry}
            onBack={() => {
              setIdeas([]);
              setShowResults(false);
            }}
            onRetake={() => {
              setIdeas([]);
              setErrorMessage("");
              setShowResults(false);
              setTimeout(() => fileInputRef.current?.click(), 100);
            }}
          />
        ) : (
          <div className="relative w-full h-full">
            <AuroraBackground>
              <div className="relative w-full h-full flex flex-col items-center justify-center">
                {errorMessage && (
                  <div className="text-red-500 mb-4">{errorMessage}</div>
                )}
                {isLoading && (
                  <div className="mb-4">Collecting inspiration, please wait...</div>
                )}
                {!isLoading && (
                  <>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      capture={isMobile ? "environment" : undefined}
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <div className="flex items-center gap-3 relative z-20">
                      {/* Native Select with Custom Overlay */}
                      <div className="relative shrink-0 w-16 h-12">
                        {/* The Visual Layer (What user sees) */}
                        <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center gap-0.5 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 text-white">
                          <span className="text-lg leading-none">{currentLang.flag}</span>
                          <span className="text-[10px] font-bold leading-none tracking-wider">{currentLang.short}</span>
                        </div>
                        
                        {/* The Functional Layer (Native Select, invisible but clickable) */}
                        <select
                          value={language}
                          onChange={(e) => setLanguage(e.target.value)}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer appearance-none"
                        >
                          {LANGUAGES.map((lang) => (
                            <option key={lang.code} value={lang.code} className="text-gray-800">
                              {lang.flag} {lang.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <button
                        onClick={handleCameraClick}
                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 text-white bg-blue-500 rounded-2xl hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/30 min-w-[140px]"
                      >
                      {isMobile ? (
                        <>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-6 h-6"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z"
                            />
                          </svg>
                          PLAY
                        </>
                      ) : (
                        <>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-6 h-6"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                            />
                          </svg>
                          上传图片
                        </>
                      )}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </AuroraBackground>
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
              <button onClick={() => signOut()} className="logout-button">
                <div className="svg-wrapper-1">
                  <div className="svg-wrapper">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
                      />
                    </svg>
                  </div>
                </div>
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        )}
      </SignedIn>

      <SignedOut>
        <AuroraBackground>
          <div className="relative w-full h-full flex flex-col items-center justify-center">
            <SignIn />
          </div>
        </AuroraBackground>
      </SignedOut>
    </>
  );
}
