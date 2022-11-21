export interface supporterType {
  isNavOpen: boolean;
  isNavMove: boolean;
  userId: string;
  isSkip: boolean;
  search: {
    isLoading: boolean;
    books: BookType[];
  };
  lineId: string;
}

//user interface

export interface UserType {
  userId: string;
  email: string;
  userName: string;
  lineId: string;
  status: UserStatus;
  lending: UserLending[];
  request: UserRequest[];
  news: UserNews[];
  history: UserHistory[];
  want: UserWant[];
}

export interface UserStatus {
  isConnected: boolean;
  isFirst: boolean;
}

export interface UserLending {
  bookId: string;
  bookName: string;
  bookShortName: string;
  lendDate: string;
  dueDate: string;
}

export interface UserRequest {
  bookId: string;
  bookName: string;
  bookShortName: string;
  priority: number;
}

export interface UserNews {
  title: string;
  content: string;
  newsType: number;
  timestamp: string;
}

export interface UserHistory {
  bookName: string;
  bookId: string;
  lendStart: string;
  lendEnd: string;
  tag: BookTag[];
  imagePath: string;
}

export interface UserWant {
  bookId: string;
  bookName: string;
  wantDate: string;
}

//book interface

export interface BookType {
  bookId: string;
  bookName: string;
  bookShortName: string;
  lent: BookLent;
  requested: BookRequested[];
  property: {
    content: BookContent[];
    tag: BookTag[];
    imagePath: string;
    launch: string;
  };
}

export interface BookLent {
  lentDate: string;
  dueDate: string;
  userId: string;
  userName: string;
  lentState: number;
}

export interface BookRequested {
  userName: string;
  userId: string;
  priority: number;
}

export interface BookContent {
  index: number;
  contentTitle: string;
}

export interface BookTag {
  tagName: string;
  tagId: string;
  tagMag: number;
}

// export interface BookWanted {
//   userId: string;
//   userName: string;
//   wantedDate: string;
// }

//notification interface

export interface NotificationType {
  bookId: string;
  bookName: string;
  dueDate: string;
  lineId1: string;
  lineId2: string;
  notiCode: number;
  notiDate: string;
  userId1: string;
  userId2: string;
  userName1: string;
  userName2: string;
}
