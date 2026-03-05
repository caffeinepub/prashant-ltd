import Text "mo:core/Text";
import Time "mo:core/Time";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Map "mo:core/Map";
import Order "mo:core/Order";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import Int "mo:core/Int";

actor {
  type ContactMessage = {
    timestamp : Time.Time;
    name : Text;
    email : Text;
    message : Text;
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

  // State
  let messages = Map.empty<Time.Time, ContactMessage>();

  // Add a contact message (public, no authentication)
  public shared ({ caller }) func addContactMessage(name : Text, email : Text, message : Text) : async () {
    // Validate input
    if (name.isEmpty()) { Runtime.trap("Name cannot be empty") };
    if (email.isEmpty()) { Runtime.trap("Email cannot be empty") };
    if (message.isEmpty()) { Runtime.trap("Message cannot be empty") };
    let timestamp = Time.now();

    let contactMessage : ContactMessage = {
      timestamp;
      name;
      email;
      message;
    };
    messages.add(timestamp, contactMessage);
  };

  // Query all messages (for admin)
  public query ({ caller }) func getAllMessages() : async [ContactMessage] {
    messages.values().toArray().sort();
  };

  public query ({ caller }) func getAllMessagesByEmail() : async [ContactMessage] {
    messages.values().toArray().sort(ContactMessage.compareByEmail);
  };

  // Get a specific message by timestamp
  public query ({ caller }) func getMessage(timestamp : Time.Time) : async ContactMessage {
    switch (messages.get(timestamp)) {
      case (null) { Runtime.trap("Message not found") };
      case (?message) { message };
    };
  };
};
