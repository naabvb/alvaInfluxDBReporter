export interface ConsumptionResponse {
  Consumptions: Consumption[];
}

export interface Consumption {
  TariffTimeZoneId: number;
  TariffTimeZoneName: string;
  TariffTimeZoneDescription: string;
  Series: Series;
}

export interface Series {
  ReadingCounter: number;
  name: string;
  resolution: string;
  Data: [number, number][];
  Start: string;
  Stop: string;
  Step: Step;
  DataCount: number;
  Type: string;
  Unit: string;
}

export interface Step {
  TimeZoneInfo: {
    Id: string;
    DisplayName: string;
    StandardName: string;
    DaylightName: string;
    BaseUtcOffset: string;
    AdjustmentRules: [
      {
        DateStart: string;
        DateEnd: string;
        DaylightDelta: string;
        DaylightTransitionStart: {
          TimeOfDay: string;
          Month: number;
          Week: number;
          Day: number;
          DayOfWeek: number;
          IsFixedDateRule: boolean;
        };
        DaylightTransitionEnd: {
          TimeOfDay: string;
          Month: number;
          Week: number;
          Day: number;
          DayOfWeek: number;
          IsFixedDateRule: boolean;
        };
        BaseUtcOffsetDelta: string;
      }
    ];
    SupportsDaylightSavingTime: boolean;
  };
  Type: number;
  StepLength: string;
  Start: string;
  Stop: string;
  StepCount: number;
}
