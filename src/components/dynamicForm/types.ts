export interface Field {
  key: string;
  label: string;
  type?: "text" | "number" | "date" | "file";
  placeholder?: string;
}


export interface DynamicFormProps {
  fields: Field[];
  inputs: { [key: string]: any };
  onInputChange: (key: string, value: any) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  mapAddressHandler: (data: { address: string; coordinates: [number, number] }) => void;
  coordinates?: [number, number] | null;
  ReadOnly?: boolean; 
}
