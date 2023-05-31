class Service {

    static cardColors = ()=>{
        const colors = ["red", "orange", "yellow", "green", "blue", "pink", "purple", "brown", "grey"];
        return colors
    }

    static backgroundColor = (exactEvent) => {
        const datBaseColors = ["red", "orange", "yellow", "green", "blue", "pink", "purple", "brown", "grey"];
        const clientColors = ["red", "orange", "yellow", "green", "blue", "pink", "purple", "brown", "grey"];
        const bgColor = datBaseColors.filter((item, index) => {
            if (exactEvent.color === item) {
                return clientColors[index];
            }
        })
        return bgColor[0];
    };


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
