export const Event = {
  CONNECTED: "connected",
  DISCONNECTED: "disconnected",
} as const;

export type Configuration = {
  url: string;
  template?: {
    id: string;
  };
  css?: {
    name: string;
  };
  events?: {};
};

export type Handler = (event: Event) => void;
