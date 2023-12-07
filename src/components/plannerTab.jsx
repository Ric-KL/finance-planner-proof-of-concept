export default function plannerTab(props) {

    function handleCurrentMonth() {
        props.handleCurrentMonth([event.target.id])
        props.handleCurrentMonth([event.target.id])
    }

    return (
        <>
            <div style={{"height":"100%" , 
            "width" : "100%" , 
            "borderRight" : "solid #2D3142 2px", 
            "display" : "flex" , 
            "justifyContent" : "center" , 
            "alignItems" : "center" , 
            "cursor" : "pointer",
            "fontSize" : "1vw",
            "backgroundColor" : props.selectedMonth == props.name ? "#778DA9" : "grey"}} id={props.name} onClick={handleCurrentMonth}>{props.name}</div>
        </>
    )
}