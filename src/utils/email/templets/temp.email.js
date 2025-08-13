export const emailTemplate = ({ username, otp }) => `
  <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');
        
        body {
          font-family: 'Poppins', Arial, sans-serif;
          background: #111;
          padding: 0;
          margin: 0;
        }

        .container {
          max-width: 450px;
          background: #1c1c1c;
          margin: 40px auto;
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0 4px 25px rgba(255,0,0,0.2);
          text-align: center;
          color: white;
          animation: fadeIn 0.8s ease-in-out;
        }

        h2 {
          color: #ff1e1e;
          margin-bottom: 10px;
        }

        p {
          color: #ddd;
          font-size: 14px;
          line-height: 1.5;
        }

        .otp-box {
          display: inline-block;
          font-size: 24px;
          letter-spacing: 10px;
          background: linear-gradient(135deg, #ff1e1e, #990000);
          padding: 14px 24px;
          border-radius: 8px;
          margin: 20px 0;
          font-weight: bold;
          color: white;
          box-shadow: 0 4px 15px rgba(255,0,0,0.3);
          animation: pulse 1.5s infinite;
        }

        .footer {
          font-size: 12px;
          color: #888;
          margin-top: 20px;
        }

        
        /* Mobile responsive */
        @media (max-width: 500px) {
          .container {
            width: 90%;
            padding: 15px;
          }
          .otp-box {
            font-size: 20px;
            letter-spacing: 6px;
            padding: 12px 18px;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h2>Hello ${username} 👋</h2>
        <p>Use the OTP code below to complete your verification process:</p>
        <div class="otp-box">${otp}</div>
        <p class="footer">This OTP will expire in 2 minutes. Please do not share it with anyone.</p>
      </div>
    </body>
  </html>
`;
