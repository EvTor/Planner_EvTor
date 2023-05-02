import React from "react";
import classes from "./MyEvent.module.css"
import { DateTime } from "luxon";
const MyEvent = (props) => {

    const backgroundColor = () => {
        const datBaseColors = ["red", "orange", "yellow", "green", "blue", "pink", "purple", "brown", "grey"];
        const clientColors = ["red", "orange", "yellow", "green", "blue", "pink", "purple", "brown", "grey"];
        const bgColor = datBaseColors.filter((item, index) => {
            if (props.color === item) {
                return clientColors[index];
            }
        })
        console.log(props.color, bgColor[0])
        return bgColor[0];
    }


    const showTime = (date) => {
        const dateISO = new Date(date);
        const localDate = dateISO;
        let hours = localDate.getHours().toString();
        if (hours.length < 2) { hours = `0${hours}` }
        let minutes = localDate.getMinutes().toString();
        if (minutes.length < 2) { minutes = `0${minutes}` }
        return `${hours}:${minutes}`;

    }

    return (
        <div key={props.key} className={classes.eventDiv} style={{ backgroundColor: backgroundColor() }}>
            <div className={classes.time}>
                {showTime(props.startDate)}-{showTime(props.endDate)}
            </div>
            <div className={classes.description}>
                {props.description}
            </div>



        </div>
    )
};
export default MyEvent;