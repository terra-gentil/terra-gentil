export interface Diagnosis {
  plantName: string;
  scientificName: string;
  welcomeMessage: string;
  toxicity: {
    isToxic: boolean;
    details: string;
  };
  diagnosis: {
    problem: string;
    description: string;
  };
  stats: {
    light: string;
    watering: string;
    temperature: string;
    difficulty: string;
  };
  treatment: Array<{
    period: string;
    action: string;
  }>;
}

export interface DiagnosisErrorResponse {
  error: string;
}

export type DiagnosisResponse = Diagnosis | DiagnosisErrorResponse;
