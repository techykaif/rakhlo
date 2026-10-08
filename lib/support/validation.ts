export const SUPPORT_TOPICS = ["support", "feedback"] as const;

export type SupportTopic = (typeof SUPPORT_TOPICS)[number];

export type SupportSubmission = {
  email: string;
  topic: SupportTopic;
  subject: string;
  message: string;
};

export type SupportValidationResult =
  | { success: true; data: SupportSubmission }
  | { success: false; error: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateSupportSubmission(input: unknown): SupportValidationResult {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return { success: false, error: "Invalid support request." };
  }

  const value = input as Record<string, unknown>;
  const email = typeof value.email === "string" ? value.email.trim().toLowerCase() : "";
  const topic = typeof value.topic === "string" ? value.topic.trim() : "";
  const subject = typeof value.subject === "string" ? value.subject.trim() : "";
  const message = typeof value.message === "string" ? value.message.trim() : "";

  if (!email || email.length > 320 || !EMAIL_RE.test(email)) {
    return { success: false, error: "Enter a valid email address." };
  }

  if (!SUPPORT_TOPICS.includes(topic as SupportTopic)) {
    return { success: false, error: "Choose a valid support topic." };
  }

  if (!subject || subject.length > 150) {
    return { success: false, error: "Subject must be between 1 and 150 characters." };
  }

  if (!message || message.length > 5000) {
    return { success: false, error: "Message must be between 1 and 5,000 characters." };
  }

  return {
    success: true,
    data: {
      email,
      topic: topic as SupportTopic,
      subject,
      message,
    },
  };
}
