import { useContext } from "react";
import { createContext, useEffect, useState } from "react";
import { api } from "../services/api";
import { CodeContext } from "./getCode";


export const ServiceIdContext = createContext()




export function ServiceIdProvider({ children }) {
    const { code } = useContext(CodeContext)
    const [today, setToday] = useState('')
    const [calendar, setCalendar] = useState([])
    const [serviceId, setServiceId] = useState('')
    const [weekDay, setWeekDay] = useState('')
    const options = {
        weekday: 'long',
        timeZone: 'America/Sao_Paulo'
    };


    async function getDates(url) {
        let allDates = [];
        await api
            .get(url)
            .then(({ data }) => {
                data.results.forEach((item) => {
                    allDates.push(item);
                });
                if (data.next) {
                    getDates(data.next);
                }
                setCalendar((prevCalendar) => [...prevCalendar, ...allDates]);
            });
    }
    async function getDayOfWeek(url) {
        let allDay = [];
        await api
            .get(url)
            .then(({ data }) => {
                data.results.forEach((item) => {
                    allDay.push(item);
                });

                setWeekDay(allDay);
            });
    }
    useEffect(() => {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;
        setToday(formattedDate)
    }, [])


    useEffect(() => {
        if (code.length > 0) {
            getDayOfWeek('calendar/')
            getDates('calendar_dates/')
        }
    }, [code])


    function findService(todayDate) {
        const service = calendar.find((item) => item.date === todayDate);
        if (service) {
            setServiceId(service.service_id);
        } else if (weekDay) {
            const dayOfWeek = new Intl.DateTimeFormat('en-US', options).format(new Date()).toLowerCase();
            const serviceWorks = weekDay.filter((service) => service[dayOfWeek] === 1);
            const currentDate = new Date(todayDate);
            if (serviceWorks.length > 0) {
                const todayService = serviceWorks.find((service) => {
                    const startDate = new Date(service.start_date);
                    const endDate = new Date(service.end_date);
                    return currentDate >= startDate && currentDate <= endDate;
                });
                if (todayService) {
                    setServiceId(todayService.service_id);
                }
            }
        }
    }



    useEffect(() => {
        if (calendar.length > 0) {
            findService(today)
        }
    }, [calendar])



    return (
        <ServiceIdContext.Provider value={{ serviceId }}>
            {children}
        </ServiceIdContext.Provider>
    )
}