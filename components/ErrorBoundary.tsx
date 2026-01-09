// ErrorBoundary.tsx - Captura errores sin mostrarlos en pantalla
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): State {
    // Actualizar el state para mostrar la UI de error
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Solo loguear el error, no mostrarlo en pantalla
    console.error('🚨 Error capturado por ErrorBoundary:', error);
    console.error('📋 Info del error:', errorInfo);
    
    // Reset del error después de 2 segundos
    setTimeout(() => {
      this.setState({ hasError: false });
    }, 2000);
  }

  render() {
    if (this.state.hasError) {
      // Retornar los children normalmente (sin mostrar error)
      return this.props.children;
    }

    return this.props.children;
  }
}