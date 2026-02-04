export async function sendMessage(messages) {
  const res = await fetch("http://10.94.95.92:5000/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages })
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Chat failed");
  }

  return data;
}
