import { Client as WorkflowClient } from "@upstash/workflow"; // import WorkflowClient from upstash to manage and trigger background workflows
import { Client as QStashClient, resend } from "@upstash/qstash"; // import QStashClient for queue-based message publishing and resend provider for sending emails
import config from "@/lib/config"; // import configuration object to access secure environment variables for API tokens and URLs

export const workflowClient = new WorkflowClient({ // create workflow client instance to interact with Upstash QStash workflows
  baseUrl: config.env.upstash.qstashUrl, // set base URL for Upstash QStash workflow API from environment config
  token: config.env.upstash.qstashToken, // set authentication token for secure communication with QStash service
});

const qstashClient = new QStashClient({ // create QStash client instance for publishing messages or tasks to Upstash queues
  token: config.env.upstash.qstashToken, // use QStash token from config for authorized API access
});

export const sendEmail = async ({ // define async function to send emails using Upstash QStash integrated with Resend provider
  email, // recipient email address
  subject, // email subject line
  message, // email HTML content body
}: {
  email: string; // enforce type safety for recipient email
  subject: string; // enforce type safety for subject string
  message: string; // enforce type safety for message string
}) => {
  await qstashClient.publishJSON({ // publish a JSON payload to QStash to asynchronously trigger email sending
    api: { // define API provider configuration for QStash message
      name: "email", // set name to 'email' for identifying message purpose
      provider: resend({ token: config.env.resendToken }), // use Resend email provider with authentication token for reliable email delivery
    },
    body: { // define email message content structure
      from: "nishchaybackup@gmail.com", // specify sender address used for outgoing emails
      to: [email], // define array of recipient addresses, allowing multi-recipient support
      subject, // include email subject line passed as parameter
      html: message, // include HTML formatted email content for rich text delivery
    },
  });
};
