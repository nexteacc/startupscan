import { useState } from "react";
import { CameraButton } from "./components/CameraButton";
import { AuroraBackground } from "./components/AuroraBackground";
import { CameraView } from "./components/CameraView";
import ResultsView from "./components/ResultsView";
import { SignIn, SignedIn, SignedOut, useClerk } from "@clerk/clerk-react";

function App() {
  const { signOut, user } = useClerk(); // 添加 user
  const [cameraState, setCameraState] = useState<
    "idle" | "active" | "error" | "results"
  >("idle");
  const [ideas, setIdeas] = useState<
    Array<{
      source: string;
      strategy: string;
      marketing: string;
      market_potential: string;
      target_audience: string;
    }>
  >([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleExit = () => {
    setCameraState("idle");
    if (mediaStream) {
      mediaStream.getTracks().forEach((track) => track.stop());
      setMediaStream(null);
    }
  };

  const handleCapture = async (image: string) => {
    try {
      setIsLoading(true);

      //  验证图片数据
      if (!image || image.length < 100) {
        throw new Error("图片数据无效");
      }
      // 使用 import.meta.env 访问环境变量
      const imgbbApiKey = import.meta.env.VITE_IMGBB_API_KEY;
      console.log("IMGBB API Key:", imgbbApiKey);

      if (!user) {
        throw new Error("用户未登录");
      }

      const userId = user.id;
      console.log("用户 ID:", userId);

      // 上传图片到 ImgBB，并设置过期时间为 5 分钟
      const formData = new FormData();
      formData.append("image", image.split(",")[1]); // 去掉 Base64 前缀

      const response = await fetch(
        `https://api.imgbb.com/1/upload?expiration=300&key=${imgbbApiKey}`,
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await response.json(); // 解析返回的结果
      console.log("ImgBB 上传结果:", result);

      if (!result.success) {
        throw new Error("图片上传失败");
      }

      // 获取图片的直接访问 URL
      const imageUrl = result.data.url;
      console.log("图片上传成功，URL:", imageUrl);

      // 这里可以调用后端的大模型，传递 imageUrl
    } catch (error) {
      console.error("错误:", error);

      if (error instanceof Error) {
        setErrorMessage(error.message);
      }

      setIdeas([
        {
          source: "灵感待发现",
          strategy: "正在收集更多灵感...",
          marketing: "稍后再试",
          market_potential: "未知",
          target_audience: "未知",
        },
      ]);

      setCameraState("results");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <SignedIn>
        {cameraState === "active" ? (
          <CameraView onExit={handleExit} onCapture={handleCapture} />
        ) : cameraState === "results" ? (
          <ResultsView
            ideas={ideas}
            onRetake={() => setCameraState("active")}
          />
        ) : (
          <div className="relative w-full h-full">
            <AuroraBackground>
              <div className="relative w-full h-full flex flex-col items-center justify-center">
                {cameraState === "error" && (
                  <div className="text-red-500 mb-4">{errorMessage}</div>
                )}
                {isLoading && <div className="mb-4">灵感收集中，请稍候...</div>}
                {!isLoading && cameraState === "idle" && (
                  <CameraButton
                    onCameraStart={(stream) => {
                      setMediaStream(stream);
                      setCameraState("active");
                    }}
                    onError={(msg) => {
                      setCameraState("error");
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
                <span>退出</span>
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
