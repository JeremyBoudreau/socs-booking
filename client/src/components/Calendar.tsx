import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../styles/Calendar.css";

export default function MyCalendar() {
  // temporary function — always returns true for now
  const hasAppointment = (date: Date) => {
//In the future, change the inside of this function

    date.getTime(); //Dummy line to avoid bugs because typescript want me to use date.
    

    return true;
  };

  return (
    <div className="calendar-container">
      <Calendar
        onClickDay={() => {
            //In the future, change the inside of this function
            //Idea: Open a new page where we can see appointments on this day
          console.log("ACTION HERE");
        }}
        tileContent={({ date, view }) => {
          //We only want to show dots on month view (not year/decade)
          if (view === "month" && hasAppointment(date)) {
            return <div className="calendar-dot" />;
          }
          return null;
        }}
      />
    </div>
  );
}