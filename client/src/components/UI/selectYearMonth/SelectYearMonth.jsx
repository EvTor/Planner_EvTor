import React, { useEffect, useState } from "react";
import classes from "./SelectYearMonth.module.css"
import MyButton from "../button/MyButton";

const SelectYearMonth = ({ specYearMonth }) => {
    const currentYear = new Date().getFullYear();
    const fifteenYears = [];
    for (let i = 0; i < 15; i++) {
        fifteenYears.push(currentYear + i);
    };

    const currentMonth = new Date().getMonth();
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];



    const [year, setYear] = useState(currentYear);
    const [month, setMonth] = useState(monthNames[currentMonth]);

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
        };
    };

    const next = () => {
        const nextIndex = monthNames.indexOf(month) + 1;
        if (nextIndex <= 11) {
            setMonth(monthNames[nextIndex]);
        } else {
            setYear(year + 1);
            setMonth(monthNames[0])
        };
    };

    return (
        <div className={classes.yearMonthPanel}>
            <MyButton
                children="< Previous"
                onClick={previous}
            />
            <form>

                <select
                    className={classes.yearMonth}
                    value={year}
                    onChange={event => setYear(parseInt(event.target.value))}
                >
                    {fifteenYears.map(e =>
                        <option value={e}>{e}</option>
                    )}
                </select>
                <select
                    className={classes.yearMonth}
                    value={month}
                    onChange={event => setMonth(event.target.value)}
                >

                    {monthNames.map(e =>
                        <option value={e}>{e}</option>
                    )}
                </select>

            </form>
            <MyButton
                children="Next >"
                onClick={next} />
        </div>
    )
};

export default SelectYearMonth;