export interface Field {
  key: string;
  label: string;
}

export interface PreviewProps {
  fields: Field[];
  inputs: {
    [key: string]: string;
  };
  onEdit: () => void;
  onSave: () => void;
}
