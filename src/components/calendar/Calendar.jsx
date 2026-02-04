import React from "react";
import "./calendar.css";

const Calendar = () => {
    const events2026 = [
        {
            month: "February",
            events: [
                { date: "01", name: "February Prodigies Online Blitz", location: "Online" },
                { date: "07-08", name: "1st Urafiki Gambit (Tanzania Poland Friendship Chess Tournament: Two Nation One Board)", location: "Polish Embassy, 15 Mitwara Road, Masaki, DSM" },
                { date: "14", name: "AKES Interschool Chess Tournament 2nd Edition", location: "Agakhan Primary School" }
            ]
        },
        {
            month: "March",
            events: [
                { date: "01", name: "Donbosco Anniversary Tournament", location: "DBC, Upanga" }
            ]
        },
        {
            month: "April",
            events: [
                { date: "04-05", name: "Tanzanite Junior Chess Championship 2026", location: "To Be Announced DSM" },
                { date: "05", name: "April Prodigies Online Tournament", location: "Online" }
            ]
        },
        {
            month: "May",
            events: [
                { date: "01, 02, 03", name: "Tanzania National Chess Championship 2026 and Qualifier for Team Olympiad", location: "To Be Announced" }
            ]
        },
        {
            month: "June",
            events: [
                { date: "TBA", name: "2nd Ultimate Junior Rapid Chess Tournament", location: "The Cube Restaurant" },
                { date: "28", name: "June Prodigies Online Blitz", location: "Online" }
            ]
        },
        {
            month: "July",
            events: [
                { date: "05", name: "DBC July Rapid Tournament", location: "DBC, Upanga" }
            ]
        },
        {
            month: "August",
            events: [
                { date: "08-09", name: "TACA Rapid Chess Championship 2026", location: "To Be Announced" },
                { date: "TBA", name: "August Rising Star Summer Camp Series 3", location: "To Be Announced" },
                { date: "30", name: "August Prodigies Online Blitz", location: "Online" }
            ]
        },
        {
            month: "September",
            events: [
                { date: "15-28", name: "Team Tanzania to Participate in 46th Chess Olympiad in Samarkand, Uzbekistan", location: "World Chess Olympiad" }
            ]
        },
        {
            month: "October",
            events: [
                { date: "TBA", name: "6th IST Interschool Individual Chess Tournament", location: "To Be Announced" }
            ]
        },
        {
            month: "November",
            events: [
                { date: "01", name: "DBC November Blitz Tournament", location: "DBC, Upanga" },
                { date: "TBA", name: "November Prodigies Online Blitz", location: "Online" }
            ]
        },
        {
            month: "December",
            events: [
                { date: "05", name: "Jordan Watoto ya NNE", location: "Jordan University College, Morogoro" },
                { date: "05-06", name: "Jordan Open - Ya Sita", location: "Jordan University College, Morogoro" },
                { date: "11-13", name: "Tanzania Open Chess Championship 2026", location: "To Be Announced" },
                { date: "TBA", name: "Justfit Interschool Games", location: "To Be Announced" },
                { date: "31", name: "New Year Eve TZ Online Blitz", location: "Online" }
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
