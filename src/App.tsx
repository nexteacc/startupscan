import { useState } from "react";
import { CameraButton } from "./components/CameraButton";
import { AuroraBackground } from "./components/AuroraBackground";
import { CameraView } from "./components/CameraView";
import ResultsView from "./components/ResultsView";
import { SignIn, SignedIn, SignedOut, useClerk } from "@clerk/clerk-react";
import { useCallback } from "react";

interface Idea {
  source: string;
  strategy: string;
  marketing: string;
  market_potential: string;
  target_audience: string;
}

function App() {
  const { signOut, user } = useClerk();
  const [cameraState, setCameraState] = useState<"idle" | "active" | "results">("idle");

  const [ideas, setIdeas] = useState<Idea[]>([]);

  const [errorMessage, setErrorMessage] = useState("");
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleExit = useCallback(() => {
    setCameraState("idle");
    if (mediaStream) {
      mediaStream.getTracks().forEach((track) => track.stop());
      setMediaStream(null);
    }
  }, [mediaStream]);



  const handleCapture = useCallback(
    async (image: string) => {
      // const controller = new AbortController();
      // const timeoutId = setTimeout(() => controller.abort(), 30000);

      try {
        setIsLoading(true);
        setErrorMessage(""); 

        if (!image || image.length < 100) {
          throw new Error("Invalid image data");
        }
        // const picgoApiKey = import.meta.env.VITE_PICGO_API_KEY;
        // if (!picgoApiKey) {
        //   throw new Error("API key not configured");
        // }

        if (!user?.id) { 
          throw new Error("User ID is missing");
        }
        

// 解析 Base64
const base64Data = image.split(",")[1];
if (!base64Data) {
  throw new Error("Invalid Base64 image data");
}

// Base64 转 Blob
const byteCharacters = atob(base64Data);
const byteNumbers = new Array(byteCharacters.length);
for (let i = 0; i < byteCharacters.length; i++) {
  byteNumbers[i] = byteCharacters.charCodeAt(i);
}
const byteArray = new Uint8Array(byteNumbers);
const blob = new Blob([byteArray], { type: "image/png" });

// 创建 FormData
const formData = new FormData();
formData.append("file", blob, "capture.png"); // 需要提供文件名

// 发送到 GoFile.io
const response = await fetch("https://store1.gofile.io/uploadFile", {
  method: "POST",
  body: formData,
});

const responseJson = await response.json();
console.log("GoFile.io Response:", responseJson);

if (responseJson.status !== "ok") {
  throw new Error("Image upload failed");
}

const imageUrl = responseJson.data.downloadPage; // 获取下载链接
        
        setIdeas([
          {
            source: "测试模式",
            strategy: `API响应: ${imageUrl}`,
            marketing: "测试营销信息",
            market_potential: "测试市场潜力",
            target_audience: "测试目标用户"
          }
        ]);
        setCameraState("results");

        // if (!response.ok) {
        //   const error = await response.json();
        //   throw new Error(error.message || "Image upload failed");
        // }

        //const imageUrl = await response.text(); 
        
        // const ideasResponse = await fetch('https://expressstartscan.vercel.app/analyze-image', {
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'application/json',
        //   },
        //   credentials: 'include', 
        //   body: JSON.stringify({ 
        //     userId: user.id, 
        //     image_url: imageUrl 
        //   }),
        //   signal: controller.signal, 
        // });

        //clearTimeout(timeoutId);


        // const ideasResult = await ideasResponse.json();
        //setIdeas(ideasResult.ideas);

      } catch (error) {

        setIdeas([
          {
            source: "你大爺3",
            strategy: "为什么出错",
            marketing: "Try again later",
            market_potential: "Unknown",
            target_audience: "Unknown",
          },
        ]);

        setCameraState("results");
      } finally {
        setIsLoading(false);
      }
    },
    [user]
  );

  return (
    <>
      <SignedIn>
        {cameraState === "active" ? (
          <CameraView 
            onExit={handleExit} 
            onCapture={handleCapture} 
            isLoading={isLoading}  // 添加加载状态
          />
        ) : cameraState === "results" ? (
          <ResultsView
            ideas={ideas}
            onRetake={() => {
              setIdeas([]); // 清空之前的结果
              setCameraState("active");
            }}
            onBack={() => {
              setIdeas([]); // 清空之前的结果
              setCameraState("idle");
            }}
          />
        ) : (
          <div className="relative w-full h-full">
            <AuroraBackground>
              <div className="relative w-full h-full flex flex-col items-center justify-center">
                {errorMessage && (
                  <div className="text-red-500 mb-4">{errorMessage}</div>
                )}
                {isLoading && <div className="mb-4">Collecting inspiration, please wait...</div>}
                {!isLoading && (
                  <CameraButton
                    onCameraStart={(stream) => {
                      setMediaStream(stream);
                      setErrorMessage("");
                      setCameraState("active");
                    }}
                    onError={(msg) => {
                      setErrorMessage(msg);
                    }}
                  />
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

export default App;
