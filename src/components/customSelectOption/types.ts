export interface CustomSelectOptionProps {
    label?: string;
    underlabel?: string;
    error?: string;
    options: Option[];
    value: string;
    onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    borderColor?: string;
    placeholder?: string;
    textColor?: string;
  }
  interface Option {
    label: string;
    value: string;
  }