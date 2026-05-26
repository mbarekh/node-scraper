import test from "node:test";
import assert from "node:assert/strict";
import type { Location } from "../model/jobs-model.ts";

test("Location filter test", () => {
  const location: Location = {
    scope: "city",
    workplaceType: "hybrid",
    businessRegion: "emea",
    continent: "europe",
    country: "france",
    city: "paris",
  };

  // search: { remote: { businessRegion: "emea" }, onSiteOrHybrid: { country: "france" } },

  const remoteSearch = "emea";

  assert.strictEqual(Object.values(location).includes(remoteSearch), true);
});
