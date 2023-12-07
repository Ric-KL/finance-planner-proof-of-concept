import React, { useEffect } from 'react'
import './App.css'
import PlannerTab from "./components/plannerTab.jsx"
import ExpenseEntry from './components/expenseEntry.jsx'
import SheetEntry from "./components/sheetSelectEntry.jsx"

function App() {
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

  const tempObject = {
    "income": 0,
    "savings": 0,
    "expenses": 0,
"January": {
"income": 0,
"savings": 0,
"totalExpenses": 0,
"netChange": 0,
"expenses": []
},
"February": {
"income": 0,
"budget": 0,
"savings": 0,
"totalExpenses": 0,
"netChange": 0,
"expenses": []
},
"March": {
"income": 0,
"budget": 0,
"savings": 0,
"totalExpenses": 0,
"netChange": 0,
"expenses": []
},
"April": {
"income": 0,
"budget": 0,
"savings": 0,
"totalExpenses": 0,
"netChange": 0,
"expenses": []
},
"May": {
"income": 0,
"budget": 0,
"savings": 0,
"totalExpenses": 0,
"netChange": 0,
"expenses": []
},
"June": {
"income": 0,
"budget": 0,
"savings": 0,
"totalExpenses": 0,
"netChange": 0,
"expenses": []
},
"July": {
"income": 0,
"budget": 0,
"savings": 0,
"totalExpenses": 0,
"netChange": 0,
"expenses": []
},
"August": {
"income": 0,
"budget": 0,
"savings": 0,
"totalExpenses": 0,
"netChange": 0,
"expenses": []
},
"September": {
"income": 0,
"budget": 0,
"savings": 0,
"totalExpenses": 0,
"netChange": 0,
"expenses": []
},
"October": {
"income": 0,
"budget": 0,
"savings": 0,
"totalExpenses": 0,
"netChange": 0,
"expenses": []
},
"November": {
"income": 0,
"budget": 0,
"savings": 0,
"totalExpenses": 0,
"netChange": 0,
"expenses": []
},
"December": {
"income": 0,
"budget": 0,
"savings": 0,
"totalExpenses": 0,
"netChange": 0,
"expenses": []
}
  }

  //Local Storage Management for Month Tabs
  const [currentViewMonth, setCurrentViewMonth] = React.useState(window.localStorage.getItem("currentViewMonth") === null ? "January" : JSON.parse(window.localStorage.getItem("currentViewMonth")));
  React.useEffect(() => {
    window.localStorage.setItem("currentViewMonth", JSON.stringify(currentViewMonth))
  }, [currentViewMonth])

  //Local Storage Manage for Sheet ID
  const [currentUserSheetID , setCurrentUserSheetID] = React.useState(window.localStorage.getItem("currentUserSheetID") === null ? `${Math.floor(Math.random() * 10000000)}|First Sheet` : JSON.parse(window.localStorage.getItem("currentUserSheetID")));
  React.useEffect(() => {
    window.localStorage.setItem("currentUserSheetID", JSON.stringify(currentUserSheetID))
  }, [currentUserSheetID])


  //State for all User Data
  const [userData , setUserData] = React.useState(window.localStorage.getItem("userData") == null ? pushFirstSheet() : JSON.parse(window.localStorage.getItem("userData")))
  React.useEffect(() => {
    window.localStorage.setItem("userData", JSON.stringify(userData))
  }, [userData]);
  React.useEffect(() => {
    setUserData(prevObj => {
      if (prevObj == null) {
        return pushFirstSheet()
      }
      else {
        return prevObj
      }
    })
  },[])


  //State for Currently Loaded Sheet
  const [currentUserSheet, setCurrentUserSheet] = userData.length &&  React.useState(userData.find((x) => Object.keys(x)[0] == currentUserSheetID )[[currentUserSheetID]] == null ? tempObject : userData.find((x) => Object.keys(x)[0] == currentUserSheetID )[[currentUserSheetID]])
  React.useEffect(() => {
    setCurrentUserSheet(userData.find((x) => Object.keys(x)[0] == currentUserSheetID )[[currentUserSheetID]] == null ? tempObject : userData.find((x) => Object.keys(x)[0] == currentUserSheetID )[[currentUserSheetID]])
  },[currentUserSheetID])

  //State for User Input Fields
  const [userIncomeField, setUserIncomefield] = React.useState(currentUserSheet[[currentViewMonth]["income"]]);
  useEffect(() => { setUserIncomefield(currentUserSheet[[currentViewMonth]]["income"]) }, [currentUserSheet])

  useEffect(() => { //Watches for changes to expense array and updates total expenses and expense array.
    setCurrentUserSheet(prevObj => {
      return {
        ...prevObj,
        [currentViewMonth]: {
          ...prevObj[[currentViewMonth]],
          "totalExpenses": sumExpenses(prevObj[[currentViewMonth]]["expenses"]),
          "netChange": (prevObj[[currentViewMonth]]["income"] + prevObj[[currentViewMonth]]["savings"]) - sumExpenses(prevObj[[currentViewMonth]]["expenses"])
        }
      }
    })
    refreshYearlyAnalytics();
    refreshSavings();
  }, [currentViewMonth, userIncomeField]) // , userIncomeField, userSavingsField


  const [keysState , setKeysState] = React.useState(userData.map(x => Object.keys(x)[0]))
  useEffect(() => {
    setKeysState(userData.map(x => Object.keys(x)[0]))
  },[userData])

  const [savingsState , setSavingsState] = React.useState(0);

  const [nameState , setNameState] = React.useState("");

  const [newSheetState , setNewSheetState] = React.useState(false);
  function toggleNewSheetState() {
    setNewSheetState(prevObj => {return !prevObj})
  }

  //Math Functions

  function sumExpenses(arr) {
    let sum = 0;
    arr.forEach(x => { sum += x["amount"] })
    return sum
  }

  function sumYearlyExpenses() {
    let outputSum = 0;
    months.forEach(x => { outputSum += currentUserSheet[x]["totalExpenses"] })
    return outputSum;
  }

  function sumYearlyIncome() {
    let outputSum = 0;
    months.forEach(x => { outputSum += currentUserSheet[x]["income"] })
    return outputSum;
  }

  function sumYearlySavings() {
    let outputSum = 0;
    months.forEach(x => {outputSum += currentUserSheet[[x]]["income"] - currentUserSheet[[x]]["totalExpenses"]})
    return outputSum;
  }

  function refreshYearlyAnalytics() {
    setCurrentUserSheet(prevObj => {
      return (
        {
          ...prevObj,
          "expenses" : sumYearlyExpenses(),
          "income" : sumYearlyIncome(),
          "savings" : sumYearlySavings(),
        }
      )
    })
  }

  //App Page Update Functions
  function pushNewExpense() {
    setCurrentUserSheet(prevObj => {
      return (
        {
          ...prevObj,
          [currentViewMonth]: {
            ...prevObj[[currentViewMonth]],
            "expenses": [...prevObj[[currentViewMonth]]["expenses"], { "id": Math.floor(Math.random() * 10000000), "name": "", "amount": 0, "repeat": false , "due" : ""}]
          }
        }
      )
    })
  }

  function updateUserInput() {
    setCurrentUserSheet(prevObj => {
      return {
        ...prevObj,
        [currentViewMonth]: {
          ...prevObj[[currentViewMonth]],
          [event.target.name]: isNaN(parseFloat(event.target.value)) ? 0 : parseFloat(event.target.value)
        }
      }
    })
  }

  function test() {
    console.log(getObjNames())
  }

  function refreshSavings() {
    let indexStart = 1;
    let indexEnd = months.length-1;
    for (let x = indexStart ; x <= indexEnd ; x++) {
      setCurrentUserSheet(prevObj => {return(
        {...prevObj,
          [months[x]] : {
            ...prevObj[[months[x]]],
            "savings" : prevObj[[months[x-1]]]["netChange"],
            "netChange" : (prevObj[[months[x]]]["income"] + prevObj[[months[x-1]]]["netChange"]) - sumExpenses(prevObj[[months[x]]]["expenses"])
          }
        }
      )})
    }
  }

  async function pushNewSheet() {
    if (nameState.includes("|")) {
      alert("Invalid character { | } in name. Please remove and try again.");
      return;
    }
    let newName = `${Math.floor(Math.random() * 10000000)}|${nameState}`;
    let startingSavings = savingsState;
    let exportObj = {
      [newName] : {
        "income": 0,
        "savings": 0,
        "expenses": 0,
"January": {
  "income": 0,
  "savings": startingSavings,
  "totalExpenses": 0,
  "netChange": 0,
  "expenses": []
},
"February": {
  "income": 0,
  "budget": 0,
  "savings": 0,
  "totalExpenses": 0,
  "netChange": 0,
  "expenses": []
},
"March": {
  "income": 0,
  "budget": 0,
  "savings": 0,
  "totalExpenses": 0,
  "netChange": 0,
  "expenses": []
},
"April": {
  "income": 0,
  "budget": 0,
  "savings": 0,
  "totalExpenses": 0,
  "netChange": 0,
  "expenses": []
},
"May": {
  "income": 0,
  "budget": 0,
  "savings": 0,
  "totalExpenses": 0,
  "netChange": 0,
  "expenses": []
},
"June": {
  "income": 0,
  "budget": 0,
  "savings": 0,
  "totalExpenses": 0,
  "netChange": 0,
  "expenses": []
},
"July": {
  "income": 0,
  "budget": 0,
  "savings": 0,
  "totalExpenses": 0,
  "netChange": 0,
  "expenses": []
},
"August": {
  "income": 0,
  "budget": 0,
  "savings": 0,
  "totalExpenses": 0,
  "netChange": 0,
  "expenses": []
},
"September": {
  "income": 0,
  "budget": 0,
  "savings": 0,
  "totalExpenses": 0,
  "netChange": 0,
  "expenses": []
},
"October": {
  "income": 0,
  "budget": 0,
  "savings": 0,
  "totalExpenses": 0,
  "netChange": 0,
  "expenses": []
},
"November": {
  "income": 0,
  "budget": 0,
  "savings": 0,
  "totalExpenses": 0,
  "netChange": 0,
  "expenses": []
},
"December": {
  "income": 0,
  "budget": 0,
  "savings": 0,
  "totalExpenses": 0,
  "netChange": 0,
  "expenses": []
}
      }
    }
    setUserData(prevObj => {
      return (
        [
          ...prevObj,
          exportObj
        ]
      )
    })
    setNewSheetState(false);
    setCurrentUserSheetID(newName);
    saveSheet(exportObj)
  }

  function pushFirstSheet() {
    let newName = currentUserSheetID;
    let firstSheet = {[newName] : {
      "income": 0,
      "savings": 0,
      "expenses": 0,
"January": {
"income": 0,
"savings": 0,
"totalExpenses": 0,
"netChange": 0,
"expenses": []
},
"February": {
"income": 0,
"budget": 0,
"savings": 0,
"totalExpenses": 0,
"netChange": 0,
"expenses": []
},
"March": {
"income": 0,
"budget": 0,
"savings": 0,
"totalExpenses": 0,
"netChange": 0,
"expenses": []
},
"April": {
"income": 0,
"budget": 0,
"savings": 0,
"totalExpenses": 0,
"netChange": 0,
"expenses": []
},
"May": {
"income": 0,
"budget": 0,
"savings": 0,
"totalExpenses": 0,
"netChange": 0,
"expenses": []
},
"June": {
"income": 0,
"budget": 0,
"savings": 0,
"totalExpenses": 0,
"netChange": 0,
"expenses": []
},
"July": {
"income": 0,
"budget": 0,
"savings": 0,
"totalExpenses": 0,
"netChange": 0,
"expenses": []
},
"August": {
"income": 0,
"budget": 0,
"savings": 0,
"totalExpenses": 0,
"netChange": 0,
"expenses": []
},
"September": {
"income": 0,
"budget": 0,
"savings": 0,
"totalExpenses": 0,
"netChange": 0,
"expenses": []
},
"October": {
"income": 0,
"budget": 0,
"savings": 0,
"totalExpenses": 0,
"netChange": 0,
"expenses": []
},
"November": {
"income": 0,
"budget": 0,
"savings": 0,
"totalExpenses": 0,
"netChange": 0,
"expenses": []
},
"December": {
"income": 0,
"budget": 0,
"savings": 0,
"totalExpenses": 0,
"netChange": 0,
"expenses": []
}
    }
  };
    return [firstSheet]
  }

  function handleNameState() {
    setNameState(event.target.value)
  }

  function handleSavingsState() {
    setSavingsState(isNaN(parseFloat(event.target.value)) ? 0 : parseFloat(event.target.value))
  }

  function getObjNames() {
    let outputArr = []
    userData.forEach(x => {
      outputArr.push(Object.keys(x)[0].split("|"))
    })
    return outputArr
  }

  //HTTP Functions
  async function saveSheet(targetData) {
    const JWTKey = window.localStorage.getItem("JWTKey");
    const accessKey = window.localStorage.getItem("accessKey");
    const user = JSON.parse(window.sessionStorage.getItem("user"))
    let exportData = {...user , saveData : targetData};

    const response = await fetch("http://localhost:3000/save" , {
      method: "PUT",
      body : JSON.stringify(exportData),
      headers: new Headers({
        "Content-type" : "application/json; charset=UTF-8",
        "Authorization" : `Bearer ${accessKey}`
        })
    });
  }

  async function deleteSheet() {
    const JWTKey = window.localStorage.getItem("JWTKey");
    const accessKey = window.localStorage.getItem("accessKey");
    const user = JSON.parse(window.sessionStorage.getItem("user"))
    const targetKey = `${event.target.id}|${event.target.name}`
    let exportData = {...user , targetKey : targetKey};

    const response = await fetch("http://localhost:3000/delete" , {
      method: "DELETE",
      body : JSON.stringify(exportData),
      headers: new Headers({
        "Content-type" : "application/json; charset=UTF-8",
        "Authorization" : `Bearer ${accessKey}`
        })
    });
  }

  async function updateSheet() {
    const JWTKey = window.localStorage.getItem("JWTKey");
    const accessKey = window.localStorage.getItem("accessKey");
    const user = JSON.parse(window.sessionStorage.getItem("user"))
    let exportData = {...user , saveData : {[currentUserSheetID] : {...currentUserSheet}}};

    const response = await fetch("http://localhost:3000/update" , {
      method: "PUT",
      body : JSON.stringify(exportData),
      headers: new Headers({
        "Content-type" : "application/json; charset=UTF-8",
        "Authorization" : `Bearer ${accessKey}`
        })
    });
    setUserData(
      prevObj => prevObj.flatMap(x => {
        let userDataName = Object.keys(x)[0];
        let targetDataName = currentUserSheetID;
        if (userDataName == targetDataName) {
            console.log({[currentUserSheetID] : {...currentUserSheet}})
            return {
                [currentUserSheetID] : {...currentUserSheet}
            }
        }
        else {
            console.log(x)
            return x
        }
      }
        
      )
    )
  }

  return (
    <>
      <div className='planner-main-container'>
        <div className='planner-sidebar-container'>
          <div className='planner-sidebar-actives-container'>
            <h3><button onClick={toggleNewSheetState}>+</button>ACTIVE SHEETS</h3>
            <div className='planner-sidebar-actives' style={{"display" : newSheetState ? "none" : "flex"}}>
              {getObjNames().map((x) => {return <SheetEntry name={x[1]} id={x[0]} handle={setUserData} handle2={setCurrentUserSheetID} currentKey={currentUserSheetID} currentSheet={currentUserSheet} allUserData={userData} handleDelete={deleteSheet} keys={keysState}/>})}
            </div>
            <div className='planner-sidebar-new-form' style={{"display" : newSheetState ? "flex" : "none"}}>
              <input className='planner-sidebar-new-form-input' type='text' placeholder='SHEET NAME' defaultValue={nameState} onChange={handleNameState}></input>
              <input className='planner-sidebar-new-form-input' type='test' placeholder='INITIAL SAVINGS' defaultValue={savingsState} onChange={handleSavingsState}></input>
              <button className='planner-sidebar-new-form-input' type='button' onClick={pushNewSheet}>Create New Sheet</button>
            </div>
          </div>
          <div className='planner-sidebar-archives-container'>
            <h3>ARCHIVED SHEETS</h3>
          </div>
        </div>
        <div className='planner-content-container'>
          <div className='planner-content-navbar-container'>
            <h1 style={{"marginRight" : "10px"}}>
              {`Current Sheet: ${currentUserSheetID.split("|")[1]}`}
            </h1>
            <button type="button" onClick={updateSheet}>↥</button>
          </div>
          <div className='planner-content-tabs-container'>
            {months.map((x) => { return <PlannerTab key={x} name={x} selectedMonth={currentViewMonth} handleCurrentMonth={setCurrentViewMonth} /> })}
          </div>
          <div className='planner-content-userdata-container'>
            <div className='planner-content-totals'>
              <div className='planner-content-totals-monthly'>
                <h3>Monthly Overview</h3>
                <h5>Monthly Income</h5>
                <form>
                  <input id="userIncomeField" name="income" type="text" placeholder='Enter Value' value={userIncomeField} onChange={updateUserInput} />
                </form>
                <h5>Monthly Savings</h5>
                {`$${currentUserSheet[currentViewMonth]["savings"]}`}
                <h5>Monthly Expenses</h5>
                {`$${currentUserSheet[currentViewMonth]["totalExpenses"]}`}
                <h5>Total Net Difference</h5>
                {`$${currentUserSheet[currentViewMonth]["netChange"]}`}
              </div>
              <div className='planner-content-totals-yearly'>
                <span className='planner-content-totals-yearly-header'>
                  <button onClick={refreshYearlyAnalytics} type="button" className='planner-refresh-button'>↻</button>
                  <h3>Yearly Overview</h3>
                </span>
                <h5>Total Gross Income</h5>
                {`$${currentUserSheet["income"]}`}
                <h5>Total Expenses</h5>
                {`$${currentUserSheet["expenses"]}`}
                <h5>Total Gross Savings</h5>
                {`$${currentUserSheet["savings"]}`}
              </div>
            </div>
            <div className='planner-content-entries-container'>
              <div className='planner-content-entries'>
                {currentUserSheet[[currentViewMonth]]["expenses"].map(x => {
                  return <ExpenseEntry
                    key={x.id}
                    sumExpenses={sumExpenses}
                    indexID={x.id}
                    name={x.name}
                    amount={x.amount}
                    repeat={x.repeat}
                    due={x.due}
                    handle={setCurrentUserSheet}
                    monthKey={currentViewMonth} />
                })}
              </div>
              <div className='planner-content-entries-footer'>
                <button className='pushExpensebutton' onClick={pushNewExpense}>ADD NEW EXPENSE</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default App
