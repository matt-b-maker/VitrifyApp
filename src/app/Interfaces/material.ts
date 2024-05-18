export interface Material {
  "Name": string;
  "Oxides": Array<{
    "OxideName": string;
    "Analysis": number;
  }>;
  "OxidesWeight": number;
  "Description": string;
}
