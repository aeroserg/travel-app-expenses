"use client";

const TELEGRAM_BOT_ID = "7860782185";
const ORIGIN = "http://158.160.44.174.nip.io:30701";
const RETURN_TO = "http://158.160.44.174.nip.io:30701/api/auth/telegram";

export default function TelegramLoginButton() {

  const handleLogin = () => {
    const nonce = Date.now().toString(36);

    const url =
      `https://oauth.telegram.org/auth` +
      `?bot_id=${TELEGRAM_BOT_ID}` +
      `&origin=${encodeURIComponent(ORIGIN)}` +
      `&return_to=${encodeURIComponent(RETURN_TO)}` +
      `&scope=profile` +
      `&request_access=write` +
      `&lang=ru` +
      `&nonce=${nonce}`;

    window.location.href = url;
  };

  return (
    <button
      onClick={handleLogin}
      style={{
        padding: "10px 20px",
        fontSize: "16px",
        borderRadius: "8px",
        backgroundColor: "#0088cc",
        color: "#fff",
        border: "none",
        cursor: "pointer",
      }}
    >
      Войти через Telegram
    </button>
  );
}
