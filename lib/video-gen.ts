import { PredictionServiceClient, helpers } from '@google-cloud/aiplatform';

// Konfiguráció
const clientOptions = {
  apiEndpoint: 'us-central1-aiplatform.googleapis.com',
  keyFilename: './google-cloud-key.json', // A letöltött kulcsod
};

const predictionClient = new PredictionServiceClient(clientOptions);

export async function generateVideo(prompt: string) {
  const project = 'A-PROJEKTED-ID-JA'; // Pl: storyforge-12345
  const location = 'us-central1';
  const model = 'veo-3.1-fast-generate-001'; // A legújabb gyors modell

  const endpoint = `projects/${project}/locations/${location}/publishers/google/models/${model}`;

  // Veo 3.1 specifikus paraméterek
  const instance = {
    prompt: prompt,
  };
  const instanceValue = helpers.toValue(instance);

  const parameters = {
    sampleCount: 1,
    aspectRatio: "16:9", // Vagy "9:16" rövid videókhoz
    videoDurationSeconds: 5, // 5, 10 vagy 15 mp
    fps: 30,
  };
  const parametersValue = helpers.toValue(parameters);

  try {
    const [response] = await predictionClient.predict({
      endpoint,
      instances: [instanceValue!],
      parameters: parametersValue,
    });

    // A Veo egy Cloud Storage (GCS) linket ad vissza vagy Base64-et
    const videoData = response.predictions?.[0];
    return videoData;
  } catch (error) {
    console.error("Veo API Error:", error);
    throw error;
  }
}