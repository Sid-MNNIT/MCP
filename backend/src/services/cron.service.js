import cron from "node-cron";
import pLimit from "p-limit";
import { User } from "../models/user.model.js";
import { emailService } from "./email.service.js";

class CronService {
  constructor() {
    this.jobs = new Map();
    this.isEmailSyncRunning = false;
    this.limit = pLimit(25); 
  }

  startEmailSyncJob() {
    if (this.jobs.has("emailSync")) {
      console.log("⚠️ Email sync cron already running");
      return;
    }

    const job = cron.schedule(
      "*/1 * * * *",
      async () => {
        if (this.isEmailSyncRunning) {
          console.log("⏭️ [CRON] Email sync already running, skipping");
          return;
        }

        this.isEmailSyncRunning = true;
        console.log("🔄 [CRON] Email sync job started");

        try {
          const users = await User.find({
            isActive: true,
            isGmailConnected: true,
          }).select("_id email");

          console.log(`📧 [CRON] Users to sync: ${users.length}`);

          await Promise.all(
            users.map((user) =>
              this.limit(async () => {
                try {
                  await emailService.syncEmailsInternal({
                    userId: user._id,
                  });

                  console.log(`✅ [CRON] Synced: ${user.email}`);
                } catch (err) {
                  console.error(
                    `❌ [CRON] Failed for ${user.email}:`,
                    err.message
                  );
                }
              })
            )
          );

          console.log("✅ [CRON] Email sync job completed");
        } catch (error) {
          console.error(
            "❌ [CRON] Email sync job crashed:",
            error.message
          );
        } finally {
          this.isEmailSyncRunning = false;
        }
      },
      {
        timezone: "Asia/Kolkata",
      }
    );

    this.jobs.set("emailSync", job);
    console.log("✅ Email sync cron scheduled (every 15 minutes)");
    return job;
  }

  /**
   * Start email sync with custom cron expression
   */
  startCustomEmailSyncJob(schedule) {
    if (this.jobs.has("customEmailSync")) {
      console.log("⚠️ Custom email sync cron already running");
      return;
    }

    const job = cron.schedule(
      schedule,
      async () => {
        console.log(`🔄 [CRON] Custom email sync started (${schedule})`);

        try {
          const users = await User.find({
            isActive: true,
            isGmailConnected: true,
          }).select("_id email");

          await Promise.all(
            users.map((user) =>
              this.limit(async () => {
                try {
                  await emailService.syncEmailsInternal({
                    userId: user._id,
                  });

                  console.log(`✅ Synced: ${user.email}`);
                } catch (err) {
                  console.error(
                    `❌ Failed ${user.email}:`,
                    err.message
                  );
                }
              })
            )
          );

          console.log("✅ [CRON] Custom email sync completed");
        } catch (error) {
          console.error(
            "❌ [CRON] Custom email sync failed:",
            error.message
          );
        }
      },
      {
        timezone: "Asia/Kolkata",
      }
    );

    this.jobs.set("customEmailSync", job);
    console.log(`✅ Custom cron scheduled (${schedule})`);
    return job;
  }

  /**
   * Stop a specific cron job
   */
  stopJob(jobName) {
    const job = this.jobs.get(jobName);
    if (!job) return false;

    job.stop();
    this.jobs.delete(jobName);
    console.log(`🛑 Stopped cron job: ${jobName}`);
    return true;
  }

  /**
   * Stop all cron jobs
   */
  stopAllJobs() {
    this.jobs.forEach((job, name) => {
      job.stop();
      console.log(`🛑 Stopped cron job: ${name}`);
    });
    this.jobs.clear();
  }

  /**
   * Get status of running cron jobs
   */
  getJobsStatus() {
    return Array.from(this.jobs.keys()).map((name) => ({
      name,
      running: true,
    }));
  }
}

export const cronService = new CronService();