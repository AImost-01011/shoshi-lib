import jsQR from "jsqr";
import { Point } from "jsqr/dist/locator";
import React, { useState, useEffect, useRef } from "react";
import st from "./qrReader.module.scss";

const QrReader: React.FC<{ onScan: (data: string) => void }> = ({ onScan }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    let intervalId: NodeJS.Timer;
    let streamTracks: MediaStreamTrack[] = [];

    if (canvasRef.current && videoRef.current) {
      const userMedia: MediaStreamConstraints = {
        video: { facingMode: "environment" },
      };
      const ctx = canvasRef.current.getContext("2d", {
        willReadFrequently: true,
      });

      navigator.mediaDevices.getUserMedia(userMedia).then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current
            .play()
            .then(() => {})
            .catch((err) => console.log(err));

          startTick();

          streamTracks = stream.getTracks();
        }
      });

      const drawRect = (location: {
        topRightCorner: Point;
        topLeftCorner: Point;
        bottomRightCorner: Point;
        bottomLeftCorner: Point;
        topRightFinderPattern: Point;
        topLeftFinderPattern: Point;
        bottomLeftFinderPattern: Point;
        bottomRightAlignmentPattern?: Point | undefined;
      }) => {
        drawLine(location.topLeftCorner, location.topRightCorner);
        drawLine(location.topRightCorner, location.bottomRightCorner);
        drawLine(location.bottomRightCorner, location.bottomLeftCorner);
        drawLine(location.bottomLeftCorner, location.topLeftCorner);
      };

      const drawLine = (begin: Point, end: Point) => {
        if (ctx) {
          ctx.lineWidth = 4;
          ctx.strokeStyle = "#FF3B58";
          ctx.beginPath();
          ctx.moveTo(begin.x, begin.y);
          ctx.lineTo(end.x, end.y);
          ctx.stroke();
        }
      };

      const startTick = () => {
        if (canvasRef.current && videoRef.current) {
          if (
            videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA
          ) {
            canvasRef.current.height = videoRef.current.videoHeight;
            canvasRef.current.width = videoRef.current.videoWidth;

            ctx?.drawImage(
              videoRef.current,
              0,
              0,
              canvasRef.current.width,
              canvasRef.current.height
            );

            let img = ctx?.getImageData(
              0,
              0,
              canvasRef.current.width,
              canvasRef.current.height
            );

            if (img) {
              let code = jsQR(img.data, img.width, img.height, {
                inversionAttempts: "dontInvert",
              });

              if (code) {
                drawRect(code.location);
                onScan(code.data);
              }
            }
          }
        }
      };

      intervalId = setInterval(startTick, 100);
    }

    return () => {
      clearInterval(intervalId);
      if (streamTracks.length) {
        streamTracks[0].stop();
      }
    };
  }, [onScan]);

  return (
    <div className={st.qrReader}>
      <canvas className={st.cameraDisplay} ref={canvasRef} />
      <video ref={videoRef} playsInline={true} style={{ display: "none" }} />
    </div>
  );
};

export default QrReader;
