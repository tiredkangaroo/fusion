export interface BaseType {
  _id: string;
  created_at?: Date;
  updated_at?: Date;
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
  pfp: string;
  conversations: Array<ConversationType>;
  members: Array<UserType>;
}
