import { useState } from 'react'
import './App.css'

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("");

  const handleSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    setFile(f || null);
    if (f) {
      setPreview(URL.createObjectURL(f));
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setStatus("ファイルを選んでください");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setStatus("アップロード中…");

      const res = await fetch("https://asia-northeast1-massive-house-480305-m8.cloudfunctions.net/upload_image", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        setStatus("アップロード失敗");
        return;
      }

      const data = await res.json();
      setStatus(`完了！ GCS URL: ${data.url}`);
    } catch (err) {
      setStatus("エラー");
    }
  };

  return (
    <>
      <h1>画像アップロード</h1>
      <input type="file" accept="image/*" onChange={handleSelectFile} />
      {preview && (
        <div style={{ marginTop: "1rem" }}>
          <p>プレビュー:</p>
          <img
            src={preview}
            alt="preview"
            style={{ width: "200px", borderRadius: "8px" }}
          />
        </div>
      )}

      <button
        onClick={handleUpload}
        style={{
          marginTop: "1rem",
          padding: "0.5rem 1rem",
          cursor: "pointer",
          background: "#000",
          color: "#fff",
        }}
      >
        うｐ
      </button>

      <p style={{ marginTop: "1rem" }}>{status}</p>
    </>
  )
}

export default App
