import Map "mo:core/Map";
import Array "mo:core/Array";
import Principal "mo:core/Principal";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import Int "mo:core/Int";
import Bool "mo:core/Bool";
import List "mo:core/List";
import Order "mo:core/Order";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import Migration "migration";

(with migration = Migration.run)
actor {
  // Mixin authorization
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Types persisted by the actor
  type ContactMessage = {
    timestamp : Time.Time;
    name : Text;
    email : Text;
    message : Text;
  };

  type UserProfile = {
    id : Text;
    displayName : Text;
    joinedDate : Time.Time;
    isActive : Bool;
  };

  module ContactMessage {
    public func compare(message1 : ContactMessage, message2 : ContactMessage) : Order.Order {
      switch (Int.compare(message1.timestamp, message2.timestamp)) {
        case (#equal) { message1.name.compare(message2.name) };
        case (other) { other };
      };
    };

    public func compareByEmail(message1 : ContactMessage, message2 : ContactMessage) : Order.Order {
      Text.compare(message1.email, message2.email);
    };
  };

  type ChatMessage = {
    role : Text;
    content : Text;
    timestamp : Time.Time;
  };

  // Type persisted by the actor
  type UserStats = {
    totalMessages : Nat;
    joinedDate : Time.Time;
    accountStatus : Bool;
  };

  // Let persistent state
  let contactMessageMap = Map.empty<Time.Time, ContactMessage>();
  let profileMap = Map.empty<Principal, UserProfile>();
  let userChatMessageMap = Map.empty<Principal, List.List<ChatMessage>>();
  let userStatsMap = Map.empty<Principal, UserStats>();

  // Add a contact message - public, no auth required (guests can submit)
  public shared ({ caller }) func addContactMessage(name : Text, email : Text, message : Text) : async () {
    let timestamp = Time.now();
    let contactMessage : ContactMessage = {
      timestamp;
      name;
      email;
      message;
    };
    contactMessageMap.add(timestamp, contactMessage);
  };

  // Getter for contact messages - admin only
  public query ({ caller }) func getAllMessages() : async [ContactMessage] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view all contact messages");
    };
    contactMessageMap.values().toArray().sort();
  };

  public query ({ caller }) func getAllMessagesByEmail() : async [ContactMessage] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view all contact messages");
    };
    contactMessageMap.values().toArray().sort(ContactMessage.compareByEmail);
  };

  // Check if a contact message has been sent - admin only
  public query ({ caller }) func hasContactMessage(
    timestamp : Time.Time
  ) : async Bool {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can check contact messages");
    };
    contactMessageMap.containsKey(timestamp);
  };

  // Hide a contact message by removing it from the persistent map - admin only
  public shared ({ caller }) func hideContactMessage(
    timestamp : Time.Time
  ) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can hide contact messages");
    };
    if (hasContactMessageHelper(timestamp)) {
      contactMessageMap.remove(timestamp);
    } else {
      Runtime.trap("Contact message not found or already hidden");
    };
  };

  // Check if a contact message exists (internal helper function)
  func hasContactMessageHelper(timestamp : Time.Time) : Bool {
    contactMessageMap.containsKey(timestamp);
  };

  public query ({ caller }) func getAllUserProfile() : async [UserProfile] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view all user profiles");
    };
    profileMap.values().toArray();
  };

  // Add a user profile - users only
  public shared ({ caller }) func addUserProfile(
    id : Text,
    displayName : Text,
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create profiles");
    };
    let userProfile : UserProfile = {
      id;
      displayName;
      joinedDate = Time.now();
      isActive = true;
    };
    profileMap.add(caller, userProfile);
    initUserStats(caller, userProfile.joinedDate); // Initialize user stats as well
  };

  public query ({ caller }) func hasUserProfile() : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can check their profile");
    };
    profileMap.containsKey(caller);
  };

  // Get caller's user profile - users only
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view their profile");
    };
    profileMap.get(caller);
  };

  // Save caller's user profile - users only
  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    profileMap.add(caller, profile);
  };

  // Get any user's profile - caller can view their own, admins can view any
  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    profileMap.get(user);
  };

  public query ({ caller }) func getUserStats() : async ?UserStats {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view their stats");
    };
    userStatsMap.get(caller);
  };

  public query ({ caller }) func getCustomUserStats(userId : Principal) : async {
    totalMessages : Nat;
    joinedDate : Time.Time;
    accountStatus : Bool;
  } {
    // Users can only view their own stats, admins can view any user's stats
    if (caller != userId and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own stats");
    };
    let userStats = getUserStatsHelper(userId);
    {
      totalMessages = userStats.totalMessages;
      joinedDate = userStats.joinedDate;
      accountStatus = userStats.accountStatus;
    };
  };

  public query ({ caller }) func getDefaultUserStats() : async UserStats {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view default stats");
    };
    {
      totalMessages = 0;
      joinedDate = Time.now();
      accountStatus = true;
    };
  };

  // Update account status - users only (for their own account)
  public shared ({ caller }) func updateAccountStatus(
    isActive : Bool,
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update their account status");
    };
    switch (userStatsMap.get(caller)) {
      case (?currentStats) {
        let updatedStats : UserStats = {
          currentStats with accountStatus = isActive;
        };
        userStatsMap.add(caller, updatedStats);
      };
      case (null) {
        let newStats : UserStats = {
          totalMessages = 0;
          joinedDate = Time.now();
          accountStatus = isActive;
        };
        userStatsMap.add(caller, newStats);
      };
    };
  };

  // Get chat history for the caller - users only
  public query ({ caller }) func getChatHistory() : async ?[ChatMessage] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view their chat history");
    };
    switch (userChatMessageMap.get(caller)) {
      case (null) { null };
      case (?messages) { ?messages.toArray() };
    };
  };

  // Get user's chat history - admin only
  public query ({ caller }) func getUserChatHistory(userId : Principal) : async ?[ChatMessage] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view other users' chat history");
    };
    switch (userChatMessageMap.get(userId)) {
      case (null) { null };
      case (?messages) { ?messages.toArray() };
    };
  };

  // Send a message and get an AI echo response - users only
  public shared ({ caller }) func sendMessage(content : Text) : async ChatMessage {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can send messages");
    };
    let formattedMessage : ChatMessage = {
      role = "user";
      content;
      timestamp = Time.now();
    };
    let aiEchoResponse = addAndEcho(content, formattedMessage, caller);
    updateMessageStats(caller);
    aiEchoResponse;
  };

  func addAndEcho(content : Text, userMessage : ChatMessage, userId : Principal) : ChatMessage {
    let aiResponse : ChatMessage = {
      role = "assistant";
      content = "AI Echo: " # content;
      timestamp = Time.now();
    };
    let chatHistory = updateChatHistory(userId, userMessage, aiResponse);
    let _ = chatHistory;
    aiResponse;
  };

  func updateChatHistory(userId : Principal, chatMessage1 : ChatMessage, chatMessage2 : ChatMessage) : [ChatMessage] {
    let newChatHistory = List.empty<ChatMessage>();
    newChatHistory.add(chatMessage1);
    newChatHistory.add(chatMessage2);

    switch (userChatMessageMap.get(userId)) {
      case (null) {
        userChatMessageMap.add(userId, newChatHistory);
      };
      case (?existingMessages) {
        existingMessages.add(chatMessage1);
        existingMessages.add(chatMessage2);
      };
    };
    newChatHistory.toArray();
  };

  // Internal helpers to init and update stats
  func initUserStats(userId : Principal, joinedDate : Time.Time) {
    let initialStats : UserStats = {
      totalMessages = 0;
      joinedDate;
      accountStatus = true;
    };
    userStatsMap.add(userId, initialStats);
  };

  func updateMessageStats(userId : Principal) {
    switch (userStatsMap.get(userId)) {
      case (?stats) {
        let updatedStats : UserStats = {
          totalMessages = stats.totalMessages + 1;
          joinedDate = stats.joinedDate;
          accountStatus = stats.accountStatus;
        };
        userStatsMap.add(userId, updatedStats);
      };
      case (null) {
        initUserStats(userId, Time.now());
      };
    };
  };

  // Helper to fetch user stats internally
  func getUserStatsHelper(userId : Principal) : UserStats {
    switch (userStatsMap.get(userId)) {
      case (?stats) { stats };
      case (null) {
        addAndReturnDefaultUserStats(userId);
      };
    };
  };

  func addAndReturnDefaultUserStats(userId : Principal) : UserStats {
    let defaultStats = {
      totalMessages = 0;
      joinedDate = Time.now();
      accountStatus = true;
    };
    userStatsMap.add(userId, defaultStats);
    defaultStats;
  };
};

