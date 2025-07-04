import { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import axiosInstance from '../../api/axiosinstance';
import conf from '../../../conf';
import './UnifiedCalendar.css';

const userId = sessionStorage.getItem("userId");

const formatKoreanDate = (dateStr) => {
  const date = new Date(dateStr);
  const options = { month: 'long', day: 'numeric', weekday: 'short' };
  return date.toLocaleDateString('ko-KR', options);
};

const UnifiedCalendar = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEvents, setShowEvents] = useState(true);
  const [showUserEvents, setShowUserEvents] = useState(true);
  const [showTeamEvents, setShowTeamEvents] = useState(true);
  const requestUrl = `${conf.API_URL}/schedules`;

  const fetchEvents = async (startDate, endDate) => {
    try {
      const res = await axiosInstance.get(requestUrl, {
        params: { startDate, endDate },
      });

      const formatted = res.data.data.map((item) => ({
        title: item.title,
        start: item.startDate,
        end: item.endDate,
        color: item.colorCode,
        extendedProps: item,
      }));

      setEvents(formatted);
    } catch (err) {
      console.error('일정 불러오기 실패:', err);
    }
  };

  useEffect(() => {
    const today = new Date();
    const startDate = new Date(today.getFullYear(), today.getMonth(), 1)
      .toISOString()
      .split('T')[0];
    const endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0)
      .toISOString()
      .split('T')[0];

    fetchEvents(startDate, endDate);
  }, []);

  const filteredEvents = events.filter((event) => {
    if (!showEvents) return false;
    const type = event.extendedProps.reserverType;
    return (type === 'USER' && showUserEvents) || (type === 'TEAM' && showTeamEvents);
  });

  return (
    <div className="calendar-container">
      <div className="filter-box">
        <label>
          <input
            type="checkbox"
            checked={showEvents}
            onChange={() => setShowEvents(!showEvents)}
          />{' '}
          일정 보기
        </label>
        {showEvents && (
          <div className="sub-filter">
            <label>
              <input
                type="checkbox"
                checked={showUserEvents}
                onChange={() => setShowUserEvents(!showUserEvents)}
              />{' '}
              개인 일정
            </label>
            <label>
              <input
                type="checkbox"
                checked={showTeamEvents}
                onChange={() => setShowTeamEvents(!showTeamEvents)}
              />{' '}
              팀 일정
            </label>
          </div>
        )}
      </div>

      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        height="auto"
        events={filteredEvents}
        eventClick={(info) => {
          setSelectedEvent(info.event.extendedProps);
        }}
        datesSet={(arg) => {
          const startDate = arg.startStr.slice(0, 10);
          const endDate = arg.endStr.slice(0, 10);
          fetchEvents(startDate, endDate);
        }}
      />

      {selectedEvent && (
        <div className="event-detail-modal">
          <div
            className="modal-header"
            style={{ backgroundColor: selectedEvent.colorCode }}
          >
            <button className="close-btn" onClick={() => setSelectedEvent(null)}>
              ×
            </button>
          </div>
          <div className="modal-content">
            <h3 style={{ fontSize: '18px', marginBottom: '8px', fontWeight: 'bold' }}>{selectedEvent.title}</h3>
            <p>{selectedEvent.content}</p>
            <div className="date-box">
              {formatKoreanDate(selectedEvent.startDate)} ~ {formatKoreanDate(selectedEvent.endDate)}
            </div>
            <div className="reserver-info">
              <span className={`reserver-type ${selectedEvent.reserverType === 'TEAM' ? 'team' : 'user'}`}>
                {selectedEvent.reserverType === 'TEAM' ? '👥 팀' : '👤 개인'}
              </span>
              <span className="reserver-name">{selectedEvent.reserverName}</span>
            </div>
            {String(userId) === String(selectedEvent.createdBy) && (
              <div style={{ marginTop: '12px' }}>
                <button className="edit-btn">수정</button>
                <button className="delete-btn">삭제</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UnifiedCalendar;
