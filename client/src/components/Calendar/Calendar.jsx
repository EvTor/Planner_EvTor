import React, { useState } from "react";
import MyCard from "../UI/card/MyCard";
import classes from "./Calendar.module.css"

import Loader from "../UI/Loader/Loader";
import SelectYearMonth from "../UI/selectYearMonth/SelectYearMonth";
const Calendar = () => {


    const specYearMonth = (selectedYear, selectedMonth) => {

        const days = new Date(selectedYear, selectedMonth + 1, 0).getDate();

        setMonth({ selectedYear, selectedMonth, days })
    }

    const [month, setMonth] = useState({});

    let daysMonth = [];
    for (let i = 1; i <= month.days; i++) {
        daysMonth.push(i);
    };

    const weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    const exactDate = (dayOrder) => {
        let currentMonth = month.selectedMonth + 1;
        if (currentMonth < 10) {
            currentMonth = 0 + currentMonth.toString()
        }
        let currentDay = dayOrder;
        if (currentDay < 10) {
            currentDay = 0 + currentDay.toString()
        }
        const currentDate = `${month.selectedYear}-${currentMonth}-${currentDay}`;
        return (currentDate);
    };

    const dayWeek = (exactDate, dayOrder) => {
        const currentDate = new Date(exactDate(dayOrder))

        return currentDate.getDay() + 1;
    };


    return (
        <div className={classes.calendarDiv}>
            <SelectYearMonth specYearMonth={specYearMonth} />



            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "0.1rem" }}>
                {weekDays.map(e =>
                    <div style={{ textAlign: "center" }}><h4>{e}</h4></div>
                )}
                {daysMonth.map(e =>
                    <MyCard id={exactDate(e)} children={(e)} style={{ gridColumnStart: dayWeek(() => exactDate(e)) }} />
                )}
            </div>

            <Loader />
        </div>)
};
export default Calendar;