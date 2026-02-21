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
export interface Report {
    id: string;
    timestamp: Time;
    listing_id: string;
    reporter: Principal;
    reason: string;
}
export interface MostTradedCategoryAnalytics {
    topItems: Array<[string, bigint]>;
    sales: bigint;
    category: string;
}
export interface SellerReview {
    reviews: Array<Review>;
    seller: Principal;
    listing_id: string;
}
export interface ListingImage {
    id: bigint;
    url: string;
    upload_status: string;
    blob?: ExternalBlob;
    name: string;
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
export interface PriceRange {
    max: number;
    min: number;
}
export interface SearchCriteria {
    offset?: bigint;
    priceRange?: PriceRange;
    limit?: bigint;
    searchTerm?: string;
    sortOption: ListingSortOption;
    category?: string;
    condition?: ProductCondition;
}
export interface SellWizardDraft {
    id: string;
    title: string;
    updated_at: Time;
    description: string;
    created_at: Time;
    meetup_locations: Array<LocationDetail>;
    defect_description?: string;
    category: string;
    campus: string;
    department: string;
    original_price?: number;
    price: number;
    hostel: string;
    condition: ProductCondition;
    images: Array<ListingImage>;
}
export interface Review {
    created_at: Time;
    comment: string;
    rating: bigint;
    reviewer: Principal;
}
export interface SellerTrustIndicators {
    verified_student: boolean;
    star_rating: number;
    reliability_score: number;
    transaction_count: bigint;
}
export interface LocationDetail {
    name: string;
    location_type: Variant_dorm_zone_building_meetupSpot;
    coordinates: [number, number];
}
export interface Listing {
    id: string;
    status: ListingStatus;
    title: string;
    updated_at: Time;
    trust_indicators: SellerTrustIndicators;
    description: string;
    created_at: Time;
    seller: Principal;
    meetup_locations: Array<LocationDetail>;
    defect_description?: string;
    category: string;
    campus: string;
    department: string;
    original_price?: number;
    price: number;
    hostel: string;
    condition: ProductCondition;
    images: Array<ListingImage>;
}
export interface InsightsAnalytics {
    mostPopularCategory?: string;
    mostTradedCategory?: MostTradedCategoryAnalytics;
}
export interface RecommendationRequest {
    recType: RecommendationType;
    user: Principal;
    limit: bigint;
    externalPrompt?: string;
    contextListing?: Listing;
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
export interface ProductReview {
    reviews: Array<Review>;
    seller: Principal;
    product_condition: ProductCondition;
    listing_id: string;
}
export interface UserProfile {
    principal: Principal;
    verified_student: boolean;
    onboarding_complete: boolean;
    star_rating: number;
    campus: string;
    reliability_score: number;
    department: string;
    hostel: string;
    transaction_count: bigint;
}
export enum ListingSortOption {
    none = "none",
    priceLowToHigh = "priceLowToHigh",
    distance = "distance",
    newestFirst = "newestFirst",
    relevance = "relevance",
    priceHighToLow = "priceHighToLow",
    conditionQuality = "conditionQuality",
    popularity = "popularity"
}
export enum ListingStatus {
    active = "active",
    sold = "sold",
    draft = "draft"
}
export enum ProductCondition {
    fair = "fair",
    good = "good",
    likeNew = "likeNew",
    wellUsed = "wellUsed"
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
export enum Variant_dorm_zone_building_meetupSpot {
    dorm = "dorm",
    zone = "zone",
    building = "building",
    meetupSpot = "meetupSpot"
}
export interface backendInterface {
    addListing(listing: Listing): Promise<void>;
    addMessage(threadId: string, message: Message): Promise<void>;
    addProductReview(listingId: string, seller: Principal, review: Review, productCondition: ProductCondition): Promise<void>;
    addSellerReview(listingId: string, seller: Principal, review: Review): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createChatThread(thread: ChatThread): Promise<void>;
    createReport(report: Report): Promise<void>;
    deleteDraft(draftId: string): Promise<void>;
    deleteListing(listingId: string): Promise<void>;
    deleteReport(reportId: string): Promise<void>;
    deleteReview(listingId: string, reviewIndex: bigint, isProductReview: boolean): Promise<void>;
    fetchRecommendations(request: RecommendationRequest): Promise<Array<Listing>>;
    filterAndSortListings(searchCriteria: SearchCriteria): Promise<Array<Listing>>;
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
    getProductReviews(listingId: string): Promise<ProductReview | null>;
    getReports(): Promise<Array<Report>>;
    getSavedListings(): Promise<Array<Listing>>;
    getSellerReviews(listingId: string): Promise<SellerReview | null>;
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
    updateReview(listingId: string, reviewIndex: bigint, updatedReview: Review, isProductReview: boolean): Promise<void>;
    updateTypingStatus(threadId: string, isTyping: boolean): Promise<void>;
}
