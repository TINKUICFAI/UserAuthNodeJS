const express = require("express");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

const User = require("../../models/User.js");
const utils = require("../../utils/utils.js");
const { createJsonResponse } = require("../../utils/serverResponse.js");

const nodemailer = require("nodemailer");

const UserRouter = express.Router();

/**
 * @route GET "/api/User/"
 */
UserRouter.get(
    "/",
    asyncHandler(async (req, res) => {
        // Get all Users
        const [allUserRows] = await User.getAllUsers();

        return res.json(createJsonResponse(200, "Successfull", allUserRows));
    })
);

/**
 * @route GET "/api/User/:id"
 */
UserRouter.get(
    "/:id",
    asyncHandler(async (req, res) => {
        // Get User by id
        const [UserRow] = await User.getUserById(req.params.id);

        return res.json(createJsonResponse(200, "Successfull", UserRow));
    })
);

/**
 * @route POST "/api/User/insert"
 */
UserRouter.post(
    "/insert",
    [
        body("email")
            .exists()
            .withMessage("email must be exist")
            .bail()
            .notEmpty()
            .withMessage("email should not be empty")
            .bail()
            .isEmail()
            .withMessage("email should be a valid type")
            .bail(),
        body("password")
            .exists()
            .withMessage("password must be exist")
            .bail()
            .notEmpty()
            .withMessage("password should not be empty")
            .bail(),
    ],
    asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(createJsonResponse(400, "Invalid json body", errors.array()));
        }

        const { email, password } = req.body;

        const [UserRow] = await User.getUserByEmail(email);

        if (UserRow.length > 0) {
            return res.status(400).json(createJsonResponse(400, "Already exists"));
        }

        await User.insertUser({ ...req.body, password: utils.encryptPassword(password) });

        console.log("request came");
        let user = req.body;
        // console.log("User", user) ;
        // sendMail(user, info => {
        //   console.log(`The mail has beed send 😃 and the id is ${info.messageId}`);
        //   res.send(info);
        // });
        sendMail(user)

        
/**
 * 
 * SEnding email to user
 *  */

function sendMail(user) {
    // create reusable transporter object using the default SMTP transport
    // console.log("djshfgsdhfjh",user)
    let mailTransporter = nodemailer.createTransport({
      service: 'gmail',
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
          user: 'tku22658@gmail.com',
          pass: 'Demo@1234?'
      }
  });
  
  let mailDetails = {
      from: 'tku22658@gmail.com', //-------- sender email
      to: user.email, //-------- receiver email
      subject: 'Test mail', //-------- subject do you want
      text: 'Node.js testing mail for SIT', //-------- message 
    html: `<b>Hello ${user.email}?</b> <i>Tinku Kumar Here<i>`, // html body
  };
  
  mailTransporter.sendMail(mailDetails, function (err, data) {
      if (err) {
          console.log('Error Occurs');
      } else {
          console.log('Email sent successfully');
      }
  });}


        return res.json(createJsonResponse(200, "Successfull", req.body));
    })
);



/**
 * @route PUT "/api/User/update"
 */
UserRouter.put(
    "/update",
    asyncHandler(async (req, res) => {
        const UserReqData = req.body;

        const [rows] = await User.updateUserById(UserReqData);

        return res.json(createJsonResponse(200, "Successfull", rows));
    })
);


/**
 * @route PUT "/api/User/verify"
 */
 UserRouter.put(
    "/verify",
    asyncHandler(async (req, res) => {
        const UserReqData = req.body;

        const [rows] = await User.verifyUser(UserReqData);

        return res.json(createJsonResponse(200, "Successfull", rows));
    })
);

/**
 * @route PUT "/api/User/updatePassword"
 */
 UserRouter.put(
    "/updatePassword",[
         body("password")
                .exists()
                .withMessage("password must be exist")
                .bail()
                .notEmpty()
                .withMessage("password should not be empty")
                .bail(),],

   
    asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(createJsonResponse(400, "Invalid json body", errors.array()));
        }

        const { password } = req.body;

        await User.updateUserPassword({ ...req.body, password: utils.encryptPassword(password) });
        // console.log("bodyjdsfjjd",req.body);
        return res.json(createJsonResponse(200, "Successfull", req.body));
       
    })
);

/**
 * @route DELETE "/api/User/:id"
 */
UserRouter.delete(
    "/:id",
    asyncHandler(async (req, res) => {
        const UserId = req.params.id;

        const [rows] = await User.deleteUserById(UserId);

        return res.json(createJsonResponse(200, "Successfull", rows));
    })
);

module.exports = UserRouter;
