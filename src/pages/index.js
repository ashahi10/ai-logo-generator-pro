import LogoGenerator from "../components/LogoGenerator";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8 min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-4">AI Logo Generator</h1>
      <LogoGenerator />
    </div>
  );
}
