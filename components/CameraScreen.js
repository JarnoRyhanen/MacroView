import { useEffect } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { Camera, useCameraDevice, useCameraPermission } from 'react-native-vision-camera';

export default function CameraScreen() {

  const { hasPermission, requestPermission } = useCameraPermission()
  const device = useCameraDevice('back')

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
          style={StyleSheet.absoluteFill}
          device={device}
          isActive={true}
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

