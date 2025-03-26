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
  const [cameraState, setCameraState] = useState<
    "idle" | "active" | "error" | "results"
  >("idle");

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

  interface PicGoResponse {
    success: boolean;
    message?: string;
    image: {
      url: string;
    };
  }

  const handleCapture = useCallback(
    async (image: string) => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      try {
        setIsLoading(true);
        setErrorMessage(""); 

        if (!image || image.length < 100) {
          throw new Error("Invalid image data");
        }
        const picgoApiKey = import.meta.env.VITE_PICGO_API_KEY;
        if (!picgoApiKey) {
          throw new Error("API key not configured");
        }

        if (!user) {
          throw new Error("User not logged in");
        }

        const formData = new FormData();
        const base64Data = image.split(",")[1];
        if (!base64Data) {
          throw new Error("Invalid Base64 image data");
        }
        formData.append("source", base64Data);
        formData.append("expiration", "PT5M");

        const response = await fetch(`https://www.picgo.net/api/1/upload`, {
          method: "POST",
          headers: {
            "X-API-Key": picgoApiKey,
          },
          body: formData,
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || "Image upload failed");
        }

        const result = (await response.json()) as PicGoResponse;
        const imageUrl = result.image.url;
        console.log("Image uploaded successfully, URL:", imageUrl);

        const testUserId = "user_2MZ45q577671Xx24rYt4";
        const testImageUrl = "https://img.picgo.net/2025/03/25/e4d6cbefb4544e87b2deb9d13383a5d12d291bc66b93b696.jpg";
        const ideasResponse = await fetch('https://expressstartscan.vercel.app/analyze-image', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            userId: testUserId, 
            image_url: testImageUrl 
          }),
          signal: controller.signal, 
        });

        clearTimeout(timeoutId);

        if (!ideasResponse.ok) {
          const error = await ideasResponse.json();
         
          if (ideasResponse.status === 429) {
throw new Error("Daily request limit reached, please try again tomorrow");
          }
          throw new Error(error.error || "Failed to analyze image");
        }

        const ideasResult = await ideasResponse.json();
        setIdeas(ideasResult.ideas);

      } catch (error) {
        if (error instanceof Error) {
          console.error("Error:", error);
          setErrorMessage(error.message);
        } else {
          console.error("Unknown error:", error);
          setErrorMessage("An unknown error occurred");
        }

        setIdeas([
          {
            source: "Discovering",
            strategy: "Collecting more inspiration...",
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
                {isLoading && <div className="mb-4">Collecting inspiration, please wait...</div>}
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
