import { serve } from "@upstash/workflow/nextjs"; // import the serve function from upstash workflow to define and handle serverless workflow endpoints
import { db } from "@/database/drizzle"; // import database connection instance configured with drizzle ORM for querying data
import { users } from "@/database/schema"; // import users table schema to access its columns during queries
import { eq } from "drizzle-orm"; // import equality operator helper for building where clauses in drizzle queries
import { sendEmail } from "@/lib/workflow"; // import utility function to send automated emails within workflow steps

type UserState = "non-active" | "active"; // define a union type to represent possible user activity states for decision logic

type InitialData = { // define type for incoming payload data used when workflow starts
  email: string; // specify user's email to identify the account for notifications
  fullName: string; // specify user's full name for personalization in emails
};

const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000; // define one day in milliseconds to use as base for time interval calculations
const THREE_DAYS_IN_MS = 3 * ONE_DAY_IN_MS; // define three days in milliseconds for detecting short-term inactivity
const THIRTY_DAYS_IN_MS = 30 * ONE_DAY_IN_MS; // define thirty days in milliseconds for monthly user engagement checks

// define an asynchronous helper function to determine user's activity state based on last activity date
const getUserState = async (email: string): Promise<UserState> => {
  const user = await db // execute query to fetch user record from database by email
    .select() // select all fields since lastActivityDate is needed for state calculation
    .from(users) // specify users table as data source
    .where(eq(users.email, email)) // filter by user's email to get specific record
    .limit(1); // limit result to a single record for efficiency and safety

  if (user.length === 0) return "non-active"; // if no record is found, classify user as non-active since they don't exist in DB

  const lastActivityDate = new Date(user[0].lastActivityDate!); // parse stored lastActivityDate into a Date object for comparison
  const now = new Date(); // get current timestamp to calculate inactivity duration
  const timeDifference = now.getTime() - lastActivityDate.getTime(); // calculate elapsed time between now and user's last activity

  if ( // check if user's inactivity is within 3 to 30 days range
    timeDifference > THREE_DAYS_IN_MS &&
    timeDifference <= THIRTY_DAYS_IN_MS
  ) {
    return "non-active"; // classify user as non-active if their inactivity duration fits the defined threshold
  }

  return "active"; // otherwise classify user as active meaning they recently engaged with the platform
};

// export POST handler from workflow definition to trigger automation based on incoming POST requests
export const { POST } = serve<InitialData>(async (context) => {
  const { email, fullName } = context.requestPayload; // destructure incoming email and fullName from request payload for use in workflow

  await context.run("new-signup", async () => { // run initial task to send a welcome email right after user signup
    await sendEmail({ // send personalized welcome email to onboard new users and confirm registration
      email,
      subject: "Welcome to the platform",
      message: `Welcome ${fullName}!`,
    });
  });

  await context.sleep("wait-for-3-days", 60 * 60 * 24 * 3); // pause workflow execution for 3 days before checking user engagement

  while (true) { // continuously loop to perform periodic engagement checks indefinitely
    const state = await context.run("check-user-state", async () => { // run step to get the user's current activity state from database
      return await getUserState(email); // call helper to determine active/non-active status for follow-up action
    });

    if (state === "non-active") { // if user hasn't engaged recently, send a re-engagement email
      await context.run("send-email-non-active", async () => { // execute task to reach out to inactive users
        await sendEmail({ // send personalized “we miss you” email to encourage returning to the platform
          email,
          subject: "Are you still there?",
          message: `Hey ${fullName}, we miss you!`,
        });
      });
    } else if (state === "active") { // if user has re-engaged recently, send a welcome-back email
      await context.run("send-email-active", async () => { // execute task to send appreciation message for user activity
        await sendEmail({ // send personalized message acknowledging user’s return to improve retention
          email,
          subject: "Welcome back!",
          message: `Welcome back ${fullName}!`,
        });
      });
    }

    await context.sleep("wait-for-1-month", 60 * 60 * 24 * 30); // wait for 30 days before repeating engagement check for ongoing user retention
  }
});
