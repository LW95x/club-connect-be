export interface ClubsData {
  username: string;
  password: string;
  clubName: string;
  league: string;
  location: string;
  stadiumCapacity: number;
  email: string;
  phoneNumber: string;
  website?: string;
  facebook?: string;
  twitter?: string;
}

export interface FansData {
  username: string;
  password: string;
  dateOfBirth: Date;
  address: string;
  email: string;
  phoneNumber: string;
}

export interface EventsData {
  homeClubId: number;
  title: string;
  location: string;
  price: number;
  dateTime: Date;
  description: string;
  availableTickets: number;
}

export interface OrdersData {
  userId: number;
  eventId: number;
  orderDate: Date;
  quantity: number;
  totalPrice: number;
  orderStatus: string;
  paymentId?: string;
}

export interface NewFan {
  username: string;
  password: string;
  date_of_birth: Date;
  address: string;
  email: string;
  phone_number: string;
}

export interface NewClub {
  username: string;
  password: string;
  club_name: string;
  league: string;
  location: string;
  stadium_capacity: number;
  email: string;
  phone_number: string;
  website?: string;
  facebook?: string;
  twitter?: string;
}

export interface NewEvent {
  home_club_id: number;
  title: string;
  location: string;
  price: number;
  date_time: Date;
  description: string;
  available_tickets: number;
}

export interface NewOrder {
  user_id: number;
  event_id: string;
  order_date: Date;
  quantity: number;
  total_price: number;
  order_status: string;
  add_to_calendar: boolean;
}

export interface NewPassword {
  current_password: string;
  new_password: string;
}

export interface Endpoint {
  description: string;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  scope?: string;
  token_type?: string;
  expiry_date?: number;
}

export type UpdatedFanFields = Partial<NewFan>;
export type UpdatedClubFields = Partial<NewClub>;
export type UpdatedEventFields = Partial<NewEvent>;
export type UpdatedOrderFields = Partial<NewOrder>;