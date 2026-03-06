import Map "mo:core/Map";
import List "mo:core/List";
import Principal "mo:core/Principal";
import Time "mo:core/Time";
import Bool "mo:core/Bool";
import Int "mo:core/Int";
import Order "mo:core/Order";

module {
  // Type aliases
  type OldContactMessage = {
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

  type ChatMessage = {
    role : Text;
    content : Text;
    timestamp : Time.Time;
  };

  type UserStats = {
    totalMessages : Nat;
    joinedDate : Time.Time;
    accountStatus : Bool;
  };

  type OldActor = {
    messages : Map.Map<Time.Time, OldContactMessage>;
  };

  type NewActor = {
    contactMessageMap : Map.Map<Time.Time, OldContactMessage>;
    profileMap : Map.Map<Principal, UserProfile>;
    userChatMessageMap : Map.Map<Principal, List.List<ChatMessage>>;
    userStatsMap : Map.Map<Principal, UserStats>;
  };

  public func run(old : OldActor) : NewActor {
    {
      contactMessageMap = old.messages;
      profileMap = Map.empty<Principal, UserProfile>();
      userChatMessageMap = Map.empty<Principal, List.List<ChatMessage>>();
      userStatsMap = Map.empty<Principal, UserStats>();
    };
  };
};
