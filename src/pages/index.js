// src/pages/index.js
import { useEffect } from "react";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to signup page on initial load
    router.push("/signup");
  }, [router]);

  return null; // Render nothing, as this page is only for redirection
}
