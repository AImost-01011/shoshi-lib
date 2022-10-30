import React from "react";
import st from "./qrScanner.module.scss";
import dynamic from "next/dynamic";
const QrReader = dynamic(() => import("react-qr-reader"), { ssr: false });

const QrScanner: React.FC<{
  isActive: boolean;
  onScan: (data: string | null) => Promise<void>;
}> = ({ isActive, onScan }) => {
  return (
    <div className={st.qrScanner}>
      {isActive ? (
        <div className={st.scannerContainer}>
          <QrReader
            onScan={onScan}
            onError={(err) => console.log(err)}
            showViewFinder={false}
            facingMode="environment"
          />
        </div>
      ) : (
        <div className={st.blancContainer} />
      )}
    </div>
  );
};

export default QrScanner;
