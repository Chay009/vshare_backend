const VerifiedHTML=(username)=>{
    
    return (`<!DOCTYPE html>
    <html lang="en">
    
    <head>
        <meta charset="UTF-8">
    </head>
    
    <body style="background-color: #f5f5f5; margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; height: 100vh;">
        <div style="max-width: 450px; background-color: #ffffff; border-radius: 12px; box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1); padding: 30px; text-align: center; font-family: Arial, sans-serif;">
       
       
        <img alt="Vshare"  height="112" width="112" src=${process.env.CLIENT_URL}/icon_main.png style="display: block; outline: none; border: none; text-decoration: none; margin: 0 auto;" width="120">
        <p style="font-size: 18px; line-height: 28px; margin: 16px 0; font-family: 'Arial', sans-serif; font-weight: 400; color: #333333;">
        <span style="font-weight: 600; font-family: 'Arial Black', sans-serif; color: #00bcd4;">V</span>share, <span style="font-style: italic; color: #555555;">we care</span>
    </p>
    
        <p style="color: #555;padding: 10px;  font-size: 20px; margin-bottom: 20px;">Hey ${username}!</p>
        <h1 style="color: #2c3e50; font-size: 32px; font-weight: 700; margin: 20px 0; background-color: #bbfcc1; padding: 10px; border-radius: 8px;">Email Verified Successfully</h1>
            <p style="color: #555; font-size: 16px; margin-bottom: 20px;">Thank you for regisstering with us,we are always at your service</p>
           
            <div style="background-color: #d6eaf8; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
                <p style="color: #2980b9; font-size: 18px; margin: 0;">Explore our latest features and updates.</p>
            </div>
            <div style="background-color: #79cfd2; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
                <p style="color: #1f2121; font-size: 18px; margin: 0;">Get started with our user-friendly interface.</p>
            </div>
            <a href=${process.env.CLIENT_URL} style="margin-right: 10px; margin-top: 20px; background-color: #067df7; color: #fff; text-decoration: none; padding: 10px 55px; border-radius: 4px; font-size: 16px;">Login Now</a>
            <p style="color: #888; font-size: 14px; margin-top: 10px;">Connect me on social media:</p>
            <div style="margin-top: 10px;">
             
                <a href="#"><img alt="LinkedIn" src="https://react-email-demo-bdj5iju9r-resend.vercel.app/static/slack-linkedin.png" style="max-width: 32px;"></a>
            </div>
        </div>
    </body>
    
    </html>`)}

module.exports = {VerifiedHTML}