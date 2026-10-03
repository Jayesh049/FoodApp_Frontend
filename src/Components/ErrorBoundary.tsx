import React, { type ErrorInfo, type ReactNode } from "react";
import { reportClientError } from "../utils/sentry";

type Props = { children?: ReactNode };
type State = { hasError: boolean; error: Error | null };

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, _info: ErrorInfo) {
    reportClientError(error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            padding: "20px",
            textAlign: "center",
            background: "#1a1a1a",
            color: "white",
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <h2>Something went wrong.</h2>
          <p>Please refresh the page or try again later.</p>
          {this.state.error && (
            <p
              style={{
                fontSize: "12px",
                color: "#DCCA87",
                marginTop: "12px",
                maxWidth: "90%",
              }}
            >
              {this.state.error.toString()}
            </p>
          )}
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: "10px 20px",
              background: "#3b82f6",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              marginTop: "10px",
            }}
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
