export type HealthStatus = 'saudavel' | 'atencao' | 'doente' | 'critico' | 'nao_aplicavel';

export interface DiagnosisExtras {
  // Confianca da identificacao da especie (0 a 1).
  confidence: number;
  // Estado de saude visual da planta.
  healthStatus: HealthStatus;
  // Avaliacao da foto: quanto a luz da foto (nao da planta) ajudou no diagnostico.
  lightQuality: { percent: number; verdict: string };
  // Problemas visiveis detectados, pode ser vazio se a planta esta saudavel.
  detectedProblems: Array<{ description: string; severity: string; cause: string }>;
  // Texto longo do plano de tratamento (alem da timeline curta).
  treatmentPlan: string;
  // Indica se precisa nova consulta apos N dias.
  needsFollowup: { required: boolean; message: string };
}

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
  // Campos adicionais do schema completo do backend, populados quando o
  // PlantDoctor for renderizado em variante "full" (rota /doutor).
  extras?: DiagnosisExtras;
}

export interface DiagnosisErrorResponse {
  error: string;
}

export interface DiagnosisNotPlantResponse {
  notPlant: true;
  message: string;
}

export type DiagnosisResponse = Diagnosis | DiagnosisErrorResponse | DiagnosisNotPlantResponse;
