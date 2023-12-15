const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const jwt = require("jsonwebtoken")


const app = express();

require('dotenv').config();

const port = process.env.PORT;

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

app.use(async function(req, res, next) {
  try {
    req.db = await pool.getConnection();
    req.db.connection.config.namedPlaceholders = true;

    await req.db.query(`SET SESSION sql_mode = "TRADITIONAL"`);
    await req.db.query(`SET time_zone = '-8:00'`);

    await next();

    req.db.release();
  } catch (err) {
    console.log(err);

    if (req.db) req.db.release();
    throw err;
  }
});

app.use(cors());

app.use(express.json());

app.use((req , res , next) => {
  next()
})

app.post("/register" , async function(req , res) {
    try {
        let {username , password} = req.body;
        const user = {username , password }

        const [testDupes] = await req.db.query(
          `SELECT * FROM users WHERE username = :username;`,
          {
            username,
          })

        if (testDupes.length) {
          return res.json({ success: false, message: 'Username already in use', data: null , code : 409})
        }

        const query = await req.db.query(
        `INSERT INTO USERS (username , passphrase)
        VALUES (:username, :password);`,
        {
          username,
          password,
        })

        const accessToken = jwt.sign(user , process.env.JWT_KEY);

    res.json({ success: true, message: 'User successfully created', data: accessToken });
    }
    catch {
        res.json({ success: false, data: null , message : "User not created" , code : "409"})
    }
} )

app.put("/login" , async function(req ,res) {
  try {
    console.log(req.body);
    let {username , password} = req.body;
    const user = {username , password }

    const [testDupes] = await req.db.query(
      `SELECT * FROM users WHERE username = :username;`,
      {
        username,
      })
    
    console.log(testDupes);
    
    if (testDupes.length == 0) {
      return res.json({ success: false, message: 'Username not found', data: null , code : 409})
    }

    const accessToken = jwt.sign(user , process.env.JWT_KEY);

res.json({ success: true, message: 'User successfully logged in', data: accessToken });
}
catch (e) {
    console.log("Error", e.stack);
    console.log("Error", e.name);
    console.log("Error", e.message)
    res.json({ success: false, data: null , message : "User not logged in" , code : "409"})
}
})

//Authenticate Token Middleware
function authenticateToken(req , res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) {return res.sendStatus(401)};

  jwt.verify(token , process.env.JWT_KEY , (err , user) => {
    if (err) {console.log("error") ; return res.sendStatus(403)}
    req.user = user;
    next()
  })
}

app.use(authenticateToken);


//Load Method
app.put("/load" , authenticateToken, async function(req , res) {

  let {username , password} = req.user;

  let authKeyCheck = {username : req.user.username , password : req.user.password};
  let reqCheck = {username : req.body.username , password : req.body.password};
  console.log([authKeyCheck , reqCheck])

  if(JSON.stringify(authKeyCheck) != JSON.stringify(reqCheck)) {
    return (res.json({success: false, data: null , message : "AccessToken/InputFields mismatched" , code : "401"}))
  }
  try { 
        const [testArr] = await req.db.query(
          `SELECT * FROM users WHERE username = :username AND passphrase = :password;`,
          {
            username,
            password
          })

        const userID = testArr[0]["id"];

        const [userData] = await req.db.query(
          `SELECT * FROM userData WHERE userID = :userID;`,
          {userID}
        )

        let userDataExport = userData.map(x => {
          return (JSON.parse(x["dataSheet"]))
        })

        res.json({ success: true, data: userDataExport , message : "User Found" , code : "200"})
        }
  catch {
    res.json({ success: false, data: req.body , message : "User Not Found" , code : "400"})
      } 
})

//Save Method
app.put("/save" , async function(req , res) {
  let {username , password , saveData} = req.body;

  try {
    const [testArr] = await req.db.query(
      `SELECT * FROM users WHERE username = :username AND passphrase = :password;`,
      {
        username,
        password
      })
    const userIDSave = testArr[0]["id"];

    let saveDataExport = JSON.stringify(saveData);

      const addSave = await req.db.query(
        `INSERT INTO userData (dataSheet , userID)
        VALUES (:saveDataExport , :userIDSave)`,
        {
          saveDataExport,
          userIDSave
        }
      )
    res.json({ success: true, data: null , message : "Entry created" , code : "200"})
  }
  catch (e) {
    console.log("Error", e.stack);
    console.log("Error", e.name);
    console.log("Error", e.message)
    res.json({ success: false, data: null , message : "Entry not created" , code : "400"})
  }

})

//Update Method
app.put("/update" , async function(req , res) {
  let {username , password, saveData} = req.body;

  try {

    let saveDataExport = JSON.stringify(saveData);
    const targetKey = Object.keys(saveData)[0]
    let targetID = null;

    const [testArr] = await req.db.query(
      `SELECT * FROM users WHERE username = :username AND passphrase = :password;`,
      {
        username,
        password
      })
    const userIDSave = testArr[0]["id"];

    const [userData] = await req.db.query(
      `SELECT * FROM userData WHERE userID = :userIDSave;`,
      {userIDSave}
    )
    
      console.log(userData)

    userData.forEach(x => {
      if (Object.keys(JSON.parse(x.dataSheet))[0] == targetKey) {
        targetID = x.id
      }
    });

      const updateSave = await req.db.query(
        `UPDATE userData
        SET dataSheet = :saveDataExport
        WHERE id = :targetID`,
        {
          saveDataExport,
          targetID
        }
      )
    res.json({ success: true, data: null , message : "Entry Updated" , code : "200"})
  }
  catch (e) {
    console.log("Error", e.stack);
    console.log("Error", e.name);
    console.log("Error", e.message)
    res.json({ success: false, data: null , message : "Entry not Updated" , code : "400"})
  }

})

//Delete Method
app.delete("/delete" , async function (req, res) {
  let {username , password , targetKey} = req.body;

  try {
    let targetID = null;

    const [testArr] = await req.db.query(
      `SELECT * FROM users WHERE username = :username AND passphrase = :password;`,
      {
        username,
        password
      })
    const userIDSave = testArr[0]["id"];

    const [userData] = await req.db.query(
      `SELECT * FROM userData WHERE userID = :userIDSave;`,
      {userIDSave}
    )
    
      console.log(userData)

    userData.forEach(x => {
      if (Object.keys(JSON.parse(x.dataSheet))[0] == targetKey) {
        targetID = x.id
      }
    });

      const deleteSave = await req.db.query(
        `DELETE FROM userData
        WHERE id = :targetID`,
        {
          targetID
        }
      )
    res.json({ success: true, data: null , message : "Entry Deleted" , code : "200"})
  }
  catch (e) {
    console.log("Error", e.stack);
    console.log("Error", e.name);
    console.log("Error", e.message)
    res.json({ success: false, data: null , message : "Entry not Updated" , code : "400"})
  }
})

app.listen(port, () => console.log(`Userdata Server listening on http://localhost:${port}`));