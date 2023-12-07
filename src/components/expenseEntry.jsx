export default function ExpenseEntry(props) {
    let key = props.monthKey;
    let month = props.monthsArr

    const entryStyle = {
        "display": "flex",
        "justifyContent": "start",
        "alignItems": "center",
        "width": "48%",
        "minWidth": "380px",
        "height": "6%",
        "margin": "2px",
        "marginTop": "6px",
        "marginBottom": "6px",
        "border": "solid #2D3142 3px",
        "paddingTop": "2px",
        "paddingBottom": "2px",
    }

    const amountStyle = {
        "width": "20%",
        "height": "70%"
    }

    const descStyle = {
        "height": "70%",
        "width": "54%",
    }

    const repeatStyle = {
        "width": "10%",
        "height": "60%",
    }

    const deleteStyle = {
        "width": "8%",
        "height": "70%",
        "marginRight": "2px"
    }

    const dueStyle = {
        "width": "17%",
        "height": "70%",
        "marginRight": "2px"
    }

    function handleExpenseArr() {
        props.handle(prevObj => {
            return (
                {
                    ...prevObj,
                    [key]: {
                        ...prevObj[[key]],
                        "expenses": prevObj[[key]]["expenses"].flatMap(x => { //source https://masteringjs.io/tutorials/fundamentals/map-skip-index#:~:text=You%20can%20use%20JavaScript's%20flatMap,values%20to%20the%20resulting%20array.
                            if (x.id == event.target.id) {
                                switch (event.target.name) {
                                    case "name":
                                        return ({ ...x, [event.target.name]: event.target.value });
                                        break
                                    case "amount":
                                        return ({ ...x, [event.target.name]: isNaN(parseFloat(event.target.value)) ? 0 : parseFloat(event.target.value) });
                                        break
                                    case "repeat":
                                        return ({ ...x, [event.target.name]: event.target.checked });
                                        break
                                    case "due":
                                        return ({ ...x, [event.target.name]: event.target.value });
                                        break
                                    case "delete":
                                        return []
                                }
                            }
                            else {
                                return x
                            }
                        }
                        )
                    }
                }
            )
        }
        )
        props.handle(prevObj => {
            return ({
                ...prevObj,
                [key]: {
                    ...prevObj[[key]],
                    "totalExpenses": props.sumExpenses(prevObj[[key]]["expenses"]),
                    "netChange": (prevObj[[key]]["income"] + prevObj[[key]]["savings"]) - props.sumExpenses(prevObj[[key]]["expenses"])
                }
            })
        })
    }


    return (
        <>
            <div style={entryStyle} id={props.indexID}>
                <input id={props.indexID} name="repeat" type="checkbox" style={repeatStyle} defaultChecked={props.repeat} onChange={handleExpenseArr} />
                <input id={props.indexID} name="name" type="text" style={descStyle} placeholder={"DESCRIPTION"} defaultValue={props.name} onChange={handleExpenseArr} />
                <input id={props.indexID} name="amount" type="text" style={amountStyle} placeholder="AMOUNT" defaultValue={props.amount} onChange={handleExpenseArr} />
                <input id={props.indexID} name="due" type="text" style={dueStyle} placeholder={"DUE"} onChange={handleExpenseArr} defaultValue={props.due} />
                <button id={props.indexID} type="button" name="delete" style={deleteStyle} onClick={handleExpenseArr}>🗑</button>
            </div>
        </>
    )
}