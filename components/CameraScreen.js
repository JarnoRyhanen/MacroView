import { StyleSheet, Text, View, Button, Image } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useRef, useState } from 'react';


export default function CameraScreen() {
    const [photoName, setPhotoName] = useState('');
    const [photoBase64, setPhotoBase64] = useState('');
    const [permission, requestPermission] = useCameraPermissions();
    const camera = useRef(null);


    if (!permission) {
        return <View />;
    }

    if (!permission.granted) {
        return (
            <View style={styles.container}>
                <Button onPress={requestPermission} title="grant permission" />
            </View>
        );
    }
    const snap = async () => {
        if (camera) {
            const photo = await camera.current.takePictureAsync({ base64: true });
            setPhotoName(photo.uri);
            setPhotoBase64(photo.base64);
        }
    };

    return (
        <View style={{ flex: 1 }}>
            <CameraView style={{ flex: 1, minWidth: "100%" }} ref={camera} />
            <Button title="Take Photo" onPress={snap} />
            <View style={{ flex: 1 }}>
                {photoName && photoBase64 ? (
                    <>
                        <Image style={{ flex: 1 }} source={{ uri: photoName }} />
                        {/*    <Image style={{ flex: 1 }} source={{ uri: `data:image/jpg;base64,${photoBase64}` }} /> */}
                    </>
                ) : (
                    <Text>No photo taken yet.</Text>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

