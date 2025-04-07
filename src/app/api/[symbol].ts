export default async function handler(req: { query: { symbol: string; }; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { error: string; }): void; new(): any; }; }; }) {
  const { symbol } = req.query;
  const backendUrl = process.env.BACKEND_URL || "http://localhost:8000";

  try {
    const backendResponse = await fetch(`${backendUrl}/stocks/${symbol}`);

    // Read raw response
    const text = await backendResponse.text();
    console.log("Backend Response:", text);

    // Check for JSON content
    const contentType = backendResponse.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      console.error("Unexpected Response:", text);
      res.status(500).json({ error: "Backend did not return JSON" });
      return;
    }

    // Parse JSON safely
    const data = JSON.parse(text);
    res.status(200).json(data);
  } catch (error) {
    console.error("Fetch Error:", error);
    res.status(500).json({ error: "Failed to fetch stock data" });
  }
}
