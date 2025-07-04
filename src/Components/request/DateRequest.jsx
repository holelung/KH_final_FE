import { useState } from "react";

const DateRequest = ({ dateSelect, setDateSelect }) => {
  

  return (
    <>
      <div className="flex flex-row gap-4 p-4">
        <div className="flex items-center gap-2">
          <label htmlFor="start-date" className="font-medium">시작 날짜</label>
          <input
            id="start-date"
            type="date"
            value={dateSelect.startDate || ""}
            onChange={e => setDateSelect(prev => ({
              ...prev,
              startDate: e.target.value,
            }))}
            className="border rounded px-2 py-1"
          />
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="end-date" className="font-medium">끝나는 날짜</label>
          <input
            id="end-date"
            type="date"
            value={dateSelect.endDate || ""}
            onChange={e => setDateSelect(prev => ({
              ...prev,
              endDate: e.target.value,
            }))}
            className="border rounded px-2 py-1"
          />
        </div>
      </div>
    </>
  )
}

export default DateRequest;