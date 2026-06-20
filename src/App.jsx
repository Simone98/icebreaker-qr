import { useMemo, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { compressToEncodedURIComponent } from "lz-string";

export default function App() {
  const [baseUrl, setBaseUrl] = useState("https://icebreaker-six-topaz.vercel.app");

  const [personaggio, setPersonaggio] = useState("Amogus");
  const [colore, setColore] = useState("#ff00ff");
  const [frase, setFrase] = useState(
    "Frase di esempio che può essere lunga"
  );
  // 1. NUOVO STATO PER IL BOOLEAN
  const [isInglese, setIsInglese] = useState(false);

  const encodedData = useMemo(() => {
    return compressToEncodedURIComponent(
      JSON.stringify({
        personaggio,
        colore,
        frase,
        isInglese, // 2. AGGIUNTO ALL'OGGETTO COMPRESSO
      })
    );
  }, [personaggio, colore, frase, isInglese]); // 3. AGGIUNTA LA DIPENDENZA QUI

  const finalUrl = useMemo(() => {
    const cleanBase = baseUrl.replace(/\/$/, "");
    return `${cleanBase}?data=${encodedData}`;
  }, [baseUrl, encodedData]);

  const copyUrl = async () => {
    await navigator.clipboard.writeText(finalUrl);
    alert("URL copiato!");
  };

  return (
    <div
      style={{
        maxWidth: 800,
        margin: "40px auto",
        padding: 24,
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1>Generatore URL + QR Code</h1>

      <div style={{ display: "grid", gap: 12 }}>
        <label>
          <div>URL base</div>
          <input
            type="text"
            value={baseUrl}
            onChange={(e) => setBaseUrl(e.target.value)}
            style={{ width: "100%", padding: 8 }}
          />
        </label>

        <label>
          <div>Personaggio</div>
          <input
            type="text"
            value={personaggio}
            onChange={(e) => setPersonaggio(e.target.value)}
            style={{ width: "100%", padding: 8 }}
          />
        </label>

        <label style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
          <input
            type="checkbox"
            checked={isInglese}
            onChange={(e) => setIsInglese(e.target.checked)}
            style={{ width: 18, height: 18, cursor: "pointer" }}
          />
          <div style={{ fontWeight: "bold", cursor: "pointer" }}>Imposta lingua in Inglese (isInglese)</div>
        </label>

        <label style={{ marginTop: 4 }}>
          <div>Colore</div>
          <input
            type="color"
            value={colore}
            onChange={(e) => setColore(e.target.value)}
          />
        </label>

        <label>
          <div>Frase</div>
          <textarea
            rows="4"
            value={frase}
            onChange={(e) => setFrase(e.target.value)}
            style={{ width: "100%", padding: 8 }}
          />
        </label>
      </div>

      <h2 style={{ marginTop: 30 }}>Stringa compressa</h2>

      <textarea
        readOnly
        value={encodedData}
        rows="5"
        style={{
          width: "100%",
          fontFamily: "monospace",
          padding: 8,
        }}
      />

      <h2 style={{ marginTop: 30 }}>URL finale</h2>

      <textarea
        readOnly
        value={finalUrl}
        rows="4"
        style={{
          width: "100%",
          fontFamily: "monospace",
          padding: 8,
        }}
      />

      <button
        onClick={copyUrl}
        style={{
          marginTop: 12,
          padding: "10px 20px",
          cursor: "pointer",
        }}
      >
        Copia URL
      </button>

      <div style={{ marginTop: 40, textAlign: "center" }}>
        <QRCodeSVG value={finalUrl} size={300} />
      </div>
    </div>
  );
}