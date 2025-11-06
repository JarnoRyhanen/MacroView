import { useAppState } from '@react-native-community/hooks';
import { useIsFocused } from '@react-navigation/native';
import { useEffect, useRef, useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { Camera, useCameraDevice, useCameraPermission, useFrameProcessor } from 'react-native-vision-camera';
import { useImageLabeler } from 'react-native-vision-camera-v3-image-labeling';

export default function CameraScreen() {

  const { hasPermission, requestPermission } = useCameraPermission()
  const device = useCameraDevice('back')
  const camera = useRef(null);
  const isFocused = useIsFocused();
  const appState = useAppState();
  const isActive = isFocused && appState === "active"

  const options = { minConfidence: 0.8 };
  const { scanImage } = useImageLabeler(options);

  const frameProcessor = useFrameProcessor((frame) => {
    'worklet'
    const data = scanImage(frame);
    console.log(data[0]);
  }, []);

  useEffect(() => {
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
        />
      )}

      <View style={styles.bottom}>
        <View style={styles.buttonWrapper}>
          <Button
            title='Scan'
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

