import { Hono } from "hono";
import { AppBindings } from "./types";

const app = new Hono<AppBindings>();

app.get("/", (c) => {
  return c.text("Nothing to see here...");
});

export default {
  fetch: app.fetch,
  async scheduled(controller: ScheduledController, env: AppBindings["Bindings"], ctx: ExecutionContext) {
    // Write code for updating your API

    const resetTable = async (endPoint: string, secret: string) => {
      const newRequest = new Request(endPoint, {
        method: "POST",
        body: JSON.stringify({
          adminSecret: secret,
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      });

      const result = await fetch(newRequest);
      console.log(`${new Date(controller.scheduledTime)} - Reset table cron job status: ${result.status}`);
    };

    const testUserConnection = async (endPoint: string) => {
      const newRequest = new Request(endPoint, {
        method: "GET",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      });

      const result = await fetch(newRequest);
      console.log(`${new Date(controller.scheduledTime)} - Reset table cron job status: ${result.status}`);
    };

    switch (controller.cron) {
      case "0 0 * * *":
        // Every day 12am GMT+0
        await resetTable(env.USER_TABLE_RESET_ENDPOINT, env.ADMIN_SECRET);

      case "*/10 * * * *":
        // Every 10 mins
        await testUserConnection(env.USER_GET_ALL_ENDPOINT);
    }
    console.log("cron processed");
  },
};
