type ReportHandler = (metric: unknown) => void;

const reportWebVitals = (onPerfEntry?: ReportHandler) => {
  if (onPerfEntry && typeof onPerfEntry === "function") {
    import("web-vitals").then(({ onCLS, onINP, onFCP, onLCP, onTTFB }) => {
      onCLS(onPerfEntry as never);
      onINP(onPerfEntry as never);
      onFCP(onPerfEntry as never);
      onLCP(onPerfEntry as never);
      onTTFB(onPerfEntry as never);
    });
  }
};

export default reportWebVitals;
