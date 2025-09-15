export const login = async (username: string, password: string) => {
  const API_URL = "http://14.224.210.210:8000/api/token/";

  console.log("Sending login request to:", API_URL, {
    username,
    password,
  });

  const response = await fetch(API_URL, {
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
