import React, {useEffect, useState} from "react";
import classes from "./SelectYearMonth.module.css"
import BigButton from "../button/BigButton";

const SelectYearMonth = ({specYearMonth, dayEventsDetails}) => {


    const currentYear = new Date().getFullYear();
    const fifteenYears = [];
    for (let i = 0; i < 15; i++) {
        fifteenYears.push(currentYear + i);
    }
    ;

    const currentMonth = new Date().getMonth();
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const initialYear = () => {
        if (dayEventsDetails) {
            return parseInt(dayEventsDetails.dayId.slice(0, 4))
        } else {
            return currentYear
        }
    };
    const initialMonth = () => {
        if (dayEventsDetails) {
            return monthNames[parseInt(dayEventsDetails.dayId.slice(5, 7)) - 1]
        }
            return monthNames[currentMonth]
    };

    const [year, setYear] = useState(initialYear());
    const [month, setMonth] = useState(initialMonth());
    useEffect(() => {
        specYearMonth(year, monthNames.indexOf(month));
    }, [year, month])

    const previous = () => {
        const previousIndex = monthNames.indexOf(month) - 1;
        if (previousIndex >= 0) {
            setMonth(monthNames[previousIndex]);
        } else {
            setYear(year - 1);
            setMonth(monthNames[11])
        }
        ;
    };

    const next = () => {
        const nextIndex = monthNames.indexOf(month) + 1;
        if (nextIndex <= 11) {
            setMonth(monthNames[nextIndex]);
        } else {
            setYear(year + 1);
            setMonth(monthNames[0])
        }
        ;
    };

    return (
        <div className={classes.yearMonthPanel}>
            <BigButton
                children="< Previous"
                color="blue"
                sizeChange={true}
                onClick={previous}
            />
            <form className={classes.yearMonthSelects}>

                <select
                    className={classes.yearMonth}
                    value={year}
                    onChange={event => setYear(parseInt(event.target.value))}
                >
                    {fifteenYears.map((value, index) =>
                        <option key={`${index}year`} value={value}>{value}</option>
                    )}
                </select>
                <select
                    className={classes.yearMonth}
                    value={month}
                    onChange={event => setMonth(event.target.value)}
                >

                    {monthNames.map((value, index) =>
                        <option key={`${index}month`} value={value}>{value}</option>
                    )}
                </select>

            </form>
            <BigButton
                children="Next >"
                color="blue"
                sizeChange={true}
                onClick={next}/>
        </div>
    )
};

export default SelectYearMonth;