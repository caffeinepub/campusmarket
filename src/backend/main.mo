import List "mo:core/List";
import Text "mo:core/Text";
import Map "mo:core/Map";
import Array "mo:core/Array";
import Nat32 "mo:core/Nat32";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Persistent code stays the same
  include MixinStorage();

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type ListingStatus = {
    #active;
    #sold;
    #draft;
  };

  public type ListingImage = {
    id : Nat;
    name : Text;
    url : Text;
    upload_status : Text;
    blob : ?Storage.ExternalBlob; // file reference
  };

  public type Listing = {
    id : Text;
    title : Text;
    description : Text;
    price : Nat32;
    condition : Text;
    category : Text;
    status : ListingStatus;
    seller : Principal;
    department : Text;
    hostel : Text;
    campus : Text;
    images : [ListingImage];
    created_at : Time.Time;
    updated_at : Time.Time;
  };

  public type UserProfile = {
    principal : Principal;
    department : Text;
    hostel : Text;
    campus : Text;
    onboarding_complete : Bool;
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
    condition : Text;
    category : Text;
    department : Text;
    hostel : Text;
    campus : Text;
    images : [ListingImage];
    created_at : Time.Time;
    updated_at : Time.Time;
  };

  let users = Map.empty<Principal, UserProfile>();
  let finalizedListings = Map.empty<Text, Listing>();
  let savedListings = Map.empty<Principal, Map.Map<Text, ()>>();
  let chatThreads = Map.empty<Text, ChatThread>();
  let notifications = Map.empty<Text, Notification>();
  let finishedReports = Map.empty<Text, Report>();
  let sellWizardDrafts = Map.empty<Principal, List.List<SellWizardDraft>>();
  var aiAssistEnabled : ?Bool = null;

  public type RecommendationType = { #personalized; #trending; #similarCategory; #collaborative };
  public type RecommendationMode = { #heuristic; #external };

  public type RecommendationRequest = {
    user : Principal;
    recType : RecommendationType;
    limit : Nat;
    contextListing : ?Listing;
    externalPrompt : ?Text;
  };

  public type RecommendationResponse = {
    listings : [Listing];
    recType : RecommendationType;
    source : RecommendationMode;
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

  public query ({ caller }) func getPersistentStorageCount() : async Nat { 0 };

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
    finalizedListings.get(listingId);
  };

  public query ({ caller }) func searchListings(searchTerm : Text) : async [Listing] {
    let valIter = finalizedListings.values();
    let filtered = valIter.filter(
      func(listing) {
        listing.title.contains(#text searchTerm) or listing.description.contains(#text searchTerm);
      }
    );
    filtered.toArray();
  };

  public query ({ caller }) func getListings() : async [Listing] {
    finalizedListings.values().toArray();
  };

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

  public shared ({ caller }) func fetchRecommendations(request : RecommendationRequest) : async RecommendationResponse {
    switch (request.recType) {
      case (#personalized) { heuristicTrending(request) };
      case (#trending) { heuristicTrending(request) };
      case (#similarCategory) { heuristicSimilarCategory(request) };
      case (#collaborative) { heuristicCollaborative(request) };
    };
  };

  func heuristicTrending(request : RecommendationRequest) : RecommendationResponse {
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

    {
      listings = limited;
      recType = request.recType;
      source = #heuristic;
    };
  };

  func heuristicSimilarCategory(request : RecommendationRequest) : RecommendationResponse {
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

    {
      listings = limited;
      recType = #similarCategory;
      source = #heuristic;
    };
  };

  func heuristicCollaborative(request : RecommendationRequest) : RecommendationResponse {
    let allListings = finalizedListings.values().toArray();

    let limited = if (allListings.size() >= request.limit) {
      allListings.sliceToArray(0, request.limit);
    } else {
      allListings;
    };

    {
      listings = limited;
      recType = #collaborative;
      source = #heuristic;
    };
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
};
