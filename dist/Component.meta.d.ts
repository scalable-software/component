export declare const Event: {
    readonly CONNECTED: "connected";
    readonly DISCONNECTED: "disconnected";
};
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
