import React, { useEffect, useRef, useState } from 'react';
import { drawImage, drawRGBImage, initSaliencyGLContext, initYUVYGLContext, padYUV } from '../webgl/canvasUtils';
import { bytesToBase64 } from 'byte-base64';
import { CameraFrame, CameraInstance } from '../common/models/cameraFrame';

export enum VideoViewType {
  camera = 'camera',
  cameraJPEG = 'cameraJPEG',
  salience = 'salience',
}

interface VideoViewProps {
  type: VideoViewType;
  image: Uint8Array;
  camera: CameraInstance;
}

let gl: WebGLRenderingContext | null;

const CameraView = ({ type, image, camera }: VideoViewProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvas2DRef = useRef<HTMLCanvasElement>(null);
  const canvasGL = useRef<WebGLRenderingContext>(null);
  let width: number;
  let height: number;
  switch (true) {
    case camera === CameraInstance.top && type === VideoViewType.salience:
      width = CameraFrame.topSaliencyWidth;
      height = CameraFrame.topSaliencyHeight;
      break;
    case camera === CameraInstance.top && [VideoViewType.camera, VideoViewType.cameraJPEG].includes(type):
      width = CameraFrame.topCameraWidth;
      height = CameraFrame.topCameraHeight;
      break;
    case camera === CameraInstance.bottom && type === VideoViewType.salience:
      width = CameraFrame.bottomSaliencyWidth;
      height = CameraFrame.bottomSaliencyHeight;
      break;
    case camera === CameraInstance.bottom && [VideoViewType.camera, VideoViewType.cameraJPEG].includes(type):
      width = CameraFrame.bottomCameraWidth;
      height = CameraFrame.bottomCameraHeight;
      break;
    default:
      throw new Error(`Unknown combination of [${camera}, ${type}]`);
  }
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      switch (type) {
        case VideoViewType.camera: {
          initYUVYGLContext(canvas);
          break;
        }
        case VideoViewType.salience: {
          initSaliencyGLContext(canvas);
          break;
        }
        case VideoViewType.cameraJPEG: {
          // no initialisation needed
          break;
        }
        default: {
          throw new Error(`Unknown video frame type [${type}]`);
        }
      }
    }
    return function cleanup() {};
  }, [type, camera]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const canvas2D = canvas2DRef.current;
    if (canvas) {
      gl = canvas.getContext('webgl');
    }
    switch (type) {
      case VideoViewType.camera: {
        if (gl) {
          drawImage(gl, padYUV(image), width, height);
        }
        break;
      }
      case VideoViewType.cameraJPEG: {
        const ctx = canvas2D?.getContext('2d');
        if (ctx) {
          ctx.imageSmoothingEnabled = false;
          const dataUrl = 'data:image/jpeg;base64,' + bytesToBase64(image);
          const imageBitmap = new Image();
          imageBitmap.src = dataUrl;
          ctx?.drawImage(imageBitmap, 0, 0);
        }
        // drawImage(gl, padYUV(image), width, height);
        break;
      }
      case VideoViewType.salience: {
        if (gl) {
          drawRGBImage(gl, image, width, height);
        }
        break;
      }
      default: {
        throw new Error(`Unknown video frame type [${type}]`);
      }
    }
  }, [type, width, height, image]);
  let ratio: number;
  switch (type) {
    case VideoViewType.camera:
    case VideoViewType.cameraJPEG:
      ratio = 2;
      if (camera === CameraInstance.bottom) {
        ratio = ratio / 2;
      }
      break;
    case VideoViewType.salience:
      ratio = 1 / 2;
      if (camera === CameraInstance.bottom) {
        ratio = ratio / 4;
      }
      break;
    default:
      throw new Error(`Unknown view type [${type}]`);
  }

  return type === VideoViewType.cameraJPEG ? (
    <canvas
      ref={canvas2DRef}
      width={width}
      height={height}
      style={{
        width: '100%',
      }}
    />
  ) : (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{
        width: '100%',
      }}
    />
  );
};

export default CameraView;
