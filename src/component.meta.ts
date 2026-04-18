/**
 * @category Types
 **/
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

/**
 * @category Metadata
 * @enum
 */
export const Event = {
  CONNECTED: "connected",
  DISCONNECTED: "disconnected",
} as const;
/**
 * @category Metadata
 */
export type Event = (typeof Event)[keyof typeof Event];

/**
 * @category Types
 **/
export type Handler = (event: Event) => void;
