import React from "react";
import "./calendar.css";

const Calendar = () => {
    const events2026 = [
        {
            month: "January",
            events: [
                { date: "10-12", name: "Tanzania Open Championship", location: "Dar es Salaam" },
                { date: "25", name: "Blitz Tournament", location: "Arusha" }
            ]
        },
        {
            month: "February",
            events: [
                { date: "14-16", name: "Valentine's Chess Festival", location: "Zanzibar" },
                { date: "28", name: "Youth Chess Championship", location: "Mwanza" }
            ]
        },
        {
            month: "March",
            events: [
                { date: "8", name: "Women's Chess Day Tournament", location: "Dodoma" },
                { date: "21-23", name: "National Team Trials", location: "Dar es Salaam" }
            ]
        },
        {
            month: "April",
            events: [
                { date: "5-7", name: "East African Championship", location: "Dar es Salaam" },
                { date: "19", name: "Rapid Chess Open", location: "Mbeya" }
            ]
        },
        {
            month: "May",
            events: [
                { date: "1", name: "Labour Day Chess Tournament", location: "Tanga" },
                { date: "15-17", name: "Schools Championship", location: "Arusha" }
            ]
        },
        {
            month: "June",
            events: [
                { date: "6-8", name: "Mid-Year Grand Prix", location: "Dar es Salaam" },
                { date: "20", name: "Blitz Marathon", location: "Moshi" }
            ]
        },
        {
            month: "July",
            events: [
                { date: "4-6", name: "Independence Cup", location: "Dodoma" },
                { date: "25-27", name: "Summer Chess Camp Tournament", location: "Zanzibar" }
            ]
        },
        {
            month: "August",
            events: [
                { date: "8-10", name: "Farmers' Day Chess Open", location: "Morogoro" },
                { date: "22", name: "Speed Chess Championship", location: "Dar es Salaam" }
            ]
        },
        {
            month: "September",
            events: [
                { date: "5-7", name: "National Chess Championship", location: "Dar es Salaam" },
                { date: "19", name: "University Chess League", location: "Dodoma" }
            ]
        },
        {
            month: "October",
            events: [
                { date: "10-12", name: "Kilimanjaro Open", location: "Moshi" },
                { date: "24-26", name: "Regional Team Championship", location: "Mwanza" }
            ]
        },
        {
            month: "November",
            events: [
                { date: "7-9", name: "All-Africa Qualifiers", location: "Dar es Salaam" },
                { date: "21", name: "Veterans Chess Tournament", location: "Arusha" }
            ]
        },
        {
            month: "December",
            events: [
                { date: "6-8", name: "Year-End Championship", location: "Dar es Salaam" },
                { date: "26-28", name: "Boxing Day Chess Festival", location: "Zanzibar" }
            ]
        }
    ];

    return (
        <section className="calendar section" id="calendar">
            <h2 className="section__title">Chess Calendar 2026</h2>
            <span className="section__subtitle">Upcoming Tournaments & Events</span>

            <div className="calendar__container container">
                <div className="calendar__grid">
                    {events2026.map((monthData, index) => (
                        <div key={index} className="calendar__month">
                            <div className="calendar__month-header">
                                <h3 className="calendar__month-name">{monthData.month}</h3>
                            </div>
                            <div className="calendar__events">
                                {monthData.events.map((event, eventIndex) => (
                                    <div key={eventIndex} className="calendar__event">
                                        <div className="calendar__event-date">
                                            <i className="uil uil-calendar-alt"></i>
                                            <span>{event.date}</span>
                                        </div>
                                        <div className="calendar__event-details">
                                            <h4 className="calendar__event-name">{event.name}</h4>
                                            <p className="calendar__event-location">
                                                <i className="uil uil-location-point"></i>
                                                {event.location}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Calendar;
