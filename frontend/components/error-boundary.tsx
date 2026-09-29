"use client";

import { Component, ReactNode } from "react";

type Props = {
  children: ReactNode;
  fallback?: ReactNode;
};

type State = {
  hasError: boolean;
  error: Error | null;
};

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="flex min-h-[50vh] flex-col items-center justify-center px-4">
            <h2 className="font-display text-2xl">Something went wrong</h2>
            <p className="mt-2 text-muted">Please refresh the page or try again later.</p>
            <button
              type="button"
              onClick={() => this.setState({ hasError: false, error: null })}
              className="btn btn-primary mt-4"
            >
              Try again
            </button>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
