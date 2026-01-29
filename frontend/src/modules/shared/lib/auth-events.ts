type AuthEventHandler = () => void;

const unauthorizedHandlers = new Set<AuthEventHandler>();

export const authEvents = {
  onUnauthorized(handler: AuthEventHandler) {
    unauthorizedHandlers.add(handler);
    return () => unauthorizedHandlers.delete(handler);
  },
  emitUnauthorized() {
    unauthorizedHandlers.forEach((handler) => handler());
  },
};
