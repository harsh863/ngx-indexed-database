export const areIdentical = (valueA: any, valueB: any) => {
  if (typeof valueA == "object" && valueA != null && typeof valueB == "object" && valueB != null) {
    const count = [0, 0];
    for (const key in valueA) count[0]++;
    for (const key in valueB) count[1]++;
    if (count[0] - count[1] != 0) {
      return false;
    }
    for (const key in valueA) {
      if (!(key in valueB) || !areIdentical(valueA[key], valueB[key])) {
        return false;
      }
    }
    for (const key in valueB) {
      if (!(key in valueA) || !areIdentical(valueB[key], valueA[key])) {
        return false;
      }
    }
    return true;
  } else {
    return Object.is(valueA, valueB);
  }
}
