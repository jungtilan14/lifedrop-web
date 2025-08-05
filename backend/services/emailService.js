const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT || 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD
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

  // Email templates
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

  getBloodRequestNotificationTemplate(donor, bloodRequest) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #e74c3c; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .urgent { background: #ff6b6b; color: white; padding: 10px; border-radius: 5px; text-align: center; margin: 20px 0; }
          .details { background: white; padding: 15px; border-radius: 5px; margin: 20px 0; }
          .button { background: #e74c3c; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0; }
          .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Blood Donation Request</h1>
          </div>
          <div class="content">
            <h2>Hello ${donor.first_name} ${donor.last_name},</h2>
            <div class="urgent">
              <h3>🚨 URGENT: ${bloodRequest.blood_type} Blood Needed</h3>
            </div>
            <p>A patient is in urgent need of ${bloodRequest.blood_type} blood donation. Your help could save a life!</p>
            <div class="details">
              <h4>Request Details:</h4>
              <p><strong>Patient:</strong> ${bloodRequest.patient_name}</p>
              <p><strong>Blood Type:</strong> ${bloodRequest.blood_type}</p>
              <p><strong>Urgency:</strong> ${bloodRequest.urgency_level.toUpperCase()}</p>
              <p><strong>Location:</strong> ${bloodRequest.location}</p>
              <p><strong>Required By:</strong> ${new Date(bloodRequest.required_by).toLocaleDateString()}</p>
              <p><strong>Contact:</strong> ${bloodRequest.contact_person} - ${bloodRequest.contact_phone}</p>
            </div>
            <p>If you are available to donate, please respond as soon as possible.</p>
            <a href="${process.env.CLIENT_URL}/blood-requests/${bloodRequest.id}" class="button">View Request</a>
          </div>
          <div class="footer">
            <p>&copy; 2024 LifeDrop. All rights reserved.</p>
            <p>Thank you for being a life-saver!</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  getDonationConfirmationTemplate(donor, donationHistory) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #27ae60; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .success { background: #2ecc71; color: white; padding: 10px; border-radius: 5px; text-align: center; margin: 20px 0; }
          .details { background: white; padding: 15px; border-radius: 5px; margin: 20px 0; }
          .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Thank You for Your Donation!</h1>
          </div>
          <div class="content">
            <h2>Hello ${donor.first_name} ${donor.last_name},</h2>
            <div class="success">
              <h3>🎉 Your blood donation has been successfully recorded!</h3>
            </div>
            <p>Thank you for your generous donation. Your contribution will help save lives!</p>
            <div class="details">
              <h4>Donation Details:</h4>
              <p><strong>Date:</strong> ${new Date(donationHistory.donation_date).toLocaleDateString()}</p>
              <p><strong>Time:</strong> ${donationHistory.donation_time}</p>
              <p><strong>Blood Type:</strong> ${donationHistory.blood_type}</p>
              <p><strong>Volume:</strong> ${donationHistory.volume_ml}ml</p>
              <p><strong>Donation Type:</strong> ${donationHistory.donation_type.replace('_', ' ')}</p>
            </div>
            <p><strong>Next Eligible Donation Date:</strong> ${new Date(donationHistory.next_eligible_date).toLocaleDateString()}</p>
            <p>We'll send you a reminder when you're eligible to donate again.</p>
          </div>
          <div class="footer">
            <p>&copy; 2024 LifeDrop. All rights reserved.</p>
            <p>You're a hero! Thank you for saving lives.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  getDonationReminderTemplate(donor) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #3498db; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .reminder { background: #74b9ff; color: white; padding: 10px; border-radius: 5px; text-align: center; margin: 20px 0; }
          .button { background: #3498db; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0; }
          .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Time to Donate Again!</h1>
          </div>
          <div class="content">
            <h2>Hello ${donor.first_name} ${donor.last_name},</h2>
            <div class="reminder">
              <h3>🩸 You're eligible to donate blood again!</h3>
            </div>
            <p>It's been 8 weeks since your last donation, which means you're now eligible to donate blood again.</p>
            <p>Your previous donations have helped save lives, and we hope you'll continue to be part of our life-saving community.</p>
            <p>Schedule your next donation today and continue making a difference!</p>
            <a href="${process.env.CLIENT_URL}/donate" class="button">Schedule Donation</a>
          </div>
          <div class="footer">
            <p>&copy; 2024 LifeDrop. All rights reserved.</p>
            <p>Thank you for being a regular life-saver!</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  getHospitalVerificationTemplate(hospitalAdmin, hospital) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #27ae60; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .success { background: #2ecc71; color: white; padding: 10px; border-radius: 5px; text-align: center; margin: 20px 0; }
          .button { background: #27ae60; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0; }
          .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Hospital Account Verified!</h1>
          </div>
          <div class="content">
            <h2>Hello ${hospitalAdmin.first_name} ${hospitalAdmin.last_name},</h2>
            <div class="success">
              <h3>✅ ${hospital.name} has been successfully verified!</h3>
            </div>
            <p>Congratulations! Your hospital account has been verified and is now active on the LifeDrop platform.</p>
            <p>You can now:</p>
            <ul>
              <li>Create blood requests</li>
              <li>Manage donor responses</li>
              <li>Update hospital information</li>
              <li>Track donation history</li>
            </ul>
            <a href="${process.env.CLIENT_URL}/hospital/dashboard" class="button">Access Dashboard</a>
          </div>
          <div class="footer">
            <p>&copy; 2024 LifeDrop. All rights reserved.</p>
            <p>Welcome to the LifeDrop community!</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  getEmergencyBloodRequestTemplate(bloodRequest) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #e74c3c; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .emergency { background: #ff3838; color: white; padding: 15px; border-radius: 5px; text-align: center; margin: 20px 0; }
          .details { background: white; padding: 15px; border-radius: 5px; margin: 20px 0; }
          .button { background: #e74c3c; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0; }
          .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>EMERGENCY BLOOD REQUEST</h1>
          </div>
          <div class="content">
            <div class="emergency">
              <h2>🚨 CRITICAL: ${bloodRequest.blood_type} Blood Needed IMMEDIATELY</h2>
            </div>
            <p>This is an emergency blood request. A patient's life depends on immediate blood donation.</p>
            <div class="details">
              <h4>Emergency Details:</h4>
              <p><strong>Patient:</strong> ${bloodRequest.patient_name}</p>
              <p><strong>Blood Type:</strong> ${bloodRequest.blood_type}</p>
              <p><strong>Location:</strong> ${bloodRequest.location}</p>
              <p><strong>Emergency Contact:</strong> ${bloodRequest.contact_person} - ${bloodRequest.contact_phone}</p>
              <p><strong>Medical Condition:</strong> ${bloodRequest.medical_condition || 'Critical'}</p>
            </div>
            <p><strong>URGENT:</strong> If you are available to donate immediately, please respond now!</p>
            <a href="${process.env.CLIENT_URL}/blood-requests/${bloodRequest.id}" class="button">RESPOND NOW</a>
          </div>
          <div class="footer">
            <p>&copy; 2024 LifeDrop. All rights reserved.</p>
            <p>Every second counts - Thank you for your immediate response!</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}

module.exports = new EmailService();