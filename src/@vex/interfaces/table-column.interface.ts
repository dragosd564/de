export interface TableColumn<T> {
  label: string;
  property: string;
  type: 'text' | 'image' | 'badge' | 'progress' | 'checkbox' | 'button' | 'permisos' | 'boolean';
  visible?: boolean;
  cssClasses?: string[];
}
