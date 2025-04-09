import moment from 'moment'

export const FormatDate = (timestamp:any) => {
    const date = new Date(timestamp);
    return moment(date).format('DD/MM/YYYY');
}

export const formatDateForText=(date:any)=> {
    return moment(date, 'DD/MM/YYYY').format('DD/MM/YYYY');
}

export const formateTime=(timestamp:any)=> {
    const date=new Date(timestamp)
    const timeString = date.toLocaleTimeString([], {
        hour:'2-digit',
        minute:'2-digit'
    })
    return timeString
}

export const getDatesRange = (startDate:any, endDate:any) => {
    const start = moment(new Date(startDate), 'MM/DD/YYYY')
    const end = moment(new Date(endDate), 'MM/DD/YYYY')
    const dates = []

    while(start.isSameOrBefore(end)){
        dates.push(start.format('MM/DD/YYYY'))
        start.add(1, 'days')
    }
    return dates
}

export const GetDateRangeToDisplay = (startDate:any, endDate:any) => {
    const dates = [];
    const start = moment(startDate, 'DD/MM/YYYY');
    const end = moment(endDate, 'DD/MM/YYYY');
    
    while (start <= end) {
        dates.push(start.format('DD/MM/YYYY'));
        start.add(1, 'days');
    }
    
    return dates;
}