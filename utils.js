
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

    const probabilities = outputArray[0];
    if (!probabilities || probabilities.length === 0) return "No prediction";

    let maxProbability = -Infinity;
    let predictedIndex = -1;

    for (let i = 0; i < probabilities.length; i++) {
        if (probabilities[i] > maxProbability) {
            maxProbability = probabilities[i];
            predictedIndex = i;
        }
    }

    if (predictedIndex !== -1 && maxProbability > 0.5) {
        const label = (labels && labels[predictedIndex]) ? labels[predictedIndex] : `Unknown Class (Index: ${predictedIndex})`;
        const confidence = (maxProbability * 100).toFixed(2);
        console.log(`${label} (${confidence}%`);
        return `${label} (${confidence}%)`;
    }

    return "No object detected (Confidence too low)";
};
