import { Twilio } from "twilio";
import { MessageInstance } from "twilio/lib/rest/api/v2010/account/message";

export const sendSMS = async (
  twilio: Twilio,
  code: string,
  phoneNumber: string
): Promise<MessageInstance> => {
  return twilio.messages.create({
    body: "Your MessageDrop verification code is: " + code,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: phoneNumber,
  });
};
