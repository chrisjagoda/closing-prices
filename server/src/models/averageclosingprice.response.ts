import { AverageClosingPrice } from "types";

export default class AverageClosingPriceResponse implements AverageClosingPrice {
  averageClosingPrice!: number;

  constructor(averageClosingPrice: number) {
    this.averageClosingPrice = averageClosingPrice;
  }
}
