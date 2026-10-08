export default {
  async scheduled(controller, env, ctx) {
    ctx.waitUntil(
      runNotificationProcess(env).catch((error) => {
        console.error("Rakhlo notification cron failed", {
          scheduledAt: new Date(controller.scheduledTime).toISOString(),
          error,
        });
        throw error;
      }),
    );
  },
};

async function runNotificationProcess(env) {
  if (!env.RAKHLO_PROCESS_URL) {
    throw new Error("RAKHLO_PROCESS_URL is not configured.");
  }

  if (!env.CRON_SECRET) {
    throw new Error("CRON_SECRET is not configured.");
  }

  const response = await fetch(env.RAKHLO_PROCESS_URL, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${env.CRON_SECRET}`,
    },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(
      `Rakhlo notification process failed with ${response.status}: ${body.slice(0, 500)}`,
    );
  }
}
