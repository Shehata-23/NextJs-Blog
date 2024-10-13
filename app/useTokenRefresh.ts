// import { useSession } from "next-auth/react";
// import { useEffect, useRef, useState } from "react";

// const REFRESH_INTERVAL = 4 * 60 * 1000; // 4 minutes
// const EXPIRY_THRESHOLD = 5 * 60 * 1000; // 5 minutes

// export function useTokenRefresh() {
//   const { data: session, update } = useSession();
//   const intervalRef = useRef<NodeJS.Timeout | null>(null);
//   const [isClient, setIsClient] = useState(false);

//   useEffect(() => {
//     setIsClient(true);
//   }, []);

//   useEffect(() => {
//     if (!isClient) return;

//     const checkTokenExpiration = async () => {
//       if (session?.accessToken && session.exp) {
//         const tokenExp = session.exp;
//         const currentTime = Math.floor(Date.now() / 1000);

//         if (tokenExp - currentTime < EXPIRY_THRESHOLD / 1000) {
//           console.log("Token is about to expire. Refreshing...");
//           try {
//             await update();
//             console.log("Token refreshed successfully");
//           } catch (error) {
//             console.error("Failed to refresh token:", error);
//             // Additional error handling (e.g., logout, show error message)
//           }
//         }
//       }
//     };

//     const startInterval = () => {
//       if (intervalRef.current) clearInterval(intervalRef.current);
//       intervalRef.current = setInterval(checkTokenExpiration, REFRESH_INTERVAL);
//     };

//     checkTokenExpiration(); // Check immediately on mount or session change
//     startInterval();

//     return () => {
//       if (intervalRef.current) clearInterval(intervalRef.current);
//     };
//   }, [isClient, session, update]);
// }