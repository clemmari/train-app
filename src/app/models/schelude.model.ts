export class Schelude {
  train: string;
  trainType: string;
  depStation: string;
  endStation: string;
  arrives: Arrive;
}

export class Arrive {
  actualTime?: string;
  cancelled?: boolean;
  scheludedTime: string;
}
