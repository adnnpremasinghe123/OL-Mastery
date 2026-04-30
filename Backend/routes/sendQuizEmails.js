import Student from "../models/User.js"; // path to your User model
import { sendEmail } from "../utils/mailer.js";

/**
 * Sends email notifications to all students about a new quiz
 * @param {Object} quiz - Quiz object containing title, createdBy, startDate, startTime, timeLimit
 */
export const notifyStudentsAboutQuiz = async (quiz) => {
  try {
    // Fetch only users with role "student"
    const students = await Student.find({ role: "student" });

    students.forEach((student) => {
      const subject = `📢 New Quiz Available: ${quiz.title}`;

      const text = `
Hi ${student.name},

We are excited to announce a new quiz has been scheduled! Please find the details below:

----------------------------------------
📝 Quiz Title: ${quiz.title}
👤 Created By: ${quiz.createdBy}
📅 Start Date: ${quiz.startDate}
⏰ Start Time: ${quiz.startTime}
⏱ Duration: ${quiz.timeLimit} minutes
----------------------------------------

Please make sure to be ready at the scheduled time.

Good luck and do your best!

Best regards,
The OL-Mastery Team
`;

      sendEmail(student.email, subject, text);
    });

    console.log("Emails sent to all students.");
  } catch (err) {
    console.error("Error sending quiz notifications:", err);
  }
};