import Map "mo:core/Map";
import Nat "mo:core/Nat";
import List "mo:core/List";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Nat32 "mo:core/Nat32";
import Storage "blob-storage/Storage";

module {
  type ProductCondition = { #likeNew; #good; #fair; #wellUsed };
  type ListingStatus = { #active; #sold; #draft };
  type NotificationType = {
    #new_message : { listing_id : Text };
    #listing_sold : { listing_id : Text };
    #price_change : { listing_id : Text };
    #systemNotification : {};
  };

  type ListingImage = {
    id : Nat;
    name : Text;
    url : Text;
    upload_status : Text;
    blob : ?Storage.ExternalBlob;
  };

  type LocationDetail = {
    location_type : { #dorm; #building; #zone; #meetupSpot };
    name : Text;
    coordinates : (Float, Float);
  };

  type SellerTrustIndicators = {
    verified_student : Bool;
    star_rating : Float;
    transaction_count : Nat;
    reliability_score : Float;
  };

  type Message = {
    id : Text;
    sender : Principal.Principal;
    content : Text;
    timestamp : Time.Time;
    read_by_buyer : Bool;
    read_by_seller : Bool;
  };

  type ChatThread = {
    id : Text;
    listing_id : Text;
    buyer : Principal.Principal;
    seller : Principal.Principal;
    messages : [Message];
    is_muted : Bool;
    is_blocked : Bool;
    typing_buyer : Bool;
    typing_seller : Bool;
  };

  type Notification = {
    id : Text;
    user : Principal.Principal;
    notif_type : NotificationType;
    is_read : Bool;
    timestamp : Time.Time;
  };

  type Report = {
    id : Text;
    reporter : Principal.Principal;
    listing_id : Text;
    reason : Text;
    timestamp : Time.Time;
  };

  type SellWizardDraft = {
    id : Text;
    title : Text;
    description : Text;
    price : Nat32;
    original_price : ?Nat32;
    condition : ProductCondition;
    category : Text;
    department : Text;
    hostel : Text;
    campus : Text;
    meetup_locations : [LocationDetail];
    images : [ListingImage];
    created_at : Time.Time;
    updated_at : Time.Time;
    defect_description : ?Text;
  };

  type UserProfile = {
    principal : Principal.Principal;
    department : Text;
    hostel : Text;
    campus : Text;
    onboarding_complete : Bool;
    verified_student : Bool;
    star_rating : Float;
    transaction_count : Nat;
    reliability_score : Float;
  };

  type Review = {
    reviewer : Principal.Principal;
    rating : Nat;
    comment : Text;
    created_at : Time.Time;
  };

  type SellerReview = {
    listing_id : Text;
    seller : Principal.Principal;
    reviews : [Review];
  };

  type ProductReview = {
    listing_id : Text;
    seller : Principal.Principal;
    reviews : [Review];
    product_condition : ProductCondition;
  };

  // Listing record type
  type Listing = {
    id : Text;
    title : Text;
    description : Text;
    price : Nat32;
    original_price : ?Nat32;
    condition : ProductCondition;
    category : Text;
    status : ListingStatus;
    seller : Principal.Principal;
    department : Text;
    hostel : Text;
    campus : Text;
    meetup_locations : [LocationDetail];
    images : [ListingImage];
    created_at : Time.Time;
    updated_at : Time.Time;
    defect_description : ?Text;
    trust_indicators : SellerTrustIndicators;
  };

  type OldActor = {
    users : Map.Map<Principal.Principal, UserProfile>;
    finalizedListings : Map.Map<Text, Listing>;
    savedListings : Map.Map<Principal.Principal, Map.Map<Text, ()>>;
    chatThreads : Map.Map<Text, ChatThread>;
    notifications : Map.Map<Text, Notification>;
    finishedReports : Map.Map<Text, Report>;
    sellWizardDrafts : Map.Map<Principal.Principal, List.List<SellWizardDraft>>;

    persistentStorageCount : Nat;
    finalizedListingsCount : Nat;
    newToExistingStorageCountMap : Map.Map<Text, Nat>;
    persistentStorageIdCounter : Nat;
    aiAssistEnabled : ?Bool;
  };

  type NewActor = {
    users : Map.Map<Principal.Principal, UserProfile>;
    finalizedListings : Map.Map<Text, Listing>;
    savedListings : Map.Map<Principal.Principal, Map.Map<Text, ()>>;
    chatThreads : Map.Map<Text, ChatThread>;
    notifications : Map.Map<Text, Notification>;
    finishedReports : Map.Map<Text, Report>;
    sellWizardDrafts : Map.Map<Principal.Principal, List.List<SellWizardDraft>>;
    persistentStorageCount : Nat;
    finalizedListingsCount : Nat;
    newToExistingStorageCountMap : Map.Map<Text, Nat>;
    persistentStorageIdCounter : Nat;
    aiAssistEnabled : ?Bool;
    sellerReviews : Map.Map<Text, SellerReview>;
    productReviews : Map.Map<Text, ProductReview>;
  };

  public func run(old : OldActor) : NewActor {
    {
      old with
      sellerReviews = Map.empty<Text, SellerReview>();
      productReviews = Map.empty<Text, ProductReview>();
    };
  };
};
