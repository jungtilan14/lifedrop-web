const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

class EmailService {
  constructor() {
    // Corrected method name: createTransport
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com', // SMTP host (e.g., Gmail)
      port: process.env.SMTP_PORT || 587,             // The port (587 for non-secure)
      secure: false,                                  // false for 587 (non-secure) and true for 465 (secure)
      auth: {
        user: process.env.SMTP_USERNAME,              // Your email username
        pass: process.env.SMTP_PASSWORD               // Your email password (preferably stored securely in environment variables)
      }
    });
  }

  // Send email verification
  async sendVerificationEmail(user, verificationToken) {
    const verificationUrl = `${process.env.CLIENT_URL}/verify-email?token=${verificationToken}`;
    
    const mailOptions = {
      from: process.env.FROM_EMAIL || 'noreply@lifedrop.com',
      to: user.email,
      subject: 'Verify Your Email - LifeDrop',
      html: this.getVerificationEmailTemplate(user, verificationUrl)
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Verification email sent:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('Error sending verification email:', error);
      throw new Error('Failed to send verification email');
    }
  }

  // Send password reset email
  async sendPasswordResetEmail(user, resetToken) {
    const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;
    
    const mailOptions = {
      from: process.env.FROM_EMAIL || 'noreply@lifedrop.com',
      to: user.email,
      subject: 'Reset Your Password - LifeDrop',
      html: this.getPasswordResetEmailTemplate(user, resetUrl)
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Password reset email sent:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('Error sending password reset email:', error);
      throw new Error('Failed to send password reset email');
    }
  }

  // Send blood request notification email
  async sendBloodRequestNotification(donor, bloodRequest) {
    const mailOptions = {
      from: process.env.FROM_EMAIL || 'noreply@lifedrop.com',
      to: donor.email,
      subject: `Urgent: ${bloodRequest.blood_type} Blood Needed - LifeDrop`,
      html: this.getBloodRequestNotificationTemplate(donor, bloodRequest)
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Blood request notification email sent:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('Error sending blood request notification email:', error);
      throw new Error('Failed to send blood request notification email');
    }
  }

  // Send donation confirmation email
  async sendDonationConfirmation(donor, donationHistory) {
    const mailOptions = {
      from: process.env.FROM_EMAIL || 'noreply@lifedrop.com',
      to: donor.email,
      subject: 'Thank You for Your Blood Donation - LifeDrop',
      html: this.getDonationConfirmationTemplate(donor, donationHistory)
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Donation confirmation email sent:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('Error sending donation confirmation email:', error);
      throw new Error('Failed to send donation confirmation email');
    }
  }

  // Send donation reminder email
  async sendDonationReminder(donor) {
    const mailOptions = {
      from: process.env.FROM_EMAIL || 'noreply@lifedrop.com',
      to: donor.email,
      subject: 'Time to Donate Blood Again - LifeDrop',
      html: this.getDonationReminderTemplate(donor)
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Donation reminder email sent:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('Error sending donation reminder email:', error);
      throw new Error('Failed to send donation reminder email');
    }
  }

  // Send hospital verification email
  async sendHospitalVerificationEmail(hospitalAdmin, hospital) {
    const mailOptions = {
      from: process.env.FROM_EMAIL || 'noreply@lifedrop.com',
      to: hospitalAdmin.email,
      subject: 'Hospital Account Verified - LifeDrop',
      html: this.getHospitalVerificationTemplate(hospitalAdmin, hospital)
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Hospital verification email sent:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('Error sending hospital verification email:', error);
      throw new Error('Failed to send hospital verification email');
    }
  }

  // Send emergency blood request email
  async sendEmergencyBloodRequest(recipients, bloodRequest) {
    const mailOptions = {
      from: process.env.FROM_EMAIL || 'noreply@lifedrop.com',
      to: recipients.map(r => r.email),
      subject: `EMERGENCY: ${bloodRequest.blood_type} Blood Needed Immediately - LifeDrop`,
      html: this.getEmergencyBloodRequestTemplate(bloodRequest)
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Emergency blood request email sent:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('Error sending emergency blood request email:', error);
      throw new Error('Failed to send emergency blood request email');
    }
  }

  // Email templates (Verification, Password Reset, etc.)
  getVerificationEmailTemplate(user, verificationUrl) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #e74c3c; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .button { background: #e74c3c; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0; }
          .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to LifeDrop!</h1>
          </div>
          <div class="content">
            <h2>Hello ${user.first_name} ${user.last_name},</h2>
            <p>Thank you for joining LifeDrop, the platform that connects blood donors with those in need.</p>
            <p>To complete your registration, please verify your email address by clicking the button below:</p>
            <a href="${verificationUrl}" class="button">Verify Email Address</a>
            <p>If you didn't create an account with LifeDrop, please ignore this email.</p>
            <p>This verification link will expire in 24 hours.</p>
          </div>
          <div class="footer">
            <p>&copy; 2024 LifeDrop. All rights reserved.</p>
            <p>Saving lives, one donation at a time.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  getPasswordResetEmailTemplate(user, resetUrl) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #e74c3c; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .button { background: #e74c3c; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0; }
          .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Reset Your Password</h1>
          </div>
          <div class="content">
            <h2>Hello ${user.first_name} ${user.last_name},</h2>
            <p>We received a request to reset your password for your LifeDrop account.</p>
            <p>Click the button below to reset your password:</p>
            <a href="${resetUrl}" class="button">Reset Password</a>
            <p>If you didn't request a password reset, please ignore this email. Your password will remain unchanged.</p>
            <p>This reset link will expire in 1 hour for security reasons.</p>
          </div>
          <div class="footer">
            <p>&copy; 2024 LifeDrop. All rights reserved.</p>
            <p>Saving lives, one donation at a time.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  // Add similar templates for other email types like blood request, donation reminder, etc.
}

module.exports = new EmailService();
