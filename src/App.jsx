import { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";

// Configura el worker de PDF.js (necesario para renderizar PDFs)
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

function App() {
  const [locationData, setLocationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pdfLoading, setPdfLoading] = useState(true);
  const [numPages, setNumPages] = useState(null);

  // URL del PDF en Google Drive (reemplaza con tu enlace)
  const pdfUrl =
    "https://drive.google.com/file/d/11YdnH8awbbWfgUubrrFwoEg8krq1rYsj/preview";

  // Fetch geolocalización
  useEffect(() => {
    fetch("http://ip-api.com/json/?fields=country,city,lat,lon,isp,query")
      .then((response) => response.json())
      .then((data) => {
        setLocationData(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Cargador del PDF
  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setPdfLoading(false);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Sección superior: Datos de geolocalización */}
      <div className="bg-white shadow-md p-4">
        <h1 className="text-xl font-bold text-gray-800">
          Información de Ubicación
        </h1>
        {loading ? (
          <p className="text-gray-600">Cargando ubicación...</p>
        ) : (
          locationData && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
              {/*<div>
                <span className="font-semibold">IP:</span> {locationData.query}
              </div>*/}
              <div>
                <span className="font-semibold">Ciudad:</span>{" "}
                {locationData.city}
              </div>
              <div>
                <span className="font-semibold">País:</span>{" "}
                {locationData.country}
              </div>
              <div>
                <span className="font-semibold">ISP:</span> {locationData.isp}
              </div>
            </div>
          )
        )}
      </div>

      {/* Visor de PDF (ocupa el resto de la pantalla) */}
      <div className="flex-1 overflow-hidden p-2">
        {pdfLoading && (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}
        <iframe
          src={pdfUrl}
          className="w-full h-full border-none"
          onLoad={() => setPdfLoading(false)}
        ></iframe>
      </div>
    </div>
  );
}

export default App;
