import { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import resourceTimelinePlugin from '@fullcalendar/resource-timeline';
import { apiService } from '../../api/apiService';
import { toast } from 'react-toastify';
import MeetingRoomForm from './MeetingRoomForm';

const getMonthRange = () => {
  const today = new Date();
  const startDate = new Date(today.getFullYear(), today.getMonth(), 1)
    .toISOString().split('T')[0];
  const endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0)
    .toISOString().split('T')[0];
  return [startDate, endDate];
};

const MeetingRoomCalendar = () => {
  const [rooms, setRooms] = useState([]);
  const [events, setEvents] = useState([]);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editReservation, setEditReservation] = useState(null);

  const userInfo = JSON.parse(sessionStorage.getItem('loginInfo'));
  const userId = userInfo?.id;

  const fetchRooms = () => {
    apiService.get('/meetingrooms/list')
      .then(res => {
        const roomList = (res.data.data || []).map(room => ({
          id: room.roomId,
          title: room.roomName,
        }));
        setRooms(roomList);
      })
      .catch(() => toast.error('회의실 목록 조회 실패'));
  };

  const fetchReservations = (startDate, endDate) => {
    apiService.get('/meetingrooms', { params: { startDate, endDate } })
      .then(res => {
        const reservationEvents = (res.data.data || [])
          .filter(item => item.isActive === 'Y')
          .map(item => ({
            id: item.reservationId,
            title: item.purpose,
            resourceId: item.roomId,
            start: item.startTime,
            end: item.endTime,
            textColor: '#000000',
            backgroundColor: '#93c5fd',
            extendedProps: { ...item, type: 'reservation' },
          }));
        setEvents(reservationEvents);
      })
      .catch(() => toast.error('회의실 예약 조회 실패'));
  };

  const refresh = () => {
    const [startDate, endDate] = getMonthRange();
    fetchReservations(startDate, endDate);
    setShowForm(false);
    setEditReservation(null);
    setSelectedReservation(null);
  };

  useEffect(() => {
    fetchRooms();
    const [startDate, endDate] = getMonthRange();
    fetchReservations(startDate, endDate);
  }, []);

  const handleCreate = () => {
    setEditReservation(null);
    setShowForm(true);
    setSelectedReservation(null);
  };

  const handleUpdate = () => {
    setShowForm(false);
    setTimeout(() => {
      setEditReservation(selectedReservation);
      setShowForm(true);
      setSelectedReservation(null);
    }, 0);
  };

  const handleDelete = () => {
    if (!selectedReservation?.reservationId) return;
    if (window.confirm('정말 삭제하시겠습니까?')) {
      apiService.patch(`/meetingrooms/${selectedReservation.reservationId}`)
        .then(() => {
          toast.success('예약이 삭제되었습니다');
          refresh();
        })
        .catch(() => toast.error('예약 삭제 실패'));
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditReservation(null);
  };

  const handleCloseDetail = () => {
    setSelectedReservation(null);
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">회의실 예약</h2>
        <button
          onClick={handleCreate}
          className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
        >
          예약하기
        </button>
      </div>

      <FullCalendar
        plugins={[resourceTimelinePlugin]}
        initialView="resourceTimelineDay"
        schedulerLicenseKey="CC-Attribution-NonCommercial-NoDerivatives"
        resources={rooms}
        events={events}
        slotMinTime="08:00:00"
        slotMaxTime="20:00:00"
        slotDuration="01:00:00"
        height="auto"
        eventColor="#60a5fa"
        eventClick={info => {
          if (info.event.extendedProps.type === 'reservation') {
            setSelectedReservation(info.event.extendedProps);
          }
        }}
      />

      {/* 등록/수정 폼 */}
      {showForm && (
        <MeetingRoomForm
          onClose={handleCloseForm}
          onSuccess={refresh}
          roomList={rooms}
          editReservation={editReservation}
        />
      )}

      {/* 예약 상세 모달 */}
      {selectedReservation && (
        <div
          className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50"
          onClick={handleCloseDetail}
        >
          <div
            className="bg-white rounded-lg shadow-md p-6 w-full max-w-md"
            onClick={e => e.stopPropagation()}
          >
            <div
              className="flex justify-between items-center border-b-8 pb-2 mb-4"
              style={{ borderColor: '#60a5fa' }}
            >
              <p className="text-base font-medium">{selectedReservation.roomName}</p>
              <button
                className="text-gray-500 hover:text-red-500 text-xl"
                onClick={handleCloseDetail}
              >×</button>
            </div>
            <div className="space-y-3 text-sm text-gray-700">
              <div>
                <p className="text-gray-500">위치</p>
                <p className="text-base">{selectedReservation.roomLocation}</p>
              </div>
              <div>
                <p className="text-gray-500">사용 목적</p>
                <p className="text-base">{selectedReservation.purpose}</p>
              </div>
              <div>
                <p className="text-gray-500">시간</p>
                <p className="text-base">
                  {new Date(selectedReservation.startTime).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })} ~
                  {new Date(selectedReservation.endTime).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              <div>
                <p className="text-gray-500">예약자</p>
                <p className="text-base">
                  {selectedReservation.reserverType === 'TEAM' ? '팀' : '개인'} - {selectedReservation.reserverName}
                </p>
              </div>
            </div>
            {/* 본인만 수정/삭제 */}
            {String(userId) === String(selectedReservation.createdBy) && (
              <div className="flex gap-2 justify-end mt-6">
                <button
                  className="px-4 py-2 rounded bg-blue-400 hover:bg-blue-500 text-white font-semibold"
                  onClick={handleUpdate}
                >
                  수정
                </button>
                <button
                  className="px-4 py-2 rounded bg-red-400 hover:bg-red-500 text-white font-semibold"
                  onClick={handleDelete}
                >
                  삭제
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MeetingRoomCalendar;
