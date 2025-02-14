export interface Field {
  key: string;
  label: string;
  type?: "text" | "number" | "date";
  placeholder?: string;
}


export interface DynamicFormProps {
  fields: Field[];
  inputs: { [key: string]: string };
  onInputChange: (key: string, value: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  mapAddressHandler: (data: { address: string; coordinates: [number, number] }) => void;
  ReadOnly?: boolean; 
}
