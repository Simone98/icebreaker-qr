import { useMemo, useState, useRef } from "react"; // 1. AGGIUNTO useRef
import { QRCodeSVG } from "qrcode.react";
import { compressToEncodedURIComponent } from "lz-string";

export default function App() {
  const [baseUrl, setBaseUrl] = useState("https://icebreaker-six-topaz.vercel.app");
  const [personaggio, setPersonaggio] = useState("Amogus");
  const [colore, setColore] = useState("#ff00ff");
  const [frase, setFrase] = useState("Frase di esempio che può essere lunga");
  const [isInglese, setIsInglese] = useState(false);

  // 2. CREIAMO UN RIFERIMENTO PER IL CONTENITORE DEL QR
  const qrRef = useRef(null);

  const encodedData = useMemo(() => {
    return compressToEncodedURIComponent(
      JSON.stringify({
        personaggio,
        colore,
        frase,
        isInglese,
      })
    );
  }, [personaggio, colore, frase, isInglese]);

  const finalUrl = useMemo(() => {
    const cleanBase = baseUrl.replace(/\/$/, "");
    return `${cleanBase}?data=${encodedData}`;
  }, [baseUrl, encodedData]);

  const copyUrl = async () => {
    await navigator.clipboard.writeText(finalUrl);
    alert("URL copiato!");
  };

  // 3. FUNZIONE DI CONVERSIONE E DOWNLOAD IN PNG
  const downloadQr = () => {
    if (!qrRef.current) return;

    // Trova l'elemento <svg> generato dentro il nostro contenitore div
    const svgElement = qrRef.current.querySelector("svg");
    if (!svgElement) return;

    // Convertiamo l'SVG in stringa di testo e poi in un Blob di dati
    const svgString = new XMLSerializer().serializeToString(svgElement);
    const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
    const URL = window.URL || window.webkitURL || window;
    const blobUrl = URL.createObjectURL(svgBlob);

    // Creiamo un'immagine virtuale per il rendering
    const image = new Image();
    image.onload = () => {
      // Creiamo un Canvas temporaneo dove disegnare l'immagine SVG
      const canvas = document.createElement("canvas");
      canvas.width = 300; // Stessa dimensione del tuo QR
      canvas.height = 300;
      const context = canvas.getContext("2d");

      // Riempiamo lo sfondo di bianco prima di disegnare il QR
      context.fillStyle = "#ffffff";
      context.fillRect(0, 0, canvas.width, canvas.height);

      // Disegniamo il QR Code sopra lo sfondo bianco
      context.drawImage(image, 0, 0);

      // Creiamo un link di download "volante" in puro stile JS
      const downloadLink = document.createElement("a");
      downloadLink.href = canvas.toDataURL("image/png");
      downloadLink.download = `QR_${personaggio.replace(/\s+/g, "_")}.png`; // Nome del file personalizzato con l'eroe
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      
      // Puliamo la memoria
      URL.revokeObjectURL(blobUrl);
    };

    image.src = blobUrl;
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

      <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
        <button
          onClick={copyUrl}
          style={{
            padding: "10px 20px",
            cursor: "pointer",
          }}
        >
          Copia URL
        </button>

        {/* 4. NUOVO PULSANTE PER IL DOWNLOAD */}
        <button
          onClick={downloadQr}
          style={{
            padding: "10px 20px",
            cursor: "pointer",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "4px",
            fontWeight: "bold"
          }}
        >
          Scarica QR Immagine (PNG)
        </button>
      </div>

      {/* 5. AGGIUNTO IL REF AL CONTENITORE DEL QR */}
      <div ref={qrRef} style={{ marginTop: 40, textAlign: "center" }}>
        <QRCodeSVG value={finalUrl} size={300} />
      </div>
    </div>
  );
}