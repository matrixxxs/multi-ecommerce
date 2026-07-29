import nodeCron from "node-cron";
import { cleanupDeletedProducts } from "../services/production/deleteProduct.service";

nodeCron.schedule("* 3 * * *", async () => {
  console.log("Running product cleanup job...");
  try {
    await cleanupDeletedProducts();
    console.log("Project cleanup job finished");
  } catch (error) {
    console.error("Product cleanup job crashed...:", error);
  }
});
