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
      try {
        setIsLoading(true);
        setErrorMessage("");

        if (!image || image.length < 100) {
          throw new Error("Invalid image data");
        }

        if (!user?.id) {
          throw new Error("User ID is missing");
        }


        const base64Data = image.split(",")[1];
        if (!base64Data) {
          throw new Error("Invalid Base64 image data");
        }


        const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`;
        const formData = new FormData();
        formData.append('file', `data:image/png;base64,${base64Data}`);
        formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

        const response = await fetch(cloudinaryUrl, {
          method: 'POST',
          body: formData
        });

        const responseJson = await response.json();
        if (!response.ok) {
          throw new Error(responseJson.message || "Image upload failed");
        }


        const imageUrl = responseJson.secure_url;

        
        const ideasResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/analyze-image`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            userId: user?.id || "defaultUserId", 
            image_url: imageUrl
          })
        });


        if (!ideasResponse.ok) {
          throw new Error('Analysis failed');
        }
        
        const ideasResult = await ideasResponse.json();
        const cleanedIdeas = ideasResult.ideas.map((idea: Idea) => ({
          source: idea.source.trim(),
          strategy: idea.strategy.trim(),
          marketing: idea.marketing.trim(),
          market_potential: idea.market_potential.trim(),
          target_audience: idea.target_audience.trim()
        }));
        setIdeas(cleanedIdeas);
        setCameraState("results");

      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : "Unknown error");
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
