import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create transporter based on configuration
const createTransporter = () => {
  if (process.env.USE_GMAIL === 'true') {
    return nodemailer.createTransport({
      service: 'gmail',
      secure: process.env.SMTP_SECURE === 'true',
      port: parseInt(process.env.SMTP_PORT) || 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  } else {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }
};

const transporter = createTransporter();

// Verify email configuration
export const verifyEmailConfig = async () => {
  try {
    await transporter.verify();
    console.log('✅ Email service is ready to send emails');
    return true;
  } catch (error) {
    console.error('❌ Email service configuration error:', error.message);
    return false;
  }
};

// Send email function
export const sendEmail = async (to, subject, htmlContent, textContent = '') => {
  try {
    // Skip email sending in test environment or if email is disabled
    if (process.env.NODE_ENV === 'test' || process.env.FORCE_DEV_EMAIL === 'true') {
      console.log('📧 Email would be sent to:', to);
      console.log('📧 Subject:', subject);
      console.log('📧 Content:', textContent || htmlContent);
      return { success: true, messageId: 'test-message-id' };
    }

    const mailOptions = {
      from: `"E-Cardamom Connect" <${process.env.MAIL_FROM}>`,
      to: to,
      subject: subject,
      html: htmlContent,
      text: textContent
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully to:', to);
    console.log('📧 Message ID:', result.messageId);
    
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('❌ Error sending email to:', to, error.message);
    return { success: false, error: error.message };
  }
};

// Email templates
export const emailTemplates = {
  // Product sold notification email
  productSoldEmail: (farmerName, orderData) => {
    const subject = `🎉 Your ${orderData.productName} has been sold!`;
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Product Sold - E-Cardamom Connect</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #2E7D32, #4CAF50); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .success-icon { font-size: 48px; margin-bottom: 10px; }
          .order-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #4CAF50; }
          .detail-row { display: flex; justify-content: space-between; margin: 10px 0; padding: 8px 0; border-bottom: 1px solid #eee; }
          .detail-label { font-weight: bold; color: #2E7D32; }
          .detail-value { color: #333; }
          .amount { font-size: 24px; font-weight: bold; color: #2E7D32; text-align: center; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; padding: 20px; color: #666; font-size: 14px; }
          .button { display: inline-block; background: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="success-icon">🎉</div>
            <h1>Congratulations!</h1>
            <p>Your product has been sold successfully</p>
          </div>
          
          <div class="content">
            <p>Dear <strong>${farmerName}</strong>,</p>
            
            <p>Great news! Your cardamom product has been purchased by a customer. Here are the order details:</p>
            
            <div class="order-details">
              <h3>📦 Order Details</h3>
              <div class="detail-row">
                <span class="detail-label">Product:</span>
                <span class="detail-value">${orderData.productName}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Customer:</span>
                <span class="detail-value">${orderData.customerName}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Quantity:</span>
                <span class="detail-value">${orderData.quantity} kg</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Order ID:</span>
                <span class="detail-value">#${orderData.orderIdShort}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Order Date:</span>
                <span class="detail-value">${new Date().toLocaleDateString('en-IN')}</span>
              </div>
            </div>
            
            <div class="amount">
              💰 Order Value: ₹${orderData.amount.toLocaleString('en-IN')}
            </div>
            
            <p>The customer will proceed with payment, and you'll receive another notification once the payment is confirmed.</p>
            
            <p>Thank you for being a valued farmer on E-Cardamom Connect!</p>
          </div>
          
          <div class="footer">
            <p>This is an automated notification from E-Cardamom Connect</p>
            <p>© 2024 E-Cardamom Connect. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
    
    const text = `
Congratulations ${farmerName}!

Your ${orderData.productName} has been sold to ${orderData.customerName}.

Order Details:
- Product: ${orderData.productName}
- Customer: ${orderData.customerName}
- Quantity: ${orderData.quantity} kg
- Order Value: ₹${orderData.amount.toLocaleString('en-IN')}
- Order ID: #${orderData.orderIdShort}
- Order Date: ${new Date().toLocaleDateString('en-IN')}

You'll receive another notification once the payment is confirmed.

Thank you for being a valued farmer on E-Cardamom Connect!

This is an automated notification from E-Cardamom Connect.
    `;
    
    return { subject, html, text };
  },

  // Payment received notification email
  paymentReceivedEmail: (farmerName, orderData) => {
    const subject = `💳 Payment Received - ₹${orderData.amount.toLocaleString('en-IN')}`;
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Payment Received - E-Cardamom Connect</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #1976D2, #42A5F5); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .payment-icon { font-size: 48px; margin-bottom: 10px; }
          .payment-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #1976D2; }
          .detail-row { display: flex; justify-content: space-between; margin: 10px 0; padding: 8px 0; border-bottom: 1px solid #eee; }
          .detail-label { font-weight: bold; color: #1976D2; }
          .detail-value { color: #333; }
          .amount { font-size: 28px; font-weight: bold; color: #1976D2; text-align: center; margin: 20px 0; padding: 20px; background: #E3F2FD; border-radius: 8px; }
          .success-message { background: #E8F5E8; padding: 20px; border-radius: 8px; border-left: 4px solid #4CAF50; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; padding: 20px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="payment-icon">💳</div>
            <h1>Payment Received!</h1>
            <p>Your earnings have been confirmed</p>
          </div>
          
          <div class="content">
            <p>Dear <strong>${farmerName}</strong>,</p>
            
            <div class="success-message">
              <h3>🎉 Great News!</h3>
              <p>The payment for your cardamom order has been successfully received and confirmed.</p>
            </div>
            
            <div class="amount">
              💰 Amount Received: ₹${orderData.amount.toLocaleString('en-IN')}
            </div>
            
            <div class="payment-details">
              <h3>💳 Payment Details</h3>
              <div class="detail-row">
                <span class="detail-label">Product:</span>
                <span class="detail-value">${orderData.productName}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Customer:</span>
                <span class="detail-value">${orderData.customerName}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Quantity:</span>
                <span class="detail-value">${orderData.quantity} kg</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Order ID:</span>
                <span class="detail-value">#${orderData.orderIdShort}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Payment Date:</span>
                <span class="detail-value">${new Date().toLocaleDateString('en-IN')}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Payment Status:</span>
                <span class="detail-value" style="color: #4CAF50; font-weight: bold;">✅ Confirmed</span>
              </div>
            </div>
            
            <p>The payment has been processed successfully. You can now prepare the cardamom for delivery to the customer.</p>
            
            <p><strong>Next Steps:</strong></p>
            <ul>
              <li>Prepare your cardamom for packaging</li>
              <li>Ensure quality standards are met</li>
              <li>Wait for pickup/delivery coordination</li>
            </ul>
            
            <p>Thank you for your business with E-Cardamom Connect!</p>
          </div>
          
          <div class="footer">
            <p>This is an automated notification from E-Cardamom Connect</p>
            <p>© 2024 E-Cardamom Connect. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
    
    const text = `
Payment Received!

Dear ${farmerName},

Great news! The payment for your cardamom order has been successfully received and confirmed.

Amount Received: ₹${orderData.amount.toLocaleString('en-IN')}

Payment Details:
- Product: ${orderData.productName}
- Customer: ${orderData.customerName}
- Quantity: ${orderData.quantity} kg
- Order ID: #${orderData.orderIdShort}
- Payment Date: ${new Date().toLocaleDateString('en-IN')}
- Payment Status: ✅ Confirmed

The payment has been processed successfully. You can now prepare the cardamom for delivery to the customer.

Next Steps:
- Prepare your cardamom for packaging
- Ensure quality standards are met
- Wait for pickup/delivery coordination

Thank you for your business with E-Cardamom Connect!

This is an automated notification from E-Cardamom Connect.
    `;
    
    return { subject, html, text };
  }
};

// Send product sold email
export const sendProductSoldEmail = async (farmerEmail, farmerName, orderData) => {
  try {
    const { subject, html, text } = emailTemplates.productSoldEmail(farmerName, orderData);
    return await sendEmail(farmerEmail, subject, html, text);
  } catch (error) {
    console.error('Error sending product sold email:', error);
    return { success: false, error: error.message };
  }
};

// Send payment received email
export const sendPaymentReceivedEmail = async (farmerEmail, farmerName, orderData) => {
  try {
    const { subject, html, text } = emailTemplates.paymentReceivedEmail(farmerName, orderData);
    return await sendEmail(farmerEmail, subject, html, text);
  } catch (error) {
    console.error('Error sending payment received email:', error);
    return { success: false, error: error.message };
  }
};

export default {
  sendEmail,
  sendProductSoldEmail,
  sendPaymentReceivedEmail,
  verifyEmailConfig,
  emailTemplates
};
