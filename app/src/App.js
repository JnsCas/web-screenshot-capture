import './App.css';
import { useState } from 'react';
import * as apiScreenshot from './api/screenshot';
import isURL from 'validator/es/lib/isURL';
import { FormatTypes } from './FormatTypes';
import ReactLoading from 'react-loading';
import { CaptureMethods } from './CaptureMethods';
import { sanitizeUrl } from './utils';

const TITLE_ERROR_MESSAGE = 'Something went wrong.';
const ERROR_MESSAGE = TITLE_ERROR_MESSAGE + '\nAre you sure you entered a valid URL?';

function App() {
  const [url, setUrl] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [screenshots, setScreenshots] = useState([]);
  const [format, setFormat] = useState(FormatTypes.PNG);
  const [loading, setLoading] = useState(false);

  const addScreenshot = (blob) => {
    const objectURL = window.URL.createObjectURL(blob);
    const screenshot = { name: `${url}-${Date.now()}.${format}`, objectURL };
    setScreenshots([...screenshots, screenshot]);
  };

  const handleInputOnChange = (e) => {
    const url = e.target.value;
    setUrl(url);
    if (isURL(url)) {
      setIsButtonDisabled(false);
    } else {
      setIsButtonDisabled(true);
    }
  };

  const captureFromElectron = async (sanitizedUrl) => {
    const { buffer, error } = await window.electronAPI.captureScreenshot(sanitizedUrl, format);
    if (error) {
      if (error.includes('ERR_NAME_NOT_RESOLVED')) {
        alert(ERROR_MESSAGE);
      } else {
        alert(TITLE_ERROR_MESSAGE);
      }
    } else {
      const blob = new Blob([buffer], {
        type: `${FormatTypes.PNG === format ? 'image/png' : 'application/pdf'}`,
      });
      addScreenshot(blob);
    }
  };

  const captureFromServer = async (sanitizedUrl) => {
    try {
      const blob = await apiScreenshot.getScreenshot(sanitizedUrl, format);
      addScreenshot(blob);
    } catch (e) {
      alert(ERROR_MESSAGE);
    }
  };

  const handleButtonCapture = async (captureMethod) => {
    setLoading(true);
    const sanitizedUrl = sanitizeUrl(url);
    if (captureMethod === CaptureMethods.FROM_SERVER) {
      await captureFromServer(sanitizedUrl);
    } else {
      await captureFromElectron(sanitizedUrl);
    }
    setLoading(false);
  };

  const ButtonSection = () => {
    if (loading) {
      return <ReactLoading type="spin" color="black" height={30} width={30} />;
    }
    return (
      <>
        <button
          onClick={() => handleButtonCapture(CaptureMethods.FROM_ELECTRON)}
          disabled={isButtonDisabled}
        >
          Capture From Electron
        </button>
        <button
          style={{ marginRight: '20px' }}
          onClick={() => handleButtonCapture(CaptureMethods.FROM_SERVER)}
          disabled={isButtonDisabled}
        >
          Capture From Server
        </button>
      </>
    );
  };

  return (
    <div className="App">
      <h2>Web Screenshot Capture</h2>
      <div className="URLSection">
        <label htmlFor="url">URL:</label>
        <input value={url} onChange={handleInputOnChange} />
      </div>
      <div>
        <label>Format:</label>
        <input
          type="radio"
          value="PNG"
          checked={format === FormatTypes.PNG}
          onChange={() => setFormat(FormatTypes.PNG)}
        />
        <label htmlFor="png">PNG</label>
        <input
          type="radio"
          value="PDF"
          checked={format === FormatTypes.PDF}
          onChange={() => setFormat(FormatTypes.PDF)}
        />
        <label htmlFor="pdf">PDF</label>
      </div>
      <div className="ButtonSection">
        <ButtonSection />
      </div>
      <div className="DownloadLinks">
        <label>Download links:</label>
        <ol>
          {screenshots.map((screenshot, index) => (
            <li key={index}>
              <a href={screenshot.objectURL} download={screenshot.name}>
                {screenshot.name}
              </a>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

export default App;
