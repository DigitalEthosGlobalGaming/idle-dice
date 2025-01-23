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

addUpdate(
  "2025-01-23",
  "Technical",
  "Added in the ability to view history builds and added the version number to the welcome screen."
);
addUpdate(
  "2025-01-23",
  "Features",
  "Dice rollers now all roll at the same time."
);
addUpdate(
  "2025-01-23",
  "Features",
  "Hovering over buildings animate them to be larger."
);

export const gameUpdates = Object.values(updates).sort((a, b) => {
  return -a.date.toLocaleLowerCase().localeCompare(b.date.toLocaleLowerCase());
});
