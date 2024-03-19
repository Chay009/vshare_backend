const NewLogin = (username, deviceInfo, clientLocation) => {

    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true });
    
    // Create the HTML content based on the provided data
    const content = `
        <!DOCTYPE html>
        <html dir="ltr" lang="en">
        <head>
            <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
        </head>
        <body style="background-color: #f2f2f2; margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
            <div style="display:none;overflow:hidden;line-height:1px;opacity:0;max-height:0;max-width:0">VShare recent login<div> </div></div>
            <div style="max-width: 620px; margin: 0 auto; background-color: #ffffff; border-radius: 5px; box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);">
                <div style="text-align: center; padding: 20px;">
                    <img height="112" width="112" src=${process.env.CLIENT_URL}/icon_main.png style="max-width: 90px; height: auto; margin-top: 20px;">
                    <p style="font-size: 18px; line-height: 28px; margin: 16px 0; font-family: 'Arial', sans-serif; font-weight: 400; color: #333333;">
                    <span style="font-weight: 600; font-family: 'Arial Black', sans-serif; color: #00bcd4;">V</span>share, <span style="font-style: italic; color: #555555;">we care</span>
                </p>
                    <p style="font-size: 18px; line-height: 24px; margin: 0 0 10px; color: rgba(0, 0, 0, 0.7);"Vshare concerns about our user account security and user experience</p>

                </div>
                <div style="border-radius: 5px; overflow: hidden; margin: 20px; border: 1px solid rgba(0, 0, 0, 0.1);">
                    <div style="padding: 10px;">
                        <h1 style="font-size: 28px; font-weight: bold; text-align: center; margin-bottom: 20px;">Hi <strong>${username}</strong>,</h1>
                        <h2 style="font-size: 24px; font-weight: bold; text-align: center; margin-bottom: 20px;">We noticed a recent login to your VShare account.</h2>
                        <p style="font-size: 16px; line-height: 24px; margin: 0 0 10px;">Time:${formattedDate}</p>
                        <p style="font-size: 16px; line-height: 24px; margin: 0 0 10px;">Device: ${deviceInfo?.browser?.name} on ${deviceInfo?.os?.name} ${deviceInfo?.os?.version} </p>
                        ${deviceInfo.device ? `<p style="font-size: 16px; line-height: 24px; margin: 0 0 10px;">${deviceInfo.device.type} Device: ${deviceInfo.device.vendor} ${deviceInfo.device.model}</p>` : ''}
                        <p style="font-size: 16px; line-height: 24px; margin: 0 0 10px;">Location: ${clientLocation?.city}, ${clientLocation?.region}, ${clientLocation?.country_name}</p>
                        <p style="font-size: 14px; line-height: 24px; margin: 0 0 10px; color: rgba(0, 0, 0, 0.7);">*Approximate geographic location based on IP address:${clientLocation?.ip}</p>
                        <p style="font-size: 16px; line-height: 24px; margin: 20px 0;">If this was you, there's nothing else you need to do.</p>
                        <p style="font-size: 16px; line-height: 24px; margin: 20px 0;">If this wasn't you or if you have additional questions, feel free to contact us.</p>
                    </div>
                    <div style="text-align: center;">
                        <a href="/" style="color: #067df7; text-decoration: none; margin-left: 10px;" target="_blank"><img alt="Twitter" height="32" src="https://react-email-demo-bdj5iju9r-resend.vercel.app/static/slack-twitter.png" style="display: inline; outline: none; border: none; text-decoration: none;" width="32"></a>
                        <a href="/" style="color: #067df7; text-decoration: none; margin-left: 10px;" target="_blank"><img alt="LinkedIn" height="32" src="https://react-email-demo-bdj5iju9r-resend.vercel.app/static/slack-linkedin.png" style="display: inline; outline: none; border: none; text-decoration: none;" width="32"></a>
                    </div>
                </div>
                <div style="text-align: center; margin-top: 20px; padding-bottom: 8px;">
                    <p style="font-size: 12px; line-height: 24px; margin: 16px 0; color: rgba(0, 0, 0, 0.7);">© 2024 | Chaitanya Toorubilli</p>
                </div>
            </div>
        </body>
        </html>`;
    
    return content;
};

module.exports = { NewLogin };
