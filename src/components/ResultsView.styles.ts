import styled from "styled-components";

export const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  min-height: 400px; /* Ensure enough height for the effect */
  position: relative; /* Needed for absolute positioning of details */

  .main {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 28em;  // 增大容器宽度
    height: 28em; // 增大容器高度
    margin: 0 auto; // 确保居中
  }

  .hint-card, .card {
    width: 120px;  // 增大卡片尺寸
    height: 120px;
    font-size: 16px; // 增大字体
  }

  // 调整卡片展开位置
  .main:hover .card:nth-child(1) { transform: scale(1.2) translate(0, 0); }
  .main:hover .card:nth-child(2) { transform: scale(1.2) translate(0, -130%); }
  .main:hover .card:nth-child(3) { transform: scale(1.2) translate(-130%, 0); }
  .main:hover .card:nth-child(4) { transform: scale(1.2) translate(130%, 0); }
  .main:hover .card:nth-child(5) { transform: scale(1.2) translate(0, 130%); }
    transition: all 0.4s ease-in-out;
    margin-bottom: 20px; /* Add space below the interactive area */
  }

  .hint-card, .card {
    width: 80px; /* Adjust size */
    height: 80px; /* Adjust size */
    border-radius: 10px;
    background: rgba(229, 231, 235, 0.8); /* Light gray semi-transparent */
    backdrop-filter: blur(5px);
    -webkit-backdrop-filter: blur(5px);
    border: 1px solid rgba(255, 255, 255, 0.3);
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    transition: all 0.3s ease-in-out, background-color 0.2s ease-in-out;
    position: absolute; /* Absolute positioning within .main */
    opacity: 0; /* Hidden by default */
    pointer-events: none; /* Not interactive by default */
    font-size: 12px;
    text-align: center;
    padding: 5px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    color: #374151; /* Dark gray text */
    overflow: hidden; /* Prevent text overflow */
    white-space: normal; /* Allow text wrapping */
    word-break: break-word; /* Break words if needed */
    line-height: 1.2; /* Adjust line height */
  }

  .hint-card {
    opacity: 1; /* Visible initially */
    pointer-events: auto; /* Interactive initially */
    z-index: 1;
    font-size: 16px;
    line-height: 1.2;
    flex-direction: column; /* Stack icon and text */
  }

  .hint-card span {
    font-size: 24px; /* Larger icon */
    margin-bottom: 5px;
  }

  /* Initial state hides result cards */
  .main .card {
    transform: scale(0.8) translate(0, 0); /* Start slightly smaller and centered */
  }

  /* Hover state for .main */
  .main:hover {
    /* Optional: slightly enlarge the main container on hover */
    /* transform: scale(1.05); */
  }

  .main:hover .hint-card {
    opacity: 0;
    pointer-events: none;
    transform: scale(0.7);
  }

  .main:hover .card {
    opacity: 1;
    pointer-events: auto;
  }

  /* Positioning the 5 cards on hover using transform */
  .main:hover .card:nth-child(1) { /* Center */
    transform: scale(1) translate(0, 0);
    z-index: 5; /* Bring center card to front */
     transition-delay: 0s; /* Center appears first */
  }
  .main:hover .card:nth-child(2) { /* Top */
    transform: scale(1) translate(0, -110%);
    transition-delay: 0.05s;
  }
  .main:hover .card:nth-child(3) { /* Left */
    transform: scale(1) translate(-110%, 0);
     transition-delay: 0.1s;
  }
  .main:hover .card:nth-child(4) { /* Right */
    transform: scale(1) translate(110%, 0);
     transition-delay: 0.15s;
  }
  .main:hover .card:nth-child(5) { /* Bottom */
    transform: scale(1) translate(0, 110%);
     transition-delay: 0.2s;
  }

  /* Individual card hover effects */
  .card:hover {
    transform: scale(1.1) !important; /* Ensure hover scale overrides positioning transform, use important if needed */
    background-color: #3b82f6; /* Blue background on hover */
    color: white;
    z-index: 10; /* Ensure hovered card is on top */
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  }

  /* Detail View Style */
  .detail-view {
    position: fixed; /* Use fixed to overlay viewport */
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 90%;
    max-width: 600px; /* Increased max-width */
    background: white;
    padding: 30px; /* Increased padding */
    border-radius: 15px;
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.25); /* Softer shadow */
    z-index: 1000; /* Ensure it's above everything */
    border: 1px solid #e5e7eb;
    animation: fadeInScale 0.35s cubic-bezier(0.165, 0.84, 0.44, 1); /* Smoother animation */
    max-height: 85vh; /* Limit height */
    overflow-y: auto; /* Allow scrolling if content overflows */
  }

  /* Backdrop for detail view */
   .detail-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent black */
      z-index: 999; /* Below detail view, above everything else */
      animation: fadeIn 0.3s ease-out;
   }


  @keyframes fadeInScale {
    from { opacity: 0; transform: translate(-50%, -45%) scale(0.95); }
    to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
  }

   @keyframes fadeIn {
     from { opacity: 0; }
     to { opacity: 1; }
   }


  .detail-view h2 {
    font-size: 1.35rem; /* Slightly larger */
    font-weight: 700; /* Bolder */
    margin-bottom: 1rem; /* More space */
    color: #111827; /* Darker gray */
    border-bottom: 1px solid #eee; /* Separator line */
    padding-bottom: 0.5rem; /* Space below text before line */
  }
   .detail-view p {
    margin-bottom: 1rem; /* More space */
    line-height: 1.7; /* Increased line-height */
    color: #374151; /* Medium gray */
    font-size: 0.95rem; /* Slightly larger paragraph text */
  }
  .detail-view p strong {
    font-weight: 600; /* font-semibold */
    color: #1f2937; /* gray-800 */
    display: block; /* Make label block */
    margin-bottom: 0.25rem; /* Space between label and text */
  }

  .detail-close-button {
    position: absolute;
    top: 15px; /* More padding */
    right: 15px;
    background: #f9fafb; /* Lighter gray */
    border: 1px solid #e5e7eb; /* Subtle border */
    border-radius: 50%;
    width: 35px; /* Larger */
    height: 35px;
    font-size: 20px; /* Larger 'x' */
    line-height: 33px; /* Adjust line height */
    text-align: center;
    cursor: pointer;
    color: #6b7280; /* gray-500 */
    transition: all 0.2s ease-in-out;
  }

  .detail-close-button:hover {
      background-color: #f3f4f6; /* Slightly darker gray */
      color: #1f2937; /* gray-800 */
      transform: rotate(90deg); /* Add a little rotation */
      border-color: #d1d5db;
  }

  /* Action Buttons Styling */
  .action-buttons {
    display: flex;
    justify-content: center; /* Center buttons */
    gap: 20px; /* More space between buttons */
    margin-top: 30px; /* More space above buttons */
    width: 100%;
  }

  .action-button {
    padding: 12px 24px; /* Larger padding */
    border-radius: 10px; /* More rounded */
    border: none;
    font-size: 1rem;
    font-weight: 600; /* Bolder */
    cursor: pointer;
    transition: background-color 0.2s, box-shadow 0.2s, transform 0.1s;
    background-color: #4f46e5; /* Indigo background */
    color: white;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .action-button:hover {
    background-color: #4338ca; /* Darker indigo */
    box-shadow: 0 6px 10px rgba(0, 0, 0, 0.15);
    transform: translateY(-1px); /* Slight lift */
  }

   .action-button:active {
       transform: translateY(0px); /* Press down effect */
       box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
   }

   .action-button.secondary {
     background-color: #6b7280; /* Gray background */
   }

   .action-button.secondary:hover {
     background-color: #4b5563; /* Darker gray */
   }

  .main {
    position: relative;
    width: 300px;
    height: 300px;
    margin: 0 auto;
  }

  /* 新增旋转容器 */
  .rotating-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
    animation: rotate 12s linear infinite;
    transform-origin: 50% 50%;
  }

  /* 中心卡片定位居中 */
  .center-card {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 2;
  }

  /* 其他四个外围卡片预先定位在圆上 */
  .outer-card:nth-child(2) {  /* index=1，ideas[1] */
    position: absolute; top: 0%; left: 50%; transform: translate(-50%, 0);
  }
  .outer-card:nth-child(3) {
    position: absolute; top: 50%; left: 100%; transform: translate(-100%, -50%);
  }
  .outer-card:nth-child(4) {
    position: absolute; top: 100%; left: 50%; transform: translate(-50%, -100%);
  }
  .outer-card:nth-child(5) {
    position: absolute; top:50%; left:0%; transform: translate(0%, -50%);
  }

  @keyframes rotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  .main {
    max-width: 90vw;
    max-height: 90vw;
    width: 90vw;
    height: 90vw;
    margin: 0 auto;
    position: relative;
  }

  .rotating-wrapper {
    width: 100%;
    height: 100%;
    position: relative;
    animation: rotate 12s linear infinite;
    transform-origin: 50% 50%;
  }

  @keyframes rotate {
    0%   { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  .card {
    position: absolute;
    width: 60px;
    height: 60px;
    border-radius: 10px;
    background: rgba(229,231,235,0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    overflow: hidden;
    white-space: normal;
    word-break: break-word;
    padding: 5px;
    font-size: 12px;
    color: #374151;
  }

  .center-card {
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 10;
  }

  /* 五芒星分布，部分可微调 */
  .outer-card:nth-child(2) { top: 10%;  left: 50%; transform: translate(-50%, 0); }
  .outer-card:nth-child(3) { top: 50%;  left: 90%; transform: translate(-50%, -50%); }
  .outer-card:nth-child(4) { top: 90%;  left: 50%; transform: translate(-50%, -100%); }
  .outer-card:nth-child(5) { top: 50%;  left: 10%; transform: translate(-50%, -50%); }

  /* Hint居最上覆盖 */
  .hint-card {
    position: absolute;
    top:50%; left:50%;
    transform:translate(-50%,-50%);
    font-size:16px;
    background: rgba(255,255,255,0.8);
    padding: 8px 12px;
    border-radius: 8px;
    z-index:20;
    pointer-events: none;
  }

  .main:hover .card {
    opacity: 1;
    pointer-events: auto;
  }

  /* Positioning the 5 cards on hover using transform */
  .main:hover .card:nth-child(1) { /* Center */
    transform: scale(1) translate(0, 0);
    z-index: 5; /* Bring center card to front */
     transition-delay: 0s; /* Center appears first */
  }
  .main:hover .card:nth-child(2) { /* Top */
    transform: scale(1) translate(0, -110%);
    transition-delay: 0.05s;
  }
  .main:hover .card:nth-child(3) { /* Left */
    transform: scale(1) translate(-110%, 0);
     transition-delay: 0.1s;
  }
  .main:hover .card:nth-child(4) { /* Right */
    transform: scale(1) translate(110%, 0);
     transition-delay: 0.15s;
  }
  .main:hover .card:nth-child(5) { /* Bottom */
    transform: scale(1) translate(0, 110%);
     transition-delay: 0.2s;
  }

  /* Individual card hover effects */
  .card:hover {
    transform: scale(1.1) !important; /* Ensure hover scale overrides positioning transform, use important if needed */
    background-color: #3b82f6; /* Blue background on hover */
    color: white;
    z-index: 10; /* Ensure hovered card is on top */
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  }

  /* Detail View Style */
  .detail-view {
    position: fixed; /* Use fixed to overlay viewport */
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 90%;
    max-width: 600px; /* Increased max-width */
    background: white;
    padding: 30px; /* Increased padding */
    border-radius: 15px;
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.25); /* Softer shadow */
    z-index: 1000; /* Ensure it's above everything */
    border: 1px solid #e5e7eb;
    animation: fadeInScale 0.35s cubic-bezier(0.165, 0.84, 0.44, 1); /* Smoother animation */
    max-height: 85vh; /* Limit height */
    overflow-y: auto; /* Allow scrolling if content overflows */
  }

  /* Backdrop for detail view */
   .detail-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent black */
      z-index: 999; /* Below detail view, above everything else */
      animation: fadeIn 0.3s ease-out;
   }


  @keyframes fadeInScale {
    from { opacity: 0; transform: translate(-50%, -45%) scale(0.95); }
    to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
  }

   @keyframes fadeIn {
     from { opacity: 0; }
     to { opacity: 1; }
   }


  .detail-view h2 {
    font-size: 1.35rem; /* Slightly larger */
    font-weight: 700; /* Bolder */
    margin-bottom: 1rem; /* More space */
    color: #111827; /* Darker gray */
    border-bottom: 1px solid #eee; /* Separator line */
    padding-bottom: 0.5rem; /* Space below text before line */
  }
   .detail-view p {
    margin-bottom: 1rem; /* More space */
    line-height: 1.7; /* Increased line-height */
    color: #374151; /* Medium gray */
    font-size: 0.95rem; /* Slightly larger paragraph text */
  }
  .detail-view p strong {
    font-weight: 600; /* font-semibold */
    color: #1f2937; /* gray-800 */
    display: block; /* Make label block */
    margin-bottom: 0.25rem; /* Space between label and text */
  }

  .detail-close-button {
    position: absolute;
    top: 15px; /* More padding */
    right: 15px;
    background: #f9fafb; /* Lighter gray */
    border: 1px solid #e5e7eb; /* Subtle border */
    border-radius: 50%;
    width: 35px; /* Larger */
    height: 35px;
    font-size: 20px; /* Larger 'x' */
    line-height: 33px; /* Adjust line height */
    text-align: center;
    cursor: pointer;
    color: #6b7280; /* gray-500 */
    transition: all 0.2s ease-in-out;
  }

  .detail-close-button:hover {
      background-color: #f3f4f6; /* Slightly darker gray */
      color: #1f2937; /* gray-800 */
      transform: rotate(90deg); /* Add a little rotation */
      border-color: #d1d5db;
  }

  /* Action Buttons Styling */
  .action-buttons {
    display: flex;
    justify-content: center; /* Center buttons */
    gap: 20px; /* More space between buttons */
    margin-top: 30px; /* More space above buttons */
    width: 100%;
  }

  .action-button {
    padding: 12px 24px; /* Larger padding */
    border-radius: 10px; /* More rounded */
    border: none;
    font-size: 1rem;
    font-weight: 600; /* Bolder */
    cursor: pointer;
    transition: background-color 0.2s, box-shadow 0.2s, transform 0.1s;
    background-color: #4f46e5; /* Indigo background */
    color: white;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .action-button:hover {
    background-color: #4338ca; /* Darker indigo */
    box-shadow: 0 6px 10px rgba(0, 0, 0, 0.15);
    transform: translateY(-1px); /* Slight lift */
  }

   .action-button:active {
       transform: translateY(0px); /* Press down effect */
       box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
   }

   .action-button.secondary {
     background-color: #6b7280; /* Gray background */
   }

   .action-button.secondary:hover {
     background-color: #4b5563; /* Darker gray */
   }

  .main {
    position: relative;
    width: 300px;
    height: 300px;
    margin: 0 auto;
  }

  /* 新增旋转容器 */
  .rotating-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
    animation: rotate 12s linear infinite;
    transform-origin: 50% 50%;
  }

  /* 中心卡片定位居中 */
  .center-card {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 2;
  }

  /* 其他四个外围卡片预先定位在圆上 */
  .outer-card:nth-child(2) {  /* index=1，ideas[1] */
    position: absolute; top: 0%; left: 50%; transform: translate(-50%, 0);
  }
  .outer-card:nth-child(3) {
    position: absolute; top: 50%; left: 100%; transform: translate(-100%, -50%);
  }
  .outer-card:nth-child(4) {
    position: absolute; top: 100%; left: 50%; transform: translate(-50%, -100%);
  }
  .outer-card:nth-child(5) {
    position: absolute; top:50%; left:0%; transform: translate(0%, -50%);
  }

  @keyframes rotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  `;
