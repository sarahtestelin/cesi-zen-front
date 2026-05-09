export interface Resource {
  id: string;
  ressourceIsActive: boolean;
  ressourceIsUsed: boolean;
  title: string;
  description: string;
  status: string | null;
  category: string;
  createdAt: string;
  updatedAt: string;
  version: number;
}
