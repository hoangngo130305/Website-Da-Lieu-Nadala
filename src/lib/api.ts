// Sử dụng biến môi trường để linh hoạt giữa dev và production
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://14.224.210.210:8000";

export const login = async (username: string, password: string) => {
  console.log("Sending login request to:", `${API_BASE_URL}/api/token/`, {
    username,
    password,
  });

  const response = await fetch(`${API_BASE_URL}/api/token/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  const raw = await response.text();
  console.log("Raw response:", raw);

  let data: any = {};
  try {
    data = raw ? JSON.parse(raw) : {};
  } catch (err) {
    console.error("JSON parse error:", err);
  }

  if (!response.ok) {
    console.log("Login error response:", data);
    throw new Error(data.detail || "Login failed");
  }

  return data;
};
