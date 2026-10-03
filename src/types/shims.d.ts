declare module "react-checkmark";

interface Window {
  Razorpay?: new (options: Record<string, unknown>) => {
    open: () => void;
    on: (event: string, handler: (...args: any[]) => void) => void;
  };
}
