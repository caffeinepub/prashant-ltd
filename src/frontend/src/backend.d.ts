import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface ChatMessage {
    content: string;
    role: string;
    timestamp: Time;
}
export interface ContactMessage {
    name: string;
    email: string;
    message: string;
    timestamp: Time;
}
export type Time = bigint;
export interface UserStats {
    accountStatus: boolean;
    totalMessages: bigint;
    joinedDate: Time;
}
export interface UserProfile {
    id: string;
    displayName: string;
    isActive: boolean;
    joinedDate: Time;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addContactMessage(name: string, email: string, message: string): Promise<void>;
    addUserProfile(id: string, displayName: string): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getAllMessages(): Promise<Array<ContactMessage>>;
    getAllMessagesByEmail(): Promise<Array<ContactMessage>>;
    getAllUserProfile(): Promise<Array<UserProfile>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getChatHistory(): Promise<Array<ChatMessage> | null>;
    getCustomUserStats(userId: Principal): Promise<{
        accountStatus: boolean;
        totalMessages: bigint;
        joinedDate: Time;
    }>;
    getDefaultUserStats(): Promise<UserStats>;
    getUserChatHistory(userId: Principal): Promise<Array<ChatMessage> | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getUserStats(): Promise<UserStats | null>;
    hasContactMessage(timestamp: Time): Promise<boolean>;
    hasUserProfile(): Promise<boolean>;
    hideContactMessage(timestamp: Time): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    sendMessage(content: string): Promise<ChatMessage>;
    updateAccountStatus(isActive: boolean): Promise<void>;
}
