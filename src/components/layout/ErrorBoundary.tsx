import React from 'react';

interface State { hasError: boolean }

export class ErrorBoundary extends React.Component<React.PropsWithChildren, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <div className="mx-auto mt-10 max-w-xl rounded bg-red-50 p-4 text-red-700">Something went wrong. Please refresh and try again.</div>;
    }
    return this.props.children;
  }
}
