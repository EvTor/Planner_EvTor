class Service {
    static dayFormatter = (date) => {
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
        ];
        let day = date.slice(8, 10);
        if (parseInt(day) <= 9) { day = day.slice(1, 2) };
        const month = monthNames[parseInt(date.slice(5, 7)) - 1];
        const year = date.slice(0, 4);
        return `${day} ${month} ${year}`

    }
}

export default Service;
