import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export type Time = bigint;
export interface Listing {
    id: string;
    status: ListingStatus;
    title: string;
    updated_at: Time;
    description: string;
    created_at: Time;
    seller: Principal;
    category: string;
    campus: string;
    department: string;
    price: number;
    hostel: string;
    condition: string;
    images: Array<ListingImage>;
}
export interface Report {
    id: string;
    timestamp: Time;
    listing_id: string;
    reporter: Principal;
    reason: string;
}
export interface RecommendationResponse {
    recType: RecommendationType;
    source: RecommendationMode;
    listings: Array<Listing>;
}
export interface RecommendationRequest {
    recType: RecommendationType;
    user: Principal;
    limit: bigint;
    externalPrompt?: string;
    contextListing?: Listing;
}
export interface MostTradedCategoryAnalytics {
    topItems: Array<[string, bigint]>;
    sales: bigint;
    category: string;
}
export interface ListingImage {
    id: bigint;
    url: string;
    upload_status: string;
    blob?: ExternalBlob;
    name: string;
}
export type NotificationType = {
    __kind__: "listing_sold";
    listing_sold: {
        listing_id: string;
    };
} | {
    __kind__: "new_message";
    new_message: {
        listing_id: string;
    };
} | {
    __kind__: "price_change";
    price_change: {
        listing_id: string;
    };
} | {
    __kind__: "systemNotification";
    systemNotification: {
    };
};
export interface InsightsAnalytics {
    mostPopularCategory?: string;
    mostTradedCategory?: MostTradedCategoryAnalytics;
}
export interface ChatThread {
    id: string;
    is_blocked: boolean;
    is_muted: boolean;
    messages: Array<Message>;
    typing_buyer: boolean;
    seller: Principal;
    typing_seller: boolean;
    buyer: Principal;
    listing_id: string;
}
export interface SellWizardDraft {
    id: string;
    title: string;
    updated_at: Time;
    description: string;
    created_at: Time;
    category: string;
    campus: string;
    department: string;
    price: number;
    hostel: string;
    condition: string;
    images: Array<ListingImage>;
}
export interface Notification {
    id: string;
    is_read: boolean;
    user: Principal;
    timestamp: Time;
    notif_type: NotificationType;
}
export interface Message {
    id: string;
    content: string;
    sender: Principal;
    read_by_seller: boolean;
    read_by_buyer: boolean;
    timestamp: Time;
}
export interface UserProfile {
    principal: Principal;
    onboarding_complete: boolean;
    campus: string;
    department: string;
    hostel: string;
}
export enum ListingStatus {
    active = "active",
    sold = "sold",
    draft = "draft"
}
export enum RecommendationMode {
    heuristic = "heuristic",
    external = "external"
}
export enum RecommendationType {
    similarCategory = "similarCategory",
    trending = "trending",
    collaborative = "collaborative",
    personalized = "personalized"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addListing(listing: Listing): Promise<void>;
    addMessage(threadId: string, message: Message): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createChatThread(thread: ChatThread): Promise<void>;
    createReport(report: Report): Promise<void>;
    deleteDraft(draftId: string): Promise<void>;
    deleteListing(listingId: string): Promise<void>;
    deleteReport(reportId: string): Promise<void>;
    fetchRecommendations(request: RecommendationRequest): Promise<RecommendationResponse>;
    getAIRecommendationMode(): Promise<RecommendationMode>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getChatThread(threadId: string): Promise<ChatThread | null>;
    getChatThreads(): Promise<Array<ChatThread>>;
    getDraft(draftId: string): Promise<SellWizardDraft | null>;
    getDrafts(): Promise<Array<SellWizardDraft>>;
    getInsightsAnalytics(): Promise<InsightsAnalytics>;
    getListing(listingId: string): Promise<Listing | null>;
    getListings(): Promise<Array<Listing>>;
    getListingsBySeller(seller: Principal): Promise<Array<Listing>>;
    getNotifications(): Promise<Array<Notification>>;
    getPersistentStorageCount(): Promise<bigint>;
    getReports(): Promise<Array<Report>>;
    getSavedListings(): Promise<Array<Listing>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isAIAssistEnabled(): Promise<boolean>;
    isAIFeatureEnabled(): Promise<boolean>;
    isCallerAdmin(): Promise<boolean>;
    markNotificationAsRead(notificationId: string): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    saveDraft(draft: SellWizardDraft): Promise<void>;
    saveListing(listingId: string): Promise<void>;
    searchListings(searchTerm: string): Promise<Array<Listing>>;
    setAIFeatureEnabled(enabled: boolean): Promise<void>;
    setRecommendationMode(mode: RecommendationMode): Promise<void>;
    unsaveListing(listingId: string): Promise<void>;
    updateListing(listingId: string, updatedListing: Listing): Promise<void>;
    updateTypingStatus(threadId: string, isTyping: boolean): Promise<void>;
}
