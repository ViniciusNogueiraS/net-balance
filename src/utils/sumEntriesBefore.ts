import Persist from "../services/PersistEntries";
import { Type } from "../types/enums";
import { IPeriod } from "../types/interfaces";

export default function sumEntriesBefore(persistance: Persist, period: IPeriod, type: Type) {
    
  let arr = persistance.getEntries() || [];
  arr = arr.filter(e => {
    if (e.date && period.init) return e.date < period.init;
    else return false;
  });
  arr = arr.filter(e => e.type === type);

  if (arr.length <= 0) return 0;

  let aux: number[] = arr.map(e => parseFloat(e.value.replace(',', '.')));
  let sum = aux.reduce((a, b) => a + b);
  return sum;
}