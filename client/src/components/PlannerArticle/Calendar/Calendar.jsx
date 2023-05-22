import React, { useState } from "react";
import MyCard from "../../UI/card/MyCard";
import classes from "./Calendar.module.css"
import SelectYearMonth from "../../UI/selectYearMonth/SelectYearMonth";
const Calendar = ({ events, clickedDay }) => {
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

    const exactDate = (dayInSelectedMonth) => {
        let currentMonth = month.selectedMonth + 1;
        if (currentMonth < 10) {
            currentMonth = 0 + currentMonth.toString()
        }
        let currentDay = dayInSelectedMonth;
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

    const currentDayEvents = (dayInSelectedMonth) => {
        const arrayOfDayEvents = events.filter(event => {
            const certainEventStart = event.startDate.slice(0, 10);
            if (certainEventStart === exactDate(dayInSelectedMonth))
                return event
        });
        return arrayOfDayEvents
    };



    return (

        <div className={classes.calendarDiv}>
            <SelectYearMonth specYearMonth={specYearMonth} />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "0.1rem" }}>
                {weekDays.map((value, index) =>
                    <div key={index} style={{ textAlign: "center" }}><h4>{value}</h4></div>
                )}
                {daysMonth.map(e =>
                    <MyCard key={exactDate(e)} clickedDay={clickedDay} currentDayEvents={currentDayEvents(e)} id={exactDate(e)} dayNumber={(e)} style={{ gridColumnStart: dayWeek(() => exactDate(e)) }} />
                )}
            </div>
        </div>
    )
};
export default Calendar;