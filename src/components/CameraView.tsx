import { useCallback, useRef, useState } from "react";
import Webcam from "react-webcam";

interface CameraViewProps {
  onExit: () => void;
  onCapture?: (image: string) => void;
}

export const CameraView = ({ onExit, onCapture }: CameraViewProps) => {
  const webcamRef = useRef<Webcam>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setPreviewImage(imageSrc);
      // 检查是否成功获取到图片
      console.log("拍照成功，图片大小:", imageSrc.length);
      onCapture?.(imageSrc);  // 调用父组件的处理函数
    } else {
      console.error("拍照失败：未能获取图片");
    }
  }, [onCapture]);

  return (
    <div className="flex flex-col items-center justify-start min-h-screen pt-12 pb-8 bg-zinc-50 dark:bg-zinc-900">
      <div className="relative w-full max-w-2xl aspect-[3/4] bg-black rounded-2xl overflow-hidden">
        {previewImage ? (
          <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
        ) : (
          <Webcam
            ref={webcamRef}
            audio={false}
            screenshotFormat="image/jpeg"
            videoConstraints={{
              facingMode: "environment",
            }}
            className="w-full h-full object-cover"
          />
        )}

        <div className="absolute bottom-8 left-0 right-0 flex justify-center space-x-6">
          <button
            onClick={onExit}
            className="rounded-full bg-white/30 p-4 backdrop-blur-sm"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="white"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3"
              />
            </svg>
          </button>

          <button
            onClick={capture}
            className="rounded-full bg-white/30 p-4 backdrop-blur-sm"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="white"
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
          </button>
        </div>
      </div>
    </div>
  );
};