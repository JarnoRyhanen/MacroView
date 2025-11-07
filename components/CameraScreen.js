import { useAppState } from '@react-native-community/hooks';
import { useIsFocused } from '@react-navigation/native';
import { useEffect, useRef, useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { useTensorflowModel } from 'react-native-fast-tflite';
import { Camera, runAtTargetFps, useCameraDevice, useCameraPermission, useFrameProcessor } from 'react-native-vision-camera';
import { useResizePlugin } from 'vision-camera-resize-plugin';
import { getBestPrediction, loadLabels } from "../utils"
import { useRunOnJS } from 'react-native-worklets-core';
export default function CameraScreen() {

  const [labels, setLabels] = useState([]);
  const [result, setResult] = useState("Initializing...");
  const { hasPermission, requestPermission } = useCameraPermission()
  const device = useCameraDevice('back')
  const camera = useRef(null);
  const isFocused = useIsFocused();
  const appState = useAppState();
  const isActive = isFocused && appState === "active"
  const { resize } = useResizePlugin();

  const objectDetection = useTensorflowModel(require('../assets/mobilenet.tflite'))
  const model =
    objectDetection.state === 'loaded' ? objectDetection.model : undefined

  const calculateResult = useRunOnJS((outputs) => {
    const result = getBestPrediction(outputs[0], labels);
    console.log(result);
    setResult(result);
  });

  const frameProcessor = useFrameProcessor(
    (frame) => {
      'worklet'

      runAtTargetFps(3, () => {
        'worklet'
        console.log("I'm running synchronously at 3 FPS!")
        if (model == null) return

        const resized = resize(frame, {
          scale: {
            width: 224,
            height: 224,
          },
          pixelFormat: 'rgb',
          dataType: 'float32',
        });

        const outputs = model.runSync([resized]);
        calculateResult(outputs);
      });
    },
    [model]
  )
  useEffect(() => {
    setLabels(loadLabels);
    if (!hasPermission) {
      requestPermission();
    }
  }, [hasPermission, requestPermission]);

  if (!hasPermission) {
    return <Text>Grant camera access to use the camera</Text>
  }

  const scan = () => {
    console.log("Scanned");
  }

  return (
    <View style={styles.container}>
      {device && (
        <Camera
          ref={camera}
          style={StyleSheet.absoluteFill}
          device={device}
          isActive={isActive}
          frameProcessor={frameProcessor}
          enableFpsGraph={true}
        />
      )}

      <View style={styles.bottom}>
        <View style={styles.buttonWrapper}>
          <Button
            title={result}
            onPress={() => scan()} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  bottom: {
    position: 'absolute',
    left: 20,
    right: 20,
    bottom: 30,
    alignItems: 'center',
  },
  buttonWrapper: {
    width: '100%',
  },
});

