export default function handler(request, response) {
  if (request.method !== "POST") {
    return response.status(405).json({ error: "Method not allowed" });
  }

  return response.status(200).json({
    ok: true,
    message: "Customer Context API is running."
  });
}
