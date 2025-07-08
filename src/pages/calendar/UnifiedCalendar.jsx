import { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { apiService } from '../../api/apiService';
import { toast } from 'react-toastify';
import CalendarForm from './CalendarForm';

const formatKoreanDate = (dateStr) => {
  const date = new Date(dateStr);
  const options = { month: 'long', day: 'numeric', weekday: 'short' };
  return date.toLocaleDateString('ko-KR', options);
};

const UnifiedCalendar = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [createDate, setCreateDate] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editTarget, setEditTarget] = useState(null);

  const [showSchedule, setShowSchedule] = useState(true);
  const [showScheduleUser, setShowScheduleUser] = useState(true);
  const [showScheduleTeam, setShowScheduleTeam] = useState(true);

  const [showReserve, setShowReserve] = useState(true);
  const [showReserveUser, setShowReserveUser] = useState(true);
  const [showReserveTeam, setShowReserveTeam] = useState(true);

  const userInfo = JSON.parse(sessionStorage.getItem('loginInfo'));
  const userId = userInfo?.id;

  const fetchEvents = (startDate, endDate) => {
    const schedulePromise = apiService.get('/schedules', {
      params: { startDate, endDate },
    });

    const reservationPromise = apiService.get('/meetingrooms', {
      params: { startDate, endDate },
    });

    Promise.all([schedulePromise, reservationPromise])
      .then(([scheduleRes, reserveRes]) => {
        const scheduleEvents = scheduleRes.data.data
          .filter((item) => item.isActive === 'Y')
          .map((item) => ({
            title: item.title,
            start: item.startDate,
            end: new Date(new Date(item.endDate).setDate(new Date(item.endDate).getDate() + 1)).toISOString(),
            color: item.colorCode,
            allDay: true,
            textColor: '#000000',
            extendedProps: { ...item, type: 'schedule' },
          }));

        const reservationEvents = reserveRes.data.data
          .filter((item) => item.isActive === 'Y')
          .map((item) => ({
            title: `[회의실] ${item.roomName} - ${item.purpose}`,
            start: item.startTime,
            end: item.endTime,
            textColor: '#000000',
            extendedProps: { ...item, type: 'reservation' },
          }));

        setEvents([...scheduleEvents, ...reservationEvents]);
      })
      .catch((err) => {
        toast.error('일정 또는 회의실 예약 조회 실패');
        console.error(err);
      });
  };

  useEffect(() => {
    const today = new Date();
    const startDate = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
    const endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split('T')[0];
    fetchEvents(startDate, endDate);
  }, []);

  const filteredEvents = events.filter((event) => {
    const { type, reserverType } = event.extendedProps;
    if (type === 'schedule') {
      if (!showSchedule) return false;
      if (reserverType === 'USER') return showScheduleUser;
      if (reserverType === 'TEAM') return showScheduleTeam;
    }
    if (type === 'reservation') {
      if (!showReserve) return false;
      if (reserverType === 'USER') return showReserveUser;
      if (reserverType === 'TEAM') return showReserveTeam;
    }
    return false;
  });

  const handleModify = () => {
    setEditTarget(selectedEvent);
    setEditMode(true);
    setCreateDate(null);
    setSelectedEvent(null);
  };

  const handleDelete = () => {
    apiService.patch(`/schedules/${selectedEvent.id}`)
      .then(() => {
        toast.success('일정이 삭제되었습니다.');
        setSelectedEvent(null);
        fetchEvents(
          new Date().toISOString().slice(0, 10),
          new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString().slice(0, 10)
        );
      })
      .catch(() => toast.error('일정 삭제에 실패했습니다.'));
  };

  return (
    <div className="p-4">
      {/* ----------- 필터 영역(한줄/검정) ----------- */}
<div className="mb-8 flex flex-wrap items-center gap-4 justify-end py-2 px-0">
  <label className="flex items-center gap-2 font-bold text-black text-base">
    <input
      type="checkbox"
      checked={showSchedule}
      onChange={() => setShowSchedule(!showSchedule)}
      className="w-5 h-5 accent-white"
    />
    일정 보기
  </label>
  <label className="flex items-center gap-1 font-normal text-black text-base">
    <input
      type="checkbox"
      checked={showScheduleUser}
      onChange={() => setShowScheduleUser(!showScheduleUser)}
      className="accent-white"
      disabled={!showSchedule}
    />
    개인 일정
  </label>
  <label className="flex items-center gap-1 font-normal text-black text-base">
    <input
      type="checkbox"
      checked={showScheduleTeam}
      onChange={() => setShowScheduleTeam(!showScheduleTeam)}
      className="accent-white"
      disabled={!showSchedule}
    />
    팀 일정
  </label>
  <span className="mx-2 text-gray-300 select-none">|</span>
  <label className="flex items-center gap-2 font-bold text-black text-base">
    <input
      type="checkbox"
      checked={showReserve}
      onChange={() => setShowReserve(!showReserve)}
      className="w-5 h-5 accent-white"
    />
    회의실 예약 보기
  </label>
  <label className="flex items-center gap-1 font-normal text-black text-base">
    <input
      type="checkbox"
      checked={showReserveUser}
      onChange={() => setShowReserveUser(!showReserveUser)}
      className="accent-white"
      disabled={!showReserve}
    />
    개인 예약
  </label>
  <label className="flex items-center gap-1 font-normal text-black text-base">
    <input
      type="checkbox"
      checked={showReserveTeam}
      onChange={() => setShowReserveTeam(!showReserveTeam)}
      className="accent-white"
      disabled={!showReserve}
    />
    팀 예약
  </label>
</div>

      {/* ----------- 필터 영역 끝 ----------- */}

      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        height="auto"
        events={filteredEvents}
        displayEventTime={false}
        eventTextColor="#000000"
        eventClick={(info) => {
          setSelectedEvent(info.event.extendedProps);
        }}
        dateClick={(info) => {
          setCreateDate(info.dateStr);

          document.querySelectorAll('.fc-daygrid-day.selected').forEach((el) => {
            el.classList.remove('selected');
          });

          const clickedCell = info.dayEl;
          if (clickedCell) {
            clickedCell.classList.add('selected');
          }
        }}
        datesSet={(arg) => {
          const startDate = arg.startStr.slice(0, 10);
          const endDate = arg.endStr.slice(0, 10);
          fetchEvents(startDate, endDate);
        }}
      />
      {selectedEvent && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50"
          onClick={() => setSelectedEvent(null)}>
          <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}>
            <div
              className="flex justify-between items-center border-b-8 pb-2 mb-4"
              style={{ borderColor: selectedEvent.colorCode }}
            >
              <h3 className="text-xl font-semibold">{selectedEvent.title}</h3>
              <button
                className="text-gray-500 hover:text-red-500 text-xl"
                onClick={() => setSelectedEvent(null)}
              >
                ×
              </button>
            </div>

            <div className="space-y-2">
              {selectedEvent.type === 'schedule' ? (
                <>
                  <p>{selectedEvent.content}</p>
                  <div className="text-sm text-gray-500">
                    {formatKoreanDate(selectedEvent.startDate)} ~ {formatKoreanDate(selectedEvent.endDate)}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold">
                      {selectedEvent.reserverType === 'TEAM' ? '👥 팀' : '👤 개인'}
                    </span>
                    <span>{selectedEvent.reserverName}</span>
                  </div>
                </>
              ) : (
                <>
                  <h3>{selectedEvent.roomName}</h3>
                  <p>위치: {selectedEvent.roomLocation}</p>
                  <p>목적: {selectedEvent.purpose}</p>
                  <div className="text-sm text-gray-500">
                    {new Date(selectedEvent.startTime).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })} ~
                    {new Date(selectedEvent.endTime).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold">회의실 예약</span>
                    <span>{selectedEvent.reserverName}</span>
                  </div>
                </>
              )}
              {selectedEvent.type === 'schedule' &&
                String(userId) === String(selectedEvent.createdBy) && (
                  <div className="flex gap-2 justify-end pt-4">
                    <button
                      onClick={handleModify}
                      className="px-4 py-2 bg-blue-400 text-white rounded hover:bg-blue-500">수정</button>
                    <button
                      onClick={handleDelete}
                      className="px-4 py-2 bg-red-400 text-white rounded hover:bg-red-500">삭제</button>
                  </div>
                )}
            </div>
          </div>
        </div>
      )}
      {createDate && (
        <CalendarForm
          defaultDate={createDate}
          selectedEvent={null}
          onClose={() => {
            setCreateDate(null);
            setEditMode(false);
            setEditTarget(null);
            setSelectedEvent(null);
          }}
          onSuccess={() => {
            fetchEvents(
              new Date().toISOString().slice(0, 10),
              new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString().slice(0, 10)
            );
            setCreateDate(null);
            setEditMode(false);
            setEditTarget(null);
            setSelectedEvent(null);
          }}
        />
      )}

      {editTarget && (
        <CalendarForm
          defaultDate={editTarget.startDate}
          selectedEvent={editTarget}
          onClose={() => {
            setEditTarget(null);
            setEditMode(false);
            setSelectedEvent(null);
          }}
          onSuccess={() => {
            fetchEvents(
              new Date().toISOString().slice(0, 10),
              new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString().slice(0, 10)
            );
            setEditTarget(null);
            setEditMode(false);
            setSelectedEvent(null);
          }}
        />
      )}
    </div>
  );
};

export default UnifiedCalendar;
