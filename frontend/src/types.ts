export interface BaseType {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}
export interface MessageType extends BaseType {
  text?: string;
  image?: string;
  user: UserType; //due to foreign key non population, it will show user id
  conversation: ConversationType;
}
export interface ConversationType extends BaseType {
  members: Array<UserType>;
  messages: Array<MessageType>;
  title: string | null;
}
export interface UserType extends BaseType {
  username: string;
  email: string;
  pfp: string;
  bio: string;
  organization: string;
  conversations: Array<ConversationType>;
  members: Array<UserType>;
  phone_number?: string;
}
