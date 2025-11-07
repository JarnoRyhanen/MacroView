
import labels from "./assets/imagenet_labels.json";
export const loadLabels = () => {
    try {
        if (!Array.isArray(labels)) {
            console.error("Labels file is not a valid JSON array");
            return [];
        }
        console.log(`Loaded labels from imagenet_labels.json`);

        return labels;
    } catch (error) {
        console.error("Failed to load imagenet_labels.json:", error);
        return [];
    }
};

export const getBestPrediction = (outputArray, labels) => {
    'worklet'
    
    if (!outputArray || outputArray.length === 0) return "No prediction";

    let maxProbability = 0;
    let predictedIndex = -1;

    for (let i = 0; i < 1000; i++) {
        if (outputArray[i] > maxProbability) {
            maxProbability = outputArray[i];
            predictedIndex = i;
        }
    }
    console.log("Max probability: " + maxProbability);
    console.log("Predicted index: " + predictedIndex);
    console.log("predicted label: " + labels[0][predictedIndex])

    if (predictedIndex !== -1 && maxProbability > 0.5) {
        const label = (labels[0] && labels[0][predictedIndex]) ? labels[0][predictedIndex] : `Unknown Class (Index: ${predictedIndex})`;
        const confidence = (maxProbability * 100).toFixed(2);
        console.log(`${label} (${confidence}%)`);
        return `${label} (${confidence}%)`;
    }

    return "No object detected (Confidence too low)";
};
