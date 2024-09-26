export interface User {
  id: number;
  // username: string;
  userName: string;
  token: string;
  photoUrl?: string;
  password: string;
  knownAs: string;
  dateOFBirth: string;
  gender: string;
  city: string;
  country: string;
  lastActive: Date;
  created: Date;
  roles:string[];
}
