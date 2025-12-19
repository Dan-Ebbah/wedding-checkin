export type Guest = {
  id: number;
  name: string;
  table: string;
  checkedIn: boolean;
  vip: boolean;
};

export type GuestRow = (string | number | undefined)[];
