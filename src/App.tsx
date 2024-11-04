import { Button } from '@nextui-org/react';
import { PDFDocument } from 'pdf-lib';
import { useCallback, useEffect, useRef, useState } from 'react';
import { searchFile } from './utils/serachFiles';
import { getFile } from './utils/getFile';

const App = () => {
  const holdingDoc = useRef<PDFDocument>();
  const workingDoc = useRef<PDFDocument>();

  const [gapiLoaded, setGapiLoaded] = useState(false);
  const [gIsInited, setGisInited] = useState(false);
  const tokenClient = useRef<google.accounts.oauth2.TokenClient>();

  const [iframeSrc, setIframeSrc] = useState('');

  useEffect(() => {
    (async () => {
      gapi.load('client', async () => {
        await gapi.client.init({
          apiKey: import.meta.env.VITE_GAPI_API_KEY,
          discoveryDocs: [
            'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest',
          ],
          clientId: import.meta.env.VITE_GAPI_CLIENT_ID,
        });
        setGapiLoaded(true);
      });

      tokenClient.current = google.accounts.oauth2.initTokenClient({
        client_id: import.meta.env.VITE_GAPI_CLIENT_ID,
        scope:
          'https://www.googleapis.com/auth/drive.metadata.readonly https://www.googleapis.com/auth/drive.readonly',
        callback: async () => {
          await fetchHoldingDoc();
        },
      });
      setGisInited(true);
    })();
  }, []);

  async function fetchHoldingDoc() {
    // const files = await searchFile({ q: "name contains 'fac_inv_hold_doc'" });
    const files = await searchFile({ q: "name contains 'Accessory'" });
    if (!files) return;

    const holdingFileId = files[0].id;
    if (!holdingFileId) return;

    const holdingFileBytes = await getFile({ fileId: holdingFileId });
    if (!holdingFileBytes) return;

    const binString = Array.from(
      new TextEncoder().encode(holdingFileBytes),
      (byte) => String.fromCodePoint(byte),
    ).join('');

    holdingDoc.current = await PDFDocument.load(btoa(binString));

    const uri = await holdingDoc.current.saveAsBase64({ dataUri: true });
    setIframeSrc(uri);
  }

  const onAuthClick = useCallback(async () => {
    if (!tokenClient.current) return;

    if (gapi.client.getToken() === null) {
      // Prompt the user to select a Google Account and ask for consent to share their data
      // when establishing a new session.
      tokenClient.current.requestAccessToken({ prompt: 'consent' });
    } else {
      // Skip display of account chooser and consent dialog for an existing session.
      tokenClient.current.requestAccessToken({ prompt: '' });
    }
  }, []);

  const signOut = useCallback(() => {
    const token = gapi.client.getToken();
    if (token !== null) {
      google.accounts.oauth2.revoke(token.access_token, () => {});
    }
  }, []);

  return (
    <div>
      <iframe src={iframeSrc} />
      <Button onClick={onAuthClick} isDisabled={!(gapiLoaded && gIsInited)}>
        Authorize
      </Button>
      <Button onClick={signOut} isDisabled={!(gapiLoaded && gIsInited)}>
        Sign Out
      </Button>
    </div>
  );
};

export default App;
