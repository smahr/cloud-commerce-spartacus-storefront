export function partition(
  list: any[],
  condition: (element: any) => boolean
): [any[], any[]] {
  return list.reduce(
    ([positiveList, negativeList], element) => {
      return condition(element)
        ? [[...positiveList, element], negativeList]
        : [positiveList, [...negativeList, element]];
    },
    [[], []]
  );
}
