export type CustomInputProps = {
  label?: string;
  error?: string;
  underlabel?: string;
  placeholder?: string;
  name?: string;
  borderColor?: string; 
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  type?: "text" | "password" | "email" | "number" | "date";
  onUnderlabelClick?: () => void;
  readOnly?: boolean;
};
