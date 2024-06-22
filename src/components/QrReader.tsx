import { useEffect, useRef, useState } from "react";
// Qr Scanner
import "../app/QrStyles.css"
import QrScanner from "qr-scanner";
import QrFrame from "../../assets/img/qr-frame.svg";
import Image from "next/image";
import { useRouter } from 'next/router';
import axios from "axios";

//@ts-ignore
const QrReader = ({ apiData, setApiData }) => {
  // QR StatesDetails
  const scanner = useRef<QrScanner>();
  const videoEl = useRef<HTMLVideoElement>(null);
  const qrBoxEl = useRef<HTMLDivElement>(null);
  const [qrOn, setQrOn] = useState<boolean>(true);

  const router = useRouter();

  // Result
  const [scannedResult, setScannedResult] = useState<string | undefined>("");
  const [selected, setSelected] = useState("certification verification");
    const [startScan, setStartScan] = useState(true);
    const [loadingScan, setLoadingScan] = useState(false);
    const [data, setData] = useState("");
    const [loginError, setLoginError] = useState('');
    const [loginSuccess, setLoginSuccess] = useState('');
    const [show, setShow] = useState(false);

    const apiUrl = process.env.NEXT_PUBLIC_BASE_URL;

  // Success
  const onScanSuccess = async(result: QrScanner.ScanResult) => {
    // 🖨 Print the "result" to browser console.    
    // ✅ Handle success.
    // 😎 You can do whatever you want with the scanned result.
    let scanFailed = true; // Flag to track if the scan failed
    let scanResponse = "No URL found"
    setScannedResult(result?.data);
    const scannedUrl = result.data 
    console.log('scannedResult',scannedUrl);

    if (scannedUrl) {
        try {
          const url = scannedUrl;
          const paramValue = url.split('=')[1];
          console.log(paramValue);
            // First API call with QR Scanned data
           try{
            const qrScanResponse = await axios.post(`${apiUrl}/api/decode-qr-scan`, {
                receivedCode: url,
            }, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (qrScanResponse.status === 200) {
                const responseData = qrScanResponse.data;
                console.log("The response", responseData.data);
                console.log("The response", responseData?.details?.url);
                setApiData({
                  // @ts-ignore: Implicit any for children prop
                  Details: responseData?.Details,
                  message: responseData?.message
              });
                // window.location.href = responseData?.details?.url;
                scanFailed = false;
            }

           } catch (error:any) {
             console.log("Error", error.response.data);
             if(error.response.data.message === 'Certification has revoked') {
                router.push('/invalid-certificate');
             } else{
                router.push('/invalid-certificate')
            }

           }
            // console.log("scanResponse", qrScanResponse);
            //  {
            //     const responseData = qrScanResponse.data;
            //     if (responseData.message === "Invalid Certificate") {
            //         router.push('/invalid-certificate'); // Navigate to /invalid-certificate
            //     }
            //     scanFailed = true;
            //     setLoginError(responseData.message || "Unable to scan the QR. Please review and try again.");
            //     setShow(true);
            // }

            setData(scanResponse);
            setStartScan(false);
        } catch (error) {
            console.error("Error during API call:", error);
            scanFailed = true; // Set flag to true if the scan failed
        }
    }

  };

  // Fail
  const onScanFail = (err: string | Error) => {
    // 🖨 Print the "err" to browser console.
    console.log(err);
  };

  useEffect(() => {
    if (videoEl?.current && !scanner.current) {
      // 👉 Instantiate the QR Scanner
      scanner.current = new QrScanner(videoEl?.current, onScanSuccess, {
        onDecodeError: onScanFail,
        // 📷 This is the camera facing mode. In mobile devices, "environment" means back camera and "user" means front camera.
        preferredCamera: "environment",
        // 🖼 This will help us position our "QrFrame.svg" so that user can only scan when qr code is put in between our QrFrame.svg.
        highlightScanRegion: true,
        // 🔥 This will produce a yellow (default color) outline around the qr code that we scan, showing a proof that our qr-scanner is scanning that qr code.
        highlightCodeOutline: true,
        // 📦 A custom div which will pair with "highlightScanRegion" option above 👆. This gives us full control over our scan region.
        overlay: qrBoxEl?.current || undefined,
      });

      // 🚀 Start QR Scanner
      scanner?.current
        ?.start()
        .then(() => setQrOn(true))
        .catch((err: any) => {
          if (err) setQrOn(false);
        });
    }

    // 🧹 Clean up on unmount.
    // 🚨 This removes the QR Scanner from rendering and using camera when it is closed or removed from the UI.
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      if (!videoEl?.current) {
        scanner?.current?.stop();
      }
    };
  }, []);

  // ❌ If "camera" is not allowed in browser permissions, show an alert.
  useEffect(() => {
    if (!qrOn)
      alert(
        "Camera is blocked or not accessible. Please allow camera in your browser permissions and Reload."
      );
  }, [qrOn]);

  return (
    <>
    <div className="qr-reader">
      {/* QR */}
      <video ref={videoEl}></video>
      <div ref={qrBoxEl} className="qr-box">
        <Image
          src={QrFrame}
          alt="Qr Frame"
          width={256}
          height={256}
          className="qr-frame"
        />
      </div>

      {/* Show Data Result if scan is success */}
      {scannedResult && (
        <p
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 99999,
            color: "white",
          }}
        >
          Scanned Result: {scannedResult}
        </p>
      )}
    </div>
    </>
  );
};

export default QrReader;
