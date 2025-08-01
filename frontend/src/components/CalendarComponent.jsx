import React, { useState } from 'react';
import Calendar from 'react-calendar';
import './Calendar.css';  // Import custom styles

const CalendarComponent = ({ onDateSelect }) => {
    const [selectedDate, setSelectedDate] = useState(new Date());

    const handleDateChange = (date) => {
        setSelectedDate(date);
        onDateSelect(date);  // Pass the selected date to the parent component
    };

    return (
        <div className="calendar-container">
            <Calendar
                onChange={handleDateChange}
                value={selectedDate}
                className="custom-calendar"  // Optional custom CSS class
            />
            <p className="text-center">
                <span className="bold">Selected Date:</span> {selectedDate.toDateString()}
            </p>
        </div>
    );
};

export default CalendarComponent;
