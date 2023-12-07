

export default function(props) {
    let containerStyle = {
        "display": "flex",
        "justifyContent": "start",
        "alignItems": "center",
        "width": "100%",
        "height": "10%",
        "margin": "2px",
        "marginTop": "6px",
        "marginBottom": "6px",
        "border": "solid #2D3142 3px",
        "paddingTop": "2px",
        "paddingBottom": "2px",
    }

    let innerContainerStyle1 = {
        "height" : "100%",
        "width" : "80%",
        "margin" : "2px",
        "display" : "flex",
        "justifyContent" : "start",
        "alignItems" : "center"
    }

    let innerContainerStyle2 = {
        "height" : "100%",
        "width" : "20%",
        "margin" : "2px",
        "display" : "flex",
        "justifyContent" : "center",
        "alignItems" : "center"
    }

    async function handleDelete() {
        props.handleDelete()
        let indexCalc = 0
        let indexSave = 0;
        let mutableArr = [...props.keys]
        props.handle(prevObj => {
            return (
                prevObj.flatMap(x => {
                    let userDataName = Object.keys(x)[0];
                    let mapSelectName= `${event.target.id}|${event.target.name}`
                    if (userDataName == mapSelectName) {
                        indexSave = indexCalc
                        return []
                    }
                    else {
                        indexCalc += 1
                        return x
                    }
                }
                )
            )
        })
        mutableArr.splice(indexSave , 1) //Issues with updating the key list, only updates on page load rather than on edit, need to fix
        if (indexSave > mutableArr.length-1) {
            console.log(mutableArr.length-1)
            props.handle2(mutableArr[mutableArr.length-1])
        }
        else {
            console.log(mutableArr)
            props.handle2(mutableArr[indexSave])
        }
    }

    function handleLoad() {
        props.handle(prevObj => { return (
            prevObj.flatMap(x =>{
                let userDataName = Object.keys(x)[0];
                let targetDataName = props.currentKey;
                if (userDataName == targetDataName) {
                    console.log({[props.currentKey] : {...props.currentSheet}})
                    return {
                        [props.currentKey] : {...props.currentSheet}
                    }
                }
                else {
                    console.log(x)
                    return x
                }
            })
        )})
        console.log(props.currentSheet)
        props.handle2(`${event.target.id}|${event.target.name}`)
    }

    return (
        <>
        <div style={containerStyle}>
            <div style={innerContainerStyle1}>
                <h3>{`${props.name}`}</h3>
            </div>
            <div style={innerContainerStyle2}>
                <button id={props.id} name={props.name} type="button" onClick={handleLoad}>
                ↧
                </button>
                <button id={props.id} name={props.name} type="button" onClick={handleDelete}>
                🗑
                </button>
            </div>
        </div>
        </>
    )
}