import React from "react";

const Inputfield = (props) => {
    return (
        <>
            <div>
                {props.labelText}
            </div>
            <input
                value={props.value}
                onChange={props.changeListener}
            ></input>
        </>
    )
}

export default Inputfield