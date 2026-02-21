import List "mo:core/List";
import Map "mo:core/Map";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Array "mo:core/Array";
import Nat32 "mo:core/Nat32";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import Migration "migration";

(with migration = Migration.run)
actor {
  include MixinStorage();

  type MyOrder = {
    #less;
    #greater;
    #equal;
  };

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type ListingStatus = {
    #active;
    #sold;
    #draft;
  };

  public type ProductCondition = {
    #likeNew;
    #good;
    #fair;
    #wellUsed;
  };

  public type PriceRange = {
    min : Nat32;
    max : Nat32;
  };

  public type ListingImage = {
    id : Nat;
    name : Text;
    url : Text;
    upload_status : Text;
    blob : ?Storage.ExternalBlob; // file reference
  };

  public type LocationDetail = {
    location_type : { #dorm; #building; #zone; #meetupSpot };
    name : Text;
    coordinates : (Float, Float);
  };

  public type SellerTrustIndicators = {
    verified_student : Bool;
    star_rating : Float;
    transaction_count : Nat;
    reliability_score : Float;
  };

  public type Listing = {
    id : Text;
    title : Text;
    description : Text;
    price : Nat32;
    original_price : ?Nat32;
    condition : ProductCondition;
    category : Text;
    status : ListingStatus;
    seller : Principal;
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

  public type UserProfile = {
    principal : Principal;
    department : Text;
    hostel : Text;
    campus : Text;
    onboarding_complete : Bool;
    verified_student : Bool;
    star_rating : Float;
    transaction_count : Nat;
    reliability_score : Float;
  };

  public type Message = {
    id : Text;
    sender : Principal;
    content : Text;
    timestamp : Time.Time;
    read_by_buyer : Bool;
    read_by_seller : Bool;
  };

  public type ChatThread = {
    id : Text;
    listing_id : Text;
    buyer : Principal;
    seller : Principal;
    messages : [Message];
    is_muted : Bool;
    is_blocked : Bool;
    typing_buyer : Bool;
    typing_seller : Bool;
  };

  public type NotificationType = {
    #new_message : { listing_id : Text };
    #listing_sold : { listing_id : Text };
    #price_change : { listing_id : Text };
    #systemNotification : {};
  };

  public type Notification = {
    id : Text;
    user : Principal;
    notif_type : NotificationType;
    is_read : Bool;
    timestamp : Time.Time;
  };

  public type Report = {
    id : Text;
    reporter : Principal;
    listing_id : Text;
    reason : Text;
    timestamp : Time.Time;
  };

  public type SellWizardDraft = {
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

  public type Review = {
    reviewer : Principal;
    rating : Nat;
    comment : Text;
    created_at : Time.Time;
  };

  public type SellerReview = {
    listing_id : Text;
    seller : Principal;
    reviews : [Review];
  };

  public type ProductReview = {
    listing_id : Text;
    seller : Principal;
    reviews : [Review];
    product_condition : ProductCondition;
  };

  public type Review1 = {
    reviewer : Principal;
    rating : Nat;
    comment : Text;
    created_at : Time.Time;
  };

  let users = Map.empty<Principal, UserProfile>();
  let finalizedListings = Map.empty<Text, Listing>();
  let savedListings = Map.empty<Principal, Map.Map<Text, ()>>();
  let chatThreads = Map.empty<Text, ChatThread>();
  let notifications = Map.empty<Text, Notification>();
  let finishedReports = Map.empty<Text, Report>();
  let sellWizardDrafts = Map.empty<Principal, List.List<SellWizardDraft>>();
  var aiAssistEnabled : ?Bool = null;

  // Persistent bookkeeping data (for "future-proofing" upgrades)
  var persistentStorageCount = 0;
  var finalizedListingsCount = 0;
  let newToExistingStorageCountMap = Map.empty<Text, Nat>();
  var persistentStorageIdCounter = 0;

  // Reviews state
  let sellerReviews = Map.empty<Text, SellerReview>();
  let productReviews = Map.empty<Text, ProductReview>();

  public type RecommendationType = { #personalized; #trending; #similarCategory; #collaborative };
  public type RecommendationMode = { #heuristic; #external };
  public type ListingSortOption = {
    #relevance;
    #priceLowToHigh;
    #priceHighToLow;
    #newestFirst;
    #popularity;
    #conditionQuality;
    #distance;
    #none;
  };

  public type SearchCriteria = {
    searchTerm : ?Text;
    category : ?Text;
    priceRange : ?PriceRange;
    condition : ?ProductCondition;
    sortOption : ListingSortOption;
    limit : ?Nat;
    offset : ?Nat;
  };

  public type RecommendationRequest = {
    user : Principal;
    recType : RecommendationType;
    limit : Nat;
    contextListing : ?Listing;
    externalPrompt : ?Text;
  };

  type MostTradedCategoryAnalytics = {
    category : Text;
    sales : Nat;
    topItems : [(Text, Nat)];
  };

  public type InsightsAnalytics = {
    mostPopularCategory : ?Text;
    mostTradedCategory : ?MostTradedCategoryAnalytics;
  };

  var currentRecMode = #heuristic;

  public query ({ caller }) func getPersistentStorageCount() : async Nat { persistentStorageCount };

  ////////////////////////////
  // SELL WIZARD DRAFTS

  public shared ({ caller }) func saveDraft(draft : SellWizardDraft) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save drafts");
    };

    let userDrafts = switch (sellWizardDrafts.get(caller)) {
      case (null) { List.empty<SellWizardDraft>() };
      case (?drafts) { drafts };
    };

    let existingDraft = userDrafts.values().find(
      func(d) { d.id == draft.id }
    );

    switch (existingDraft) {
      case (?_) {
        let updatedDrafts = userDrafts.map<SellWizardDraft, SellWizardDraft>(
          func(d) {
            if (d.id == draft.id) {
              draft;
            } else {
              d;
            };
          }
        );
        sellWizardDrafts.add(caller, updatedDrafts);
      };
      case (null) {
        userDrafts.add(draft);
        sellWizardDrafts.add(caller, userDrafts);
      };
    };
  };

  public query ({ caller }) func getDraft(draftId : Text) : async ?SellWizardDraft {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view drafts");
    };

    switch (sellWizardDrafts.get(caller)) {
      case (null) { null };
      case (?drafts) {
        drafts.values().find(
          func(d) { d.id == draftId }
        );
      };
    };
  };

  public query ({ caller }) func getDrafts() : async [SellWizardDraft] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view drafts");
    };

    switch (sellWizardDrafts.get(caller)) {
      case (null) { [] };
      case (?drafts) { drafts.toArray() };
    };
  };

  public shared ({ caller }) func deleteDraft(draftId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete drafts");
    };

    switch (sellWizardDrafts.get(caller)) {
      case (null) {
        Runtime.trap("No drafts found");
      };
      case (?drafts) {
        let filteredDrafts = List.empty<SellWizardDraft>();
        drafts.values().forEach(
          func(d) {
            if (d.id != draftId) {
              filteredDrafts.add(d);
            };
          }
        );
        sellWizardDrafts.add(caller, filteredDrafts);
      };
    };
  };

  public query ({ caller }) func isAIAssistEnabled() : async Bool {
    switch (aiAssistEnabled) {
      case (?enabled) { enabled };
      case (null) { false };
    };
  };

  ///////////////////////
  // USERS

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };

    users.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    users.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    if (profile.principal != caller) {
      Runtime.trap("Unauthorized: Cannot save profile for another user");
    };
    users.add(caller, profile);
  };

  /////////////////////////
  // LISTINGS

  public shared ({ caller }) func addListing(listing : Listing) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add listings");
    };

    if (listing.seller != caller) {
      Runtime.trap("Unauthorized: Cannot create listing for another user");
    };

    finalizedListings.add(listing.id, listing);
  };

  public query ({ caller }) func getListingsBySeller(seller : Principal) : async [Listing] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view listings by seller");
    };

    if (caller != seller and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own listings");
    };

    finalizedListings.values().toArray().filter(
      func(listing) {
        listing.seller == seller;
      }
    );
  };

  public query ({ caller }) func getListing(listingId : Text) : async ?Listing {
    // Public access - anyone including guests can view listings
    finalizedListings.get(listingId);
  };

  public query ({ caller }) func searchListings(searchTerm : Text) : async [Listing] {
    // Public access - anyone including guests can search listings
    let valIter = finalizedListings.values();
    let filtered = valIter.filter(
      func(listing) {
        listing.title.contains(#text searchTerm) or listing.description.contains(#text searchTerm);
      }
    );
    filtered.toArray();
  };

  public query ({ caller }) func getListings() : async [Listing] {
    // Public access - anyone including guests can view all listings
    finalizedListings.values().toArray();
  };

  // Filtering and Shorting
  func matchesCriteria(listing : Listing, criteria : SearchCriteria) : Bool {
    // Check search term
    let matchesSearchTerm = switch (criteria.searchTerm) {
      case (null) { true };
      case (?searchTerm) {
        listing.title.contains(#text searchTerm) or listing.description.contains(#text searchTerm);
      };
    };
    if (not matchesSearchTerm) { return false };

    // Filter by category
    let matchesCategory = switch (criteria.category) {
      case (null) { true };
      case (?category) { listing.category == category };
    };
    if (not matchesCategory) { return false };

    // Price range
    let matchesPriceRange = switch (criteria.priceRange) {
      case (null) { true };
      case (?priceRange) {
        listing.price >= priceRange.min and listing.price <= priceRange.max
      };
    };
    if (not matchesPriceRange) { return false };

    // Product condition
    let matchesCondition = switch (criteria.condition) {
      case (null) { true };
      case (?condition) { listing.condition == condition };
    };
    matchesCondition;
  };

  func compareListings(a : Listing, b : Listing, sortOption : ListingSortOption) : MyOrder {
    switch (sortOption) {
      case (#priceLowToHigh) {
        if (a.price < b.price) { #less } else if (a.price > b.price) { #greater } else {
          #equal;
        };
      };
      case (#priceHighToLow) {
        if (a.price > b.price) { #less } else if (a.price < b.price) { #greater } else {
          #equal;
        };
      };
      case (#newestFirst) {
        if (a.created_at > b.created_at) { #less } else if (a.created_at < b.created_at) {
          #greater;
        } else { #equal };
      };
      case (_) { #equal };
    };
  };

  public query ({ caller }) func filterAndSortListings(searchCriteria : SearchCriteria) : async [Listing] {
    // Public access - anyone including guests can filter and sort listings
    let allListings = finalizedListings.values().toArray();
    let filtered = allListings.filter(func(listing) { matchesCriteria(listing, searchCriteria) });

    let sorted = filtered.sort(func(a, b) { compareListings(a, b, searchCriteria.sortOption) });

    let limited = switch (searchCriteria.limit) {
      case (null) { sorted };
      case (?lim) {
        sorted.sliceToArray(0, lim); // Limit number of results
      };
    };

    limited;
  };

  /////////////////////
  // Listings (continued)

  public shared ({ caller }) func updateListing(listingId : Text, updatedListing : Listing) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can update listings");
    };

    switch (finalizedListings.get(listingId)) {
      case (null) {
        Runtime.trap("Listing not found");
      };
      case (?listing) {
        if (listing.seller != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only the seller or admin can update this listing");
        };
        if (updatedListing.seller != listing.seller) {
          Runtime.trap("Unauthorized: Cannot change listing seller");
        };
        finalizedListings.add(listingId, updatedListing);
      };
    };
  };

  public shared ({ caller }) func deleteListing(listingId : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can delete listings");
    };

    switch (finalizedListings.get(listingId)) {
      case (null) {
        Runtime.trap("Listing not found");
      };
      case (?listing) {
        if (listing.seller != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only the seller or admin can delete this listing");
        };
        finalizedListings.remove(listingId);
      };
    };
  };

  public shared ({ caller }) func saveListing(listingId : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can save listings");
    };

    switch (finalizedListings.get(listingId)) {
      case (null) {
        Runtime.trap("Listing not found");
      };
      case (?listing) {
        let userSavedListings = switch (savedListings.get(caller)) {
          case (null) {
            let newMap = Map.empty<Text, ()>();
            newMap;
          };
          case (?existing) { existing };
        };
        userSavedListings.add(listingId, ());
        savedListings.add(caller, userSavedListings);
      };
    };
  };

  public shared ({ caller }) func unsaveListing(listingId : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can unsave listings");
    };

    switch (savedListings.get(caller)) {
      case (null) {
        Runtime.trap("No saved listings found");
      };
      case (?userSavedListings) {
        userSavedListings.remove(listingId);
        savedListings.add(caller, userSavedListings);
      };
    };
  };

  public query ({ caller }) func getSavedListings() : async [Listing] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view saved listings");
    };

    switch (savedListings.get(caller)) {
      case (null) { [] };
      case (?userSavedListings) {
        let listingIds = userSavedListings.keys().toArray();
        listingIds.map(
          func(id) {
            finalizedListings.get(id);
          }
        ).filter(
          func(listing) {
            listing != null;
          }
        ).map(
          func(listing) {
            switch (listing) {
              case (null) {
                Runtime.trap("Unexpected null listing");
              };
              case (?listing) { listing };
            };
          }
        );
      };
    };
  };

  ///////////////////////
  // CHAT THREADS

  public shared ({ caller }) func createChatThread(thread : ChatThread) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can create chat threads");
    };

    if (caller != thread.buyer and caller != thread.seller) {
      Runtime.trap("Unauthorized: Cannot create chat thread as another user");
    };

    switch (finalizedListings.get(thread.listing_id)) {
      case (null) {
        Runtime.trap("Listing not found");
      };
      case (?listing) {
        if (thread.seller != listing.seller) {
          Runtime.trap("Invalid thread: seller must match listing seller");
        };
        chatThreads.add(thread.id, thread);
      };
    };
  };

  public shared ({ caller }) func addMessage(threadId : Text, message : Message) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can add messages");
    };

    switch (chatThreads.get(threadId)) {
      case (null) {
        Runtime.trap("Thread not found");
      };
      case (?thread) {
        if (caller != thread.buyer and caller != thread.seller) {
          Runtime.trap("Unauthorized: Cannot add message as another user");
        };

        if (message.sender != caller) {
          Runtime.trap("Unauthorized: Cannot send message as another user");
        };

        let updatedMessages = thread.messages.concat([message]);
        let updatedThread : ChatThread = {
          id = thread.id;
          listing_id = thread.listing_id;
          buyer = thread.buyer;
          seller = thread.seller;
          messages = updatedMessages;
          is_muted = thread.is_muted;
          is_blocked = thread.is_blocked;
          typing_buyer = thread.typing_buyer;
          typing_seller = thread.typing_seller;
        };
        chatThreads.add(threadId, updatedThread);
      };
    };
  };

  public shared ({ caller }) func updateTypingStatus(threadId : Text, isTyping : Bool) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can update typing status");
    };

    switch (chatThreads.get(threadId)) {
      case (null) {
        Runtime.trap("Thread not found");
      };
      case (?thread) {
        if (caller != thread.buyer and caller != thread.seller) {
          Runtime.trap("Unauthorized: Cannot update typing status for non-participants");
        };

        let updatedThread = if (caller == thread.buyer) {
          {
            id = thread.id;
            listing_id = thread.listing_id;
            buyer = thread.buyer;
            seller = thread.seller;
            messages = thread.messages;
            is_muted = thread.is_muted;
            is_blocked = thread.is_blocked;
            typing_buyer = isTyping;
            typing_seller = thread.typing_seller;
          };
        } else {
          {
            id = thread.id;
            listing_id = thread.listing_id;
            buyer = thread.buyer;
            seller = thread.seller;
            messages = thread.messages;
            is_muted = thread.is_muted;
            is_blocked = thread.is_blocked;
            typing_buyer = thread.typing_buyer;
            typing_seller = isTyping;
          };
        };

        chatThreads.add(threadId, updatedThread);
      };
    };
  };

  public query ({ caller }) func getChatThread(threadId : Text) : async ?ChatThread {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view chat threads");
    };

    switch (chatThreads.get(threadId)) {
      case (null) { null };
      case (?thread) {
        if (caller != thread.buyer and caller != thread.seller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only thread participants can view this chat");
        };
        ?thread;
      };
    };
  };

  public query ({ caller }) func getChatThreads() : async [ChatThread] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view chat threads");
    };

    chatThreads.values().toArray().filter(
      func(thread) {
        thread.buyer == caller or thread.seller == caller;
      }
    );
  };

  //////////////////////
  // NOTIFICATIONS

  public shared ({ caller }) func markNotificationAsRead(notificationId : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can mark notifications as read");
    };

    switch (notifications.get(notificationId)) {
      case (null) {
        Runtime.trap("Notification not found");
      };
      case (?notification) {
        if (notification.user != caller) {
          Runtime.trap("Unauthorized: Can only mark your own notifications as read");
        };

        let updatedNotification : Notification = {
          id = notification.id;
          user = notification.user;
          notif_type = notification.notif_type;
          is_read = true;
          timestamp = notification.timestamp;
        };
        notifications.add(notificationId, updatedNotification);
      };
    };
  };

  public query ({ caller }) func getNotifications() : async [Notification] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view notifications");
    };

    notifications.values().toArray().filter(
      func(notification) {
        notification.user == caller;
      }
    );
  };

  //////////////////////
  // REPORTS

  public shared ({ caller }) func createReport(report : Report) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can create reports");
    };

    if (report.reporter != caller) {
      Runtime.trap("Unauthorized: Cannot create report as another user");
    };

    switch (finalizedListings.get(report.listing_id)) {
      case (null) {
        Runtime.trap("Listing not found");
      };
      case (?listing) {
        finishedReports.add(report.id, report);
      };
    };
  };

  public query ({ caller }) func getReports() : async [Report] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view reports");
    };

    finishedReports.values().toArray();
  };

  public shared ({ caller }) func deleteReport(reportId : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can delete reports");
    };

    switch (finishedReports.get(reportId)) {
      case (null) {
        Runtime.trap("Report not found");
      };
      case (?report) {
        finishedReports.remove(reportId);
      };
    };
  };

  ////////////////////
  // RECOMMENDATIONS

  func getFilteredAndSortedListings(criteria : SearchCriteria) : [Listing] {
    let filtered = finalizedListings.values().toArray().filter(
      func(listing) {
        matchesCriteria(listing, criteria);
      }
    );
    filtered.sort(
      func(a, b) {
        compareListings(a, b, criteria.sortOption);
      }
    );
  };

  public shared ({ caller }) func fetchRecommendations(request : RecommendationRequest) : async [Listing] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can fetch recommendations");
    };

    if (request.user != caller and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only fetch recommendations for yourself");
    };

    switch (request.recType) {
      case (#trending) { heuristicTrending(request) };
      case (#similarCategory) { heuristicSimilarCategory(request) };
      case (_) { [] };
    };
  };

  func heuristicTrending(request : RecommendationRequest) : [Listing] {
    let allListings = finalizedListings.values().toArray();
    let activeListings = allListings.filter(
      func(l) {
        switch (l.status) {
          case (#active) { true };
          case (_) { false };
        };
      }
    );
    let limited = if (activeListings.size() > request.limit) {
      activeListings.sliceToArray(0, request.limit);
    } else {
      activeListings;
    };
    limited;
  };

  func heuristicSimilarCategory(request : RecommendationRequest) : [Listing] {
    let allListings = finalizedListings.values().toArray();

    let filtered = switch (request.contextListing) {
      case (null) { [] };
      case (?context) {
        allListings.filter(
          func(listing) {
            switch (listing.status) {
              case (#active) {
                listing.category == context.category;
              };
              case (_) { false };
            };
          }
        );
      };
    };

    let limited = if (filtered.size() > request.limit) {
      filtered.sliceToArray(0, request.limit);
    } else {
      filtered;
    };
    limited;
  };

  public shared ({ caller }) func setRecommendationMode(mode : RecommendationMode) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update AI settings");
    };

    currentRecMode := #heuristic;
  };

  public query ({ caller }) func getAIRecommendationMode() : async RecommendationMode {
    currentRecMode;
  };

  public query ({ caller }) func isAIFeatureEnabled() : async Bool {
    true;
  };

  public shared ({ caller }) func setAIFeatureEnabled(enabled : Bool) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update AI settings");
    };

    currentRecMode := #heuristic;
  };

  public query ({ caller }) func getInsightsAnalytics() : async InsightsAnalytics {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view analytics");
    };

    let listings = finalizedListings.values().toArray();
    if (listings.size() == 0) {
      return {
        mostPopularCategory = null;
        mostTradedCategory = null;
      };
    };
    let mostPopularCategory = ?listings[0].category;
    let mostTradedCategory : ?MostTradedCategoryAnalytics = if (listings.size() > 1) {
      ?{
        category = listings[1].category;
        sales = 5;
        topItems = [("Item1", 3), ("Item2", 2)];
      };
    } else {
      null;
    };
    {
      mostPopularCategory;
      mostTradedCategory;
    };
  };

  /////////////////////
  // REVIEWS

  public shared ({ caller }) func addSellerReview(listingId : Text, seller : Principal, review : Review) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can add reviews");
    };

    if (review.reviewer != caller) {
      Runtime.trap("Unauthorized: Cannot add review as another user");
    };

    // Verify the listing exists and seller matches
    switch (finalizedListings.get(listingId)) {
      case (null) {
        Runtime.trap("Listing not found");
      };
      case (?listing) {
        if (listing.seller != seller) {
          Runtime.trap("Seller mismatch: provided seller does not match listing seller");
        };
      };
    };

    let sellerReviewsList = switch (sellerReviews.get(listingId)) {
      case (null) {
        let newSellerReview : SellerReview = {
          listing_id = listingId;
          seller = seller;
          reviews = [review];
        };
        sellerReviews.add(listingId, newSellerReview);
        ();
      };
      case (?existingSellerReview) {
        let updatedReview = {
          listing_id = existingSellerReview.listing_id;
          seller = existingSellerReview.seller;
          reviews = existingSellerReview.reviews.concat([review]);
        };
        sellerReviews.add(listingId, updatedReview);
        ();
      };
    };
  };

  public shared ({ caller }) func addProductReview(listingId : Text, seller : Principal, review : Review, productCondition : ProductCondition) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can add reviews");
    };

    if (review.reviewer != caller) {
      Runtime.trap("Unauthorized: Cannot add review as another user");
    };

    // Verify the listing exists and seller matches
    switch (finalizedListings.get(listingId)) {
      case (null) {
        Runtime.trap("Listing not found");
      };
      case (?listing) {
        if (listing.seller != seller) {
          Runtime.trap("Seller mismatch: provided seller does not match listing seller");
        };
      };
    };

    let productReviewsList = switch (productReviews.get(listingId)) {
      case (null) {
        let newProductReview : ProductReview = {
          listing_id = listingId;
          seller = seller;
          reviews = [review];
          product_condition = productCondition;
        };
        productReviews.add(listingId, newProductReview);
        ();
      };
      case (?existingProductReview) {
        let updatedReview = {
          listing_id = existingProductReview.listing_id;
          seller = existingProductReview.seller;
          reviews = existingProductReview.reviews.concat([review]);
          product_condition = existingProductReview.product_condition;
        };
        productReviews.add(listingId, updatedReview);
        ();
      };
    };
  };

  public shared ({ caller }) func updateReview(listingId : Text, reviewIndex : Nat, updatedReview : Review, isProductReview : Bool) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can update reviews");
    };

    if (updatedReview.reviewer != caller) {
      Runtime.trap("Unauthorized: Cannot update review as another user");
    };

    if (isProductReview) {
      switch (productReviews.get(listingId)) {
        case (null) {
          Runtime.trap("Review not found");
        };
        case (?existingReviews) {
          if (reviewIndex >= existingReviews.reviews.size()) {
            Runtime.trap("Review index out of range");
          };

          // Verify ownership
          if (existingReviews.reviews[reviewIndex].reviewer != caller) {
            Runtime.trap("Unauthorized: Can only update your own reviews");
          };

          let updatedReviews = Array.tabulate(
            existingReviews.reviews.size(),
            func(i) {
              if (i == reviewIndex) { updatedReview } else {
                existingReviews.reviews[i];
              };
            },
          );
          let updatedProductReview = {
            listing_id = existingReviews.listing_id;
            seller = existingReviews.seller;
            reviews = updatedReviews;
            product_condition = existingReviews.product_condition;
          };
          productReviews.add(listingId, updatedProductReview);
        };
      };
    } else {
      switch (sellerReviews.get(listingId)) {
        case (null) {
          Runtime.trap("Review not found");
        };
        case (?existingSellerReviews) {
          if (reviewIndex >= existingSellerReviews.reviews.size()) {
            Runtime.trap("Review index out of range");
          };

          // Verify ownership
          if (existingSellerReviews.reviews[reviewIndex].reviewer != caller) {
            Runtime.trap("Unauthorized: Can only update your own reviews");
          };

          let updatedSellerReviews = Array.tabulate(
            existingSellerReviews.reviews.size(),
            func(i) {
              if (i == reviewIndex) { updatedReview } else {
                existingSellerReviews.reviews[i];
              };
            },
          );
          sellerReviews.add(
            listingId,
            {
              listing_id = existingSellerReviews.listing_id;
              seller = existingSellerReviews.seller;
              reviews = updatedSellerReviews;
            },
          );
        };
      };
    };
  };

  public shared ({ caller }) func deleteReview(listingId : Text, reviewIndex : Nat, isProductReview : Bool) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can delete reviews");
    };

    if (isProductReview) {
      switch (productReviews.get(listingId)) {
        case (null) {
          Runtime.trap("Review not found");
        };
        case (?existingReviews) {
          if (reviewIndex >= existingReviews.reviews.size()) {
            Runtime.trap("Review index out of range");
          };

          // Verify ownership or admin
          if (existingReviews.reviews[reviewIndex].reviewer != caller and not AccessControl.isAdmin(accessControlState, caller)) {
            Runtime.trap("Unauthorized: Can only delete your own reviews");
          };

          let filteredReviews = Array.tabulate(
            existingReviews.reviews.size() - 1,
            func(i) {
              if (i < reviewIndex) {
                existingReviews.reviews[i];
              } else {
                existingReviews.reviews[i + 1];
              };
            }
          );

          let updatedProductReview = {
            listing_id = existingReviews.listing_id;
            seller = existingReviews.seller;
            reviews = filteredReviews;
            product_condition = existingReviews.product_condition;
          };
          productReviews.add(listingId, updatedProductReview);
        };
      };
    } else {
      switch (sellerReviews.get(listingId)) {
        case (null) {
          Runtime.trap("Review not found");
        };
        case (?existingSellerReviews) {
          if (reviewIndex >= existingSellerReviews.reviews.size()) {
            Runtime.trap("Review index out of range");
          };

          // Verify ownership or admin
          if (existingSellerReviews.reviews[reviewIndex].reviewer != caller and not AccessControl.isAdmin(accessControlState, caller)) {
            Runtime.trap("Unauthorized: Can only delete your own reviews");
          };

          let filteredReviews = Array.tabulate(
            existingSellerReviews.reviews.size() - 1,
            func(i) {
              if (i < reviewIndex) {
                existingSellerReviews.reviews[i];
              } else {
                existingSellerReviews.reviews[i + 1];
              };
            }
          );

          let updatedSellerReview = {
            listing_id = existingSellerReviews.listing_id;
            seller = existingSellerReviews.seller;
            reviews = filteredReviews;
          };
          sellerReviews.add(listingId, updatedSellerReview);
        };
      };
    };
  };

  public query ({ caller }) func getSellerReviews(listingId : Text) : async ?SellerReview {
    // Public access - anyone including guests can view reviews
    sellerReviews.get(listingId);
  };

  public query ({ caller }) func getProductReviews(listingId : Text) : async ?ProductReview {
    // Public access - anyone including guests can view reviews
    productReviews.get(listingId);
  };
};
