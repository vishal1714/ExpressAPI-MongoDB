const Employee = require('../models/EmployeeSchema');
const crypto = require('crypto');
const moment = require('moment-timezone');
const algorithm = 'aes-256-cbc';

//@dec      Get Employees
//@route    GET /
//@access   Public
exports.GetRenderEmployees = async (req, res, next) => {
  try {
    const GetEmployees = await Employee.find().select('-__v');
    res.render('index', { GetEmployees });
  } catch (err) {
    console.log(messages);
    res.render('index', { messages: 'Internal Server Error' });
  }
};

//@dec      Get Employee By ID for Update
//@route    GET /get
//@access   Public
exports.GetRenderEmployeeByID = async (req, res, next) => {
  try {
    const getemployeebyid = await Employee.findById(req.params.id).select(
      '-__v'
    );

    //id Employee not found in DB
    if (!getemployeebyid) {
      res.render('updateemployee', { messages: 'Employee Not Found' });
    } else {
      //Send Success Response
      console.log(getemployeebyid);
      res.render('updateemployee', { getemployeebyid });
    }
  } catch (err) {
    //Send Error
    res.status(500).json({
      Error: {
        message: 'Internal Server Error',
        info: err,
      },
    });
  }
};

//@dec      Add Employees
//@route    POST /add
//@access   Public
exports.AddRenderEmployee = async (req, res, next) => {
  try {
    const { Name, PhoneNo, Department, Age, Salary } = req.body;
    const EmployeeAdd = await Employee.create(req.body);
    const Response = {
      Status: 'Success',
      Data: EmployeeAdd,
      Message: 'Successfully! Record has been inserted.',
    };
    //console.log(AResponse);
    res.render('addemployee', {
      AddResponse: JSON.stringify(Response),
      AddRequest: JSON.stringify(req.body),
    });
  } catch (err) {
    if (err.name == 'ValidationError') {
      const messages = Object.values(err.errors).map((val) => val.message);
      res.render('addemployee', { messages });
    } else {
      res.render('addemployee', { messages: 'Internal Server Error' });
    }
  }
};

//@dec      Update Employee
//@route    POST /update
//@access   Public
exports.UpdateRenderEmployee = async (req, res, next) => {
  var date = moment().tz('Asia/Kolkata').format('MMMM Do YYYY, hh:mm:ss A');
  try {
    const { EmpRefNo, Name, PhoneNo, Department, Age, Salary } = req.body;
    console.log(req.body);
    if (
      EmpRefNo == null ||
      Name == null ||
      PhoneNo == null ||
      Age == null ||
      Department == null ||
      Salary == null
    ) {
      res.render('updateemployee', { messages: 'Employee _id is not found' });
    } else {
      const employee = await Employee.findOneAndUpdate(
        { _id: req.body.EmpRefNo },
        {
          $set: {
            Name: req.body.Name,
            PhoneNo: req.body.PhoneNo,
            Age: req.body.Age,
            Department: req.body.Department,
            Salary: req.body.Salary,
            ModifiedAt: date,
          },
        },
        { new: true }
      ).select('-__v');

      if (!employee) {
        const messages = {
          Status: 'Failed',
          Message: 'Username or Password is not Valid!.',
        };
        res.render('updateemployee', { messages });
      } else {
        const Response = {
          Status: 'Success',
          Data: employee,
          Message: 'Successfully! Record has been updated.',
        };
        //console.log(employee);
        res.render('updateemployee', {
          UpdateResponse: JSON.stringify(Response),
          UpdateRequest: JSON.stringify(req.body),
        });
      }
    }
  } catch (messages) {
    res.render('updateemployee', { messages });
  }
};

//@dec      Delete Employee by ID
//@route    DELETE /del/:id
//@access   Public
exports.DelRenderEmployeeByID = async (req, res, next) => {
  try {
    const employee = await Employee.findById(req.params.id).select('-__v');
    if (!employee) {
      res.render('index', { messages: 'Employee _id is not found' });
    } else {
      await employee.remove();
      res.redirect('/');
    }
  } catch (messages) {
    res.render('index', { messages });
  }
};

//@dec      Encrypte Request
//@route    POST /encrypt
//@access   Public
exports.encryptAPI = async (req, res, next) => {
  try {
    const { plaintext, key } = req.body;
    const iv = crypto.randomBytes(16);
    let cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
    let encrypted = cipher.update(plaintext);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    const Hash = crypto.createHash('sha256').update(plaintext).digest('hex');
    const response = {
      Refno: iv.toString('hex'),
      EncData: encrypted.toString('hex'),
    };
    const aresponse = JSON.stringify(response);
    //console.log(aresponse);
    res.render('encdec', { enresponse: aresponse, encHash: Hash });
  } catch (err) {
    //console.log(err);
    res.render('encdec', { messages: 'Internal Server Error' });
  }
};

//@dec      decrypte Request
//@route    POST /decrypt
//@access   Public
exports.decryptAPI = async (req, res, next) => {
  try {
    const { plaintext, key } = req.body;
    const text = JSON.parse(plaintext);
    const { Refno, EncData } = text;
    let iv = Buffer.from(Refno, 'hex');
    let encryptedText = Buffer.from(EncData, 'hex');
    let decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    const response = decrypted.toString();
    const Hash = crypto.createHash('sha256').update(response).digest('hex');
    res.render('encdec', { deresponse: response, decHash: Hash });
  } catch (error) {
    console.log(error);
    res.render('encdec', { messages: 'Internal Server Error' });
  }
};
