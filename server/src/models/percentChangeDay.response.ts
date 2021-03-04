import { PercentChangeDay } from "types";

export default class PercentChangeDayResponse {
  percentChangeDays!: PercentChangeDay[];

  constructor(percentChangeDays: PercentChangeDay[]) {
    this.percentChangeDays = percentChangeDays;
  }
}
