import nodemailer from 'nodemailer';

class MailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: true,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD
            }
        })
    }

    sendActivationMail = async (to, link) => {
        await this.transporter.sendMail({
            from: process.env.SMTP_USER,
            to,
            subject: "Account activation" + process.env.API_URL,
            text: '',
            html:
                `
                    <div>
                        <h1>Please activate your account in PlannerEvTor</h1>
                        <a href="${link}">Click to activate your accaunt</a>
                    </div>
            `
        })
    };
    sendInvitationMail = async (userCreator, usersShared, event, type) => {
        const createSubject = ()=>{
            if(type === "create")return "You have new invitation from " + userCreator.firstName + " " + userCreator.lastName + " via PlannerEvTor"
            if(type === "update")return userCreator.firstName + " " + userCreator.lastName + " updated event" + " via PlannerEvTor"
            if(type === "delete")return userCreator.firstName + " " + userCreator.lastName + " canceled event" + " via PlannerEvTor"
        }
        const subject = createSubject();
        const createTitle = ()=>{
            if(type === "create")return userCreator.firstName + " " + userCreator.lastName + " invites you" + " via PlannerEvTor"
            if(type === "update")return userCreator.firstName + " " + userCreator.lastName + " updated event" + " via PlannerEvTor"
            if(type === "delete")return userCreator.firstName + " " + userCreator.lastName + " canceled event" + " via PlannerEvTor"
        }
        const title = createTitle();
        const usersSharedEmails = usersShared.map((user) => {
            return user.email || [];
        });
        const startDate = new Date(event.startDate).toISOString();
        const endDate = new Date(event.endDate).toISOString();
        const showTime = (date) => {
            if(date.slice(11, 16)[0] === "0")
            {return date.slice(12, 16)}
            else {return date.slice(11, 16)}
        };
        const showDate = (date) => {
            return date.slice(0, 10)
        };

        const calculateTime =()=>{
            return showDate(startDate) + " at " + showTime(startDate) + " - " + showTime(endDate);

        }
        const time = calculateTime().toString();
        const createGuestList = ()=>{
            const guests = usersShared.map(user =>{
                let checkAccept = "no answer";
                const acceptance = event.user.filter(userInvited =>
                    userInvited.user_id.toString() === user._id.toString()
                );
                if(acceptance[0].accepted){
                    checkAccept = "accepted"
                }
                return `${user.firstName} ${user.lastName} (${checkAccept})`
            });
            const userCreatorName = `${userCreator.firstName} ${userCreator.lastName} (creator)`;
            guests.unshift(userCreatorName);
            return guests.toString();
        }
        const guestList = createGuestList();
        await this.transporter.sendMail({
            from: process.env.SMTP_USER,
            to: usersSharedEmails,
            subject,
            text: '',
            html:
                `
                 <h2 style="text-align: center; color: ${event.color}">${title}</h2>
                 <div style="
                    border-radius: 1rem;
                    width: 100%;
                    min-width: 36vw;
                    max-width: 20rem;
                    min-height: 8rem;
                    max-height: 15rem;
                    color: #f0f0f0;
                    margin: 0.25rem auto;
                    padding: 0.5rem 1rem;
                    background-color: ${event.color};
                 ">       
                        <div style="
                    font-size: 1rem;
                    line-height: 1.1rem;
                    padding: 0 0.5rem;
                    font-weight: bold;
                    text-align: center;
                    min-height: 2rem;
                    max-height: 6rem;
                        ">${event.description}
                        </div>
                        <div style="
                    font-size: 0.8rem;
                    font-weight: bold;
                    width: 100%;
                    height: 1rem;
                    margin: 0.2rem 0;
                        ">
                        ${time}
                        </div>
                        <div style="
                    font-size: 0.8rem;
                    line-height: 1rem;
                    font-weight: 400;
                    min-height: 2rem;
                    max-height: 6rem;
                        ">
                        Guest list: ${guestList}
                        </div>
                        <div style="
                            width: 100%;
                            text-align: end;
                            ">
                        <a href="${process.env.CLIENT_URL}/invites">
                        <button style="
                    width: 8rem;
                    height: 2rem;
                    padding: 0.15rem 0.5rem;
                    font-size: 0.7rem;
                    font-weight: bold;
                    border-radius: 2rem;
                    color: #0057FF;
                    background: #DEE9FF;
                    border: 2px solid #0057FF;
                    box-shadow: 0px 1px 10px #0057FF;
                         ">
                        Accept/decline              
                        </button>
                        </a>
                    </div>
                    </div>
            `
        })
    }

    sendAcceptanceMail = async (userCreator, userInvited, usersShared, event, type) => {
        const createSubject = ()=>{
            if(type === "accept") {
                return userInvited.firstName + " " + userInvited.lastName + " accepted your event via PlannerEvTor"
            }
            if(type === "decline") {
                return userInvited.firstName + " " + userInvited.lastName + " declined your event via PlannerEvTor"
            }
        }
        const subject = createSubject();
        const createTitle = ()=>{
            if(type === "accept") {
                return userInvited.firstName + " " + userInvited.lastName + " accepted your event via PlannerEvTor"
            }
            if(type === "decline") {
                return userInvited.firstName + " " + userInvited.lastName + " declined your event via PlannerEvTor"
            }
        }
        const pickColor =()=>{
            if(type === "accept") {
                return "#008720"
            }
            if(type === "decline") {
                return "#6e0000"
            }
        }
        const title = {
            titleText: createTitle(),
            titleColor: pickColor()
        };
        const startDate = new Date(event.startDate).toISOString();
        const endDate = new Date(event.endDate).toISOString();
        const showTime = (date) => {
            if(date.slice(11, 16)[0] === "0")
            {return date.slice(12, 16)}
            else {return date.slice(11, 16)}
        };
        const showDate = (date) => {
            return date.slice(0, 10)
        };

        const calculateTime =()=>{
            return showDate(startDate) + " at " + showTime(startDate) + " - " + showTime(endDate);

        }
        const time = calculateTime().toString();
        const createGuestList = ()=>{
            const guests = usersShared.map(user =>{
                let checkAccept = "no answer";
                const acceptance = event.user.filter(userInvited =>
                    userInvited.user_id.toString() === user._id.toString()
                );
                if(acceptance[0].accepted){
                    checkAccept = "accepted"
                }
                return `${user.firstName} ${user.lastName} (${checkAccept})`
            });
            const userCreatorName = `${userCreator.firstName} ${userCreator.lastName} (creator)`;
            guests.unshift(userCreatorName);
            return guests.toString();
        }
        const guestList = createGuestList();
        await this.transporter.sendMail({
            from: process.env.SMTP_USER,
            to: userCreator.email,
            subject,
            text: '',
            html:
                `
                 <h2 style="text-align: center; color: ${title.titleColor}">${title.titleText}</h2>
                 <div style="
                    border-radius: 1rem;
                    width: 100%;
                    min-width: 36vw;
                    max-width: 20rem;
                    min-height: 8rem;
                    max-height: 15rem;
                    color: #ffffff;
                    margin: 0.25rem auto;
                    padding: 0.5rem 1rem;
                    background-color: ${event.color};
                 ">       
                        <div style="
                    font-size: 1rem;
                    line-height: 1.1rem;
                    padding: 0 0.5rem;
                    font-weight: bold;
                    text-align: center;
                    min-height: 2rem;
                    max-height: 6rem;
                        ">${event.description}
                        </div>
                        <div style="
                    font-size: 0.8rem;
                    font-weight: bold;
                    width: 100%;
                    height: 1rem;
                    margin: 0.2rem 0;
                        ">
                        ${time}
                        </div>
                        <div style="
                    font-size: 0.8rem;
                    line-height: 1rem;
                    font-weight: 400;
                    min-height: 2rem;
                    max-height: 6rem;
                        ">
                        Guest list: ${guestList}
                        </div>
                        <div style="
                            width: 100%;
                            text-align: end;
                            ">
                        <a href="${process.env.CLIENT_URL}">
                        <button style="
                    width: 8rem;
                    height: 2rem;
                    padding: 0.15rem 0.5rem;
                    font-size: 0.7rem;
                    font-weight: bold;
                    border-radius: 2rem;
                    color: #0057FF;
                    background: #DEE9FF;
                    border: 2px solid #0057FF;
                    box-shadow: 0px 1px 10px #0057FF;
                         ">
                        Show my events                
                        </button>
                        </a>
                    </div>
                    </div>
            `
        })}

}

const mailService = new MailService();
export default mailService;