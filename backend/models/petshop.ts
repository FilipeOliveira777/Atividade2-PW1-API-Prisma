export interface Pet {
    id: string;
    name: string;
    type: string;
    description: string;
    vaccinated: boolean;
    deadline_vaccination: Date;
    created_at: Date;
  }
  
  export interface Petshop {
    id: string;
    name: string;
    cnpj: string;
    pets: Pet[];
  }