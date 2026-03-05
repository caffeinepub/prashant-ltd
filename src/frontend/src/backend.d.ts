import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface ContactMessage {
    name: string;
    email: string;
    message: string;
    timestamp: Time;
}
export type Time = bigint;
export interface backendInterface {
    addContactMessage(name: string, email: string, message: string): Promise<void>;
    getAllMessages(): Promise<Array<ContactMessage>>;
    getAllMessagesByEmail(): Promise<Array<ContactMessage>>;
    getMessage(timestamp: Time): Promise<ContactMessage>;
}
