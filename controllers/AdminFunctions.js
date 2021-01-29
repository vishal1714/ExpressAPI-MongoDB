const APILog = require('../models/APILogSchema');
const APIUser = require('../models/APIUserSchema');
const moment = require('moment-timezone');
const crypto = require('crypto');
const dotenv = require('dotenv');
const RandomString = require('randomstring');
const {SendEmail} = require('./Email/SendMail')

dotenv.config({ path: './config/config.env' });

const AdminAPIKey = process.env.AdminAPIKey;

var Hash = (string) => {
  return crypto.createHash(process.env.HashAlgo).update(string).digest('hex');
}

//@dec      Get API Logs
//@route    /apiadmin/log
//@access   Private (Admin Only with API-KEY)
exports.GetAPIlog = async (req, res, next) => {
  try {
    const getapilog = await APILog.find().select('-__v');
    //Send Success Response
    res.status(200).json({
      Status: 'Success',
      Count: getapilog.length,
      Log: getapilog,
    });
  } catch (err) {
    console.log(err);
    //Send Error
    res.status(500).json({
      Error: {
        message: 'Internal Server Error',
        info: err,
      },
    });
  }
};

//@dec      Add API Client with Key
//@route    POST /APIUser/createKey
//@access   Private (Admin Only with API-KEY)
exports.AddUser = async (req, res) => {
  var reqKey = req.header('API-Admin-Key');
  var IP = req.header('X-Real-IP');

  if (reqKey == AdminAPIKey) {
    try {
      const { Username, Email, Password  } = req.body;
      const ActivationKey = RandomString.generate({
        length: 32,
      });
      
      const addUserReq =  {
        Username : Hash(Username),
        Email : Email,
        Password : Hash(Password),
        ActivationKey : ActivationKey
      }
      const addUser = await APIUser.create(addUserReq);
      SendEmail(Email, ActivationKey , addUser._id);
      res.status(200).json({
        Status: 'Successful',
        Data: addUser,
        Message: 'API user has been created',
      });
    } catch (err) {
      //console.log(err);
      res.status(500).json({
        Error: {
          message: 'Internal Server Error',
          info: err.message,
        },
      });
    }
  } else {
    //if API-Key is not valid
    res.status(401).json({
      Error: {
        message: 'Unauthorized ( Who are you Dude ?)',
      },
    });
  }
};

//@dec      Update API Client with Key
//@route    POST /APIUser/updateUserKey
//@access   Private (Admin Only with API-KEY)
exports.UpdateUser = async (req, res) => {
  var date = moment().tz('Asia/Kolkata').format('MMMM Do YYYY, hh:mm:ss A');
  var reqKey = req.header('API-Admin-Key');

  if (reqKey == AdminAPIKey) {
    
      if (req.body.Username == null) {
        //Send Error
        const Response = {
          Error: {
            message: 'UserName not present in request body',
          },
        };
        //Send Response
        res.status(400).json(Response);
      }

      const APIClientInfo = await APIUser.findOne({
        Username: Hash(req.body.Username),
        Password: Hash(req.body.Password),
      });
      if(APIClientInfo) {
      try {
      //Update Key Inf
      const updateKey = await APIUser.updateOne(
        { Username: Hash(req.body.Username), Password: Hash(req.body.Password)    },
        {
          $set: {
            APIClientID: req.body.APIClientID,
            APISecretKey: req.body.APISecretKey,
            ModifiedAt: date,
          },
        }
      ).select('-__v');
      //console.log(updateKey)
        const Response = {
          Status: 'Success',
          Data: req.body,
          Message: 'Successfully! Key has been updated.',
        };
        res.status(200).json(Response);
      }
     catch (err) {
      var Response = {
        Error: {
          message: 'Internal Server Error',
          info: err,
        },
      };
      res.status(500).json(Response);
    }
  }
    else {
      const Responsefailed = {
        Status: 'Failed',
        Message: 'Username or Password is not Valid!.',
      };
      res.status(400).json(Responsefailed);
    }
  } else {
    //if API-Key is not valid
    res.status(401).json({
      Error: {
        message: 'Unauthorized',
      },
    });
  }
};

//@dec      Get API Client Status
//@route    /apiadmin/apiStatus
//@access   Public
exports.UserStatus = async (req, res, next) => {
  try {
    const {Username , Password} = req.body;
    if (Username != undefined && Password != undefined) {
      const APIClientResponse = await APIUser.findOne({
        Username: Hash(Username),
        Password: Hash(Password),
      }).select('-Username').select('-Password');
      if (APIClientResponse == null) {
        const Response = {
          Error: {
            message: 'User Credentials are Incorrect or Not Found',
          }
        }
        res.status(404).json(Response);
      } else {
        const Response = {
          APIStatus : APIClientResponse
        }
        res.status(200).json(Response);
      }

    } else {
      res.status(400).json({
        Error: {
          message: 'Username or Password is missing',
        },
      })
    }
  } catch (err) {
    console.log(err);
    //Send Error
    res.status(500).json({
      Error: {
        message: 'Internal Server Error',
        info: err,
      },
    });
  }
};

exports.AccountActivation = async(req,res,next) => {
  const Key = req.query.Key;
  const User = req.query.User;
  try {
    if (Key != null && User != null) {
      const APIClient = await APIUser.findOneAndUpdate(
        { ActivationKey: Key,
          _id: User,},
        {
          $set: {
            ActivationStatus : 1
          },
        },{new: true});

        if(APIClient){
          res.status(200).json({
            Status: "Successful",
            Message : "Your Account is verified "
          })
        }else{
          res.status(404).json({
            Status : "Failed",
            Message : "Account not found"
          })
        }
      
    } else {
      res.status(404).json({
        status : "Failed",
        Message : "Key or User Query is missing from URL"})
    }
  } catch (error) {
    res.status(500).json({
      status : "Failed",
      info : error
    })
  }
}
