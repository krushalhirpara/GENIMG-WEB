export default function Home() {
  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h1>Site Live ✅</h1>
      <p>Vercel working perfectly</p>
    </div>
  );
}

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async (e: any) => {
    e.preventDefault();

    if (!prompt) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();
      setResult(data.image);
    } catch (err) {
      console.log(err);
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h1 style={{ fontSize: "40px", fontWeight: "bold" }}>
        AI Image Generator 🚀
      </h1>

      <form onSubmit={handleGenerate} style={{ marginTop: "30px" }}>
        <input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter prompt..."
          style={{
            padding: "12px",
            width: "300px",
            border: "1px solid #ccc",
          }}
        />

        <br /><br />

        <button
          type="submit"
          style={{
            padding: "10px 20px",
            background: "black",
            color: "white",
          }}
        >
          {loading ? "Generating..." : "Generate"}
        </button>
      </form>

      {result && (
        <div style={{ marginTop: "30px" }}>
          <Image src={result} alt="result" width={400} height={400} />
        </div>
      )}

      <div style={{ marginTop: "40px" }}>
        <Link href="/tools/image-generator">Go to Tools</Link>
      </div>
    </div>
  );
}
