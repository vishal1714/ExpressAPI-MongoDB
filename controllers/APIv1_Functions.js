const Employee = require("../models/EmployeeSchema");
const APIUser = require("../models/APIUserSchema");
const { Log } = require("./APILogManager");
const moment = require("moment-timezone");
const { getCacheAsync, setCacheAsync } = require("../config/Cache");

//@dec      Get All Employees
//@dec      Get All Employees
//@route    GET /api/v1/employees
//@access   Public
exports.GetEmployees = async (req, res, next) => {
  try {
    if (process.env.CACHE == "ON") {
      const getEmployeesfromCache = await getCacheAsync("EmployeesList");
      if (getEmployeesfromCache) {
        //console.log("Loding from Cacahe");
        const data = JSON.parse(getEmployeesfromCache);
        const Resposne = {
          Status: "Success",
          Count: data.length,
          Data: data,
        };
        res.status(200).json(Resposne);
        return;
      }
      const getemployees = await Employee.find().select("-__v");
      const setData = await setCacheAsync(
        "EmployeesList",
        JSON.stringify(getemployees),
        "EX",
        10
      );
      //console.log("Refreshed Cache");
      const Resposne = {
        Status: "Success",
        Count: getemployees.length,
        Data: getemployees,
      };
      //Send Success Response
      res.status(200).json(Resposne);
    } else {
      //console.log("Cache if Off");
      const getemployees = await Employee.find().select("-__v");
      const Resposne = {
        Status: "Success",
        Count: getemployees.length,
        Data: getemployees,
      };
      //Send Success Response
      res.status(200).json(Resposne);
    }
  } catch (err) {
    console.log(err);
    //Send Error
    res.status(500).json({
      Error: {
        Status: 500,
        Message: "Internal Server Error",
        info: err,
      },
    });
  }
};

//@dec      Get Employee By Employee ID
//@route    GET /api/v1/employee/:id
//@access   Public
exports.GetEmployeeByID = async (req, res, next) => {
  try {
    const getemployeebyid = await Employee.findById(req.params.id).select(
      "-__v"
    );

    //id Employee not found in DB
    if (!getemployeebyid) {
      res.status(404).json({
        Error: {
          Status: 404,
          Message: "Employee not found",
        },
      });
    } else {
      //Send Success Response
      return res.status(200).json({
        Status: "Success",
        Data: getemployeebyid,
        Message: "Successfully! Record has been fetched.",
      });
    }
  } catch (err) {
    //Send Error
    res.status(500).json({
      Error: {
        Status: 500,
        Message: "Internal Server Error",
        Info: err,
      },
    });
  }
};

//@dec      Add Employee in DB
//@route    POST /api/v1/employee/add
//@access   Private (Client API-KEY)
exports.AddEmployee = async (req, res, next) => {
  var IP = req.header("X-Real-IP");
  const APIClientInfo = await APIUser.findOne({
    APIClientID: req.header("API-Client-ID"),
    APISecretKey: req.header("API-Secret-Key"),
  });
  //console.log(APIClientInfo);
  if (
    APIClientInfo &&
    APIClientInfo.APICallLimit != APIClientInfo.APICalls &&
    APIClientInfo.APICallLimit >= APIClientInfo.APICalls &&
    APIClientInfo.ActivationStatus === 1
  ) {
    try {
      //Copturaing API Request
      const { Name, PhoneNo, Age, Department, Salary } = req.body;
      const addemployee = await Employee.create(req.body);
      const Response = {
        Status: "Success",
        Data: addemployee,
        Message: "Successfully! Record has been inserted.",
      };

      await APIUser.updateOne(
        {
          APIClientID: req.header("API-Client-ID"),
          APISecretKey: req.header("API-Secret-Key"),
        },
        {
          $inc: {
            APICalls: 1,
          },
        }
      );

      //Send Response
      res.status(201).json(Response);

      //Log
      Log(req, Response, IP, APIClientInfo.APIClientID, "Add Employee");
    } catch (err) {
      //if Valid Error Found
      if (err.name == "ValidationError") {
        const messages = Object.values(err.errors).map((val) => val.message);
        const Response = {
          Error: {
            Status: 400,
            Message: "Bad Request",
            Info: messages,
          },
        };
        res.status(400).json(Response);
        Log(req, Response, IP, APIClientInfo.APIClientID, "Add Employee");
      } else {
        const Response = {
          Error: {
            Status: 500,
            Message: "Internal Server Error",
          },
        };
        res.status(500).json(Response);
        //Send Error
        Log(req, Response, IP, APIClientInfo.APIClientID, "Add Employee");
      }
    }
  } else {
    //if API-Key is not valid
    res.status(401).json({
      Error: {
        Status: 401,
        Message: "Unauthorized",
      },
    });
  }
};

//@dec      Delete Employee using Employee ID
//@route    DELETE /api/v1/employee/:id
//@access   Private (Client API-KEY)
exports.DelEmployeeByID = async (req, res, next) => {
  var IP = req.header("X-Real-IP");
  const APIClientInfo = await APIUser.findOne({
    APIClientID: req.header("API-Client-ID"),
    APISecretKey: req.header("API-Secret-Key"),
  });
  //Validate API-Key
  if (
    APIClientInfo &&
    APIClientInfo.APICallLimit != APIClientInfo.APICalls &&
    APIClientInfo.APICallLimit >= APIClientInfo.APICalls &&
    APIClientInfo.ActivationStatus === 1
  ) {
    try {
      const delemployee = await Employee.findById(req.params.id).select("-__v");
      const reqbody = {
        _id: req.params.id,
      };
      //if Employee not found in DB
      if (!delemployee) {
        const Response = {
          Error: {
            Status: 404,
            Message: "Employee Not Found",
          },
        };
        //Send Response
        Log(req, Response, IP, APIClientInfo.APIClientID, "Delete Employee");
        return res.status(404).json(Response);
      } else {
        //Remove Employee
        await delemployee.remove();
        const Response = {
          Status: "Success",
          Data: delemployee,
          Message: "Successfully! Record has been deleted.",
        };

        await APIUser.updateOne(
          {
            APIClientID: req.header("API-Client-ID"),
            APISecretKey: req.header("API-Secret-Key"),
          },
          {
            $inc: {
              APICalls: 1,
            },
          }
        );

        //Send Response
        res.status(200).json(Response);
        //Log
        Log(req, Response, IP, APIClientInfo.APIClientID, "Delete Employee");
      }
    } catch (err) {
      const Response = {
        Error: {
          Status: 500,
          Message: "Internal Server Error",
          Info: err,
        },
      };
      //Send Error
      res.status(500).json(Response);
      //Log
      Log(req, Response, IP, APIClientInfo.APIClientID, "Delete Employee");
    }
  } else {
    //if APi-Key is not valid
    res.status(401).json({
      Error: {
        Status: 401,
        Message: "Unauthorized",
      },
    });
  }
};

//@dec      Update Employee
//@route    PATCH /api/v1/employee/update
//@access   Private (Client API-KEY)
exports.UpdateEmployee = async (req, res, next) => {
  var date = moment().tz("Asia/Kolkata").format("MMMM Do YYYY, hh:mm:ss A");
  var IP = req.header("X-Real-IP");
  const APIClientInfo = await APIUser.findOne({
    APIClientID: req.header("API-Client-ID"),
    APISecretKey: req.header("API-Secret-Key"),
  });
  //Validate API-Key
  if (
    APIClientInfo &&
    APIClientInfo.APICallLimit != APIClientInfo.APICalls &&
    APIClientInfo.APICallLimit >= APIClientInfo.APICalls &&
    APIClientInfo.ActivationStatus === 1
  ) {
    try {
      //Capture Request Body
      const { EmpRefNo, Name, PhoneNo, Age, Department, Salary } = req.body;
      //if _id is not present in RequestBody
      if (
        EmpRefNo == null ||
        Name == null ||
        PhoneNo == null ||
        Age == null ||
        Department == null ||
        Salary == null
      ) {
        //Send Error
        const Response = {
          Error: {
            Status: 400,
            Message: "Some fields are not present in request body",
          },
        };
        //Send Response
        res.status(400).json(Response);
        //Log
        Log(req, Response, IP, APIClientInfo.APIClientID, "Update Method");
      } else {
        //Update Emplyee Info
        const updateemployee = await Employee.findOneAndUpdate(
          { _id: EmpRefNo },
          {
            $set: {
              Name: Name,
              PhoneNo: PhoneNo,
              Age: Age,
              Department: Department,
              Salary: Salary,
              ModifiedAt: date,
            },
          },
          { new: true }
        ).select("-__v");

        if (!updateemployee) {
          const Response = {
            Status: 400,
            Message: "Something went wrong",
          };
          res.status(400).json(Response);
          //Log
          Log(req, Response, IP, APIClientInfo.APIClientID, "Update Method");
        } else {
          const Response = {
            Status: "Success",
            Data: updateemployee,
            Message: "Successfully! Record has been updated.",
          };

          await APIUser.updateOne(
            {
              APIClientID: req.header("API-Client-ID"),
              APISecretKey: req.header("API-Secret-Key"),
            },
            {
              $inc: {
                APICalls: 1,
              },
            }
          );
          //Send Success Response
          res.status(200).json(Response);
          //Log
          Log(req, Response, IP, APIClientInfo.APIClientID, "Update Method");
        }
      }
    } catch (err) {
      //send Error
      var Response = {
        Error: {
          Status: 500,
          Message: "Internal Server Error",
          Info: err,
        },
      };
      res.status(500).json(Response);
      Log(req, Response, IP, APIClientInfo.APIClientID, "Update Method");
    }
  } else {
    //API-Key is not valid
    res.status(401).json({
      Error: {
        Status: 401,
        Message: "Unauthorized",
      },
    });
  }
};
