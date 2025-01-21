export interface Attachment {
  name: string;
  type: string;
  url: string;
}

export interface User {
    _id: String;
    name: String;
    email: String;
    username: String;
    profilePic: String;
    bio: String;
}

export interface Message {
  _id: string;
  userId: string;
  message: string;
  attachments: Attachment[];
  status: string;
  timestamp: number;
  user: User;
}
