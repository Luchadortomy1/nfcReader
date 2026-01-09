// types/navigation.ts
export type RootStackParamList = {
  Home: undefined;
  RegisterCard: undefined;
  ScanCard: undefined;
  Result: {
    type: 'success' | 'error' | 'not_found';
    employee?: {
      nombre: string;
      ocupacion: string;
      uid: string;
    };
    message: string;
  };
};