import { forceArray } from "./utility/force-array";
import { quickHash } from "./utility/hash";

type Category = "Features" | "Fixes" | "Technical";
// Date will be formated as "YYYY-MM-DD"
// Key in updates is the category
// Value in updates is the list of updates for that category
export type GameUpdate = {
  id: number;
  date: string;
  updates: Record<string, string[]>;
};

const updates: Record<string, GameUpdate> = {};

function addUpdate(date: string, category: Category, items: string | string[]) {
  let update = updates[date];
  if (updates[date] == null) {
    update = updates[date] = {
      id: quickHash([date, category, items]),
      date: date,
      updates: {},
    };
  }
  if (update.updates[category] == null) {
    update.updates[category] = [];
  }
  items = forceArray(items);
  update.updates[category].push(...items);
}

addUpdate("2025-01-20", "Features", "Added in updates menu.");
addUpdate("2025-01-20", "Features", "Added in saving and loading.");
addUpdate("2025-01-20", "Fixes", "Fixed ui breaking when screen was resized.");
addUpdate(
  "2025-01-22",
  "Technical",
  "Refactored the UI to be more stable and easier to use."
);

export const gameUpdates = Object.values(updates).sort((a, b) => {
  return -a.date.toLocaleLowerCase().localeCompare(b.date.toLocaleLowerCase());
});
