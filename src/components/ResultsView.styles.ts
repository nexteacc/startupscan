import styled, { keyframes } from "styled-components";

// --- Keyframes ---
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const fadeOut = keyframes`
  from { opacity: 1; }
  to { opacity: 0; }
`;

const fadeInScale = keyframes`
  from { opacity: 0; transform: translate(-50%, -45%) scale(0.95); }
  to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
`;

const fadeOutScale = keyframes`
  from { opacity: 1; transform: translate(-50%, -50%) scale(1); }
  to { opacity: 0; transform: translate(-50%, -55%) scale(0.9); }
`;

const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

// --- Styled Component ---
export const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  min-height: 400px;
  position: relative; /* Needed for absolute positioning of details */

  /* Main container for the rotating cards */
  .main {
    position: relative;
    display: flex; /* Helps center the rotating wrapper if needed, but wrapper itself does positioning */
    justify-content: center;
    align-items: center;
    /* Using em units based on root font-size, adjust as needed */
    width: 28em;
    height: 28em;
    margin: 20px auto; /* Add some margin around the main area */
  }

  /* The element that actually rotates */
  .rotating-wrapper {
    position: absolute; /* Position inside .main */
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    animation: ${rotate} 20s linear infinite; /* Increased duration for slower rotation */
    transform-origin: 50% 50%;
    /* Ensure child cards are positioned relative to this */
  }

  /* Base styles for all cards (ideas and hint) */
  .card, .hint-card {
    position: absolute; /* Positioned within .rotating-wrapper or .main */
    width: 80px; /* Consistent card size */
    height: 80px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 5px;
    font-size: 12px;
    color: #374151; /* Dark gray text */
    background: rgba(229, 231, 235, 0.8); /* Light gray semi-transparent */
    backdrop-filter: blur(5px);
    -webkit-backdrop-filter: blur(5px);
    border: 1px solid rgba(255, 255, 255, 0.3);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    white-space: normal;
    word-break: break-word;
    line-height: 1.2;
    cursor: pointer;
    transition: transform 0.3s ease-in-out, background-color 0.2s ease-in-out, color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  }

  /* Specific styles for the idea cards */
  .card {
    /* Cards are positioned by inline styles or specific classes below */
  }

  /* Center card positioning (relative to rotating-wrapper) */
  .center-card {
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 10; /* Above outer cards */
  }

  /* Outer card positioning (relative to rotating-wrapper, adjust percentages for desired layout) */
  /* These indices correspond to mapping order (0=center, 1=top, 2=right, 3=bottom, 4=left) */
  .outer-card:nth-child(2) { /* Top */
    top: 0%;
    left: 50%;
    transform: translate(-50%, -50%); /* Offset needed */
  }
  .outer-card:nth-child(3) { /* Right */
    top: 50%;
    left: 100%;
    transform: translate(-50%, -50%);
  }
  .outer-card:nth-child(4) { /* Bottom */
    top: 100%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .outer-card:nth-child(5) { /* Left */
    top: 50%;
    left: 0%;
    transform: translate(-50%, -50%);
  }

  /* Hint card: Positioned in the absolute center of .main, NOT rotating */
  .hint-card {
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 20; /* Highest layer */
    pointer-events: none; /* Non-interactive hint */
    font-size: 16px;
    background: rgba(255, 255, 255, 0.85); /* Slightly more opaque */
    padding: 8px 12px;
    border-radius: 8px;
    flex-direction: column; /* Stack icon and text */
  }

  .hint-card span {
    font-size: 24px; /* Larger icon */
    margin-bottom: 5px;
  }

  /* Individual card hover effect */
  .card:hover {
    transform: translate(-50%, -50%) scale(1.1); /* Keep translate for positioning, add scale */
    /* Important: The base transform needs to be accounted for in hover */
    /* Adjust based on how positioning transform is applied */
    /* Example: If base is just translate(-50%, -50%), then hover is fine */
    background-color: #3b82f6; /* Blue background */
    color: white;
    z-index: 15; /* Bring hovered card forward, but below hint */
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
  }
  /* Make sure center card hover scales correctly */
  .center-card:hover {
     transform: translate(-50%, -50%) scale(1.1);
  }


  /* --- Detail View Styles --- */

  /* Backdrop */
  .detail-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 999; /* Below detail view, above everything else */
    opacity: 0; /* Start hidden */

    &.visible {
        animation: ${fadeIn} 0.3s ease-out forwards;
    }
    &:not(.visible) {
        animation: ${fadeOut} 0.3s ease-in forwards;
    }
  }

  /* Detail View Modal */
  .detail-view {
    position: fixed;
    top: 50%;
    left: 50%;
    /* transform starts in animation */
    width: 90%;
    max-width: 600px;
    background: white;
    padding: 30px;
    border-radius: 15px;
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.25);
    z-index: 1000;
    border: 1px solid #e5e7eb;
    max-height: 85vh;
    overflow-y: auto;
    opacity: 0; /* Start hidden */

    &.visible {
       animation: ${fadeInScale} 0.35s cubic-bezier(0.165, 0.84, 0.44, 1) forwards;
    }
    &:not(.visible) {
       animation: ${fadeOutScale} 0.3s cubic-bezier(0.55, 0.085, 0.68, 0.53) forwards;
    }

    h2 {
      font-size: 1.35rem;
      font-weight: 700;
      margin-bottom: 1rem;
      color: #111827;
      border-bottom: 1px solid #eee;
      padding-bottom: 0.5rem;
    }

    p {
      margin-bottom: 1rem;
      line-height: 1.7;
      color: #374151;
      font-size: 0.95rem;
    }

    p strong {
      font-weight: 600;
      color: #1f2937;
      display: block;
      margin-bottom: 0.25rem;
    }
  }

  /* Close Button inside Detail View */
  .detail-close-button {
    position: absolute;
    top: 15px;
    right: 15px;
    background: #f9fafb;
    border: 1px solid #e5e7eb;
    border-radius: 50%;
    width: 35px;
    height: 35px;
    font-size: 20px;
    line-height: 33px; /* Adjust for vertical centering */
    text-align: center;
    cursor: pointer;
    color: #6b7280;
    transition: all 0.2s ease-in-out;

    &:hover {
      background-color: #f3f4f6;
      color: #1f2937;
      transform: rotate(90deg);
      border-color: #d1d5db;
    }
  }

  /* --- Action Buttons --- */
  .action-buttons {
    display: flex;
    justify-content: center;
    gap: 20px;
    margin-top: 30px; /* Space above buttons */
    width: 100%;
  }

  .action-button {
    padding: 12px 24px;
    border-radius: 10px;
    border: none;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.2s, box-shadow 0.2s, transform 0.1s;
    background-color: #4f46e5; /* Indigo */
    color: white;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

    &:hover {
      background-color: #4338ca; /* Darker Indigo */
      box-shadow: 0 6px 10px rgba(0, 0, 0, 0.15);
      transform: translateY(-1px);
    }

    &:active {
      transform: translateY(0px);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    /* Secondary button style */
    &.secondary {
      background-color: #6b7280; /* Gray */
      &:hover {
        background-color: #4b5563; /* Darker Gray */
      }
    }
  }
`; // <-- 确保这个反引号存在且是文件最后一个字符
