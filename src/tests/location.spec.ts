import test from "node:test";
import assert from "node:assert/strict";
import type { Location, NormalizedSoftwareJobInfo } from "../model/jobs-model.ts";

test("Location filter test", () => {
  const jobInfo = {
    location: {
      scope: "city",
      businessRegion: "emea",
      continent: "europe",
      country: "france",
      city: "paris",
    },
    workplaceType: "hybrid",
  } as NormalizedSoftwareJobInfo;

  // search: { remote: { businessRegion: "emea" }, onSiteOrHybrid: { country: "france" } },

  const remoteSearch = "emea";

  assert.strictEqual(Object.values(jobInfo.location).includes(remoteSearch), true);
});
