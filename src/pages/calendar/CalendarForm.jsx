// src/components/CalendarForm.jsx
import { useState, useEffect } from 'react';
import { apiService } from '../../api/apiService';
import { toast } from 'react-toastify';

const CalendarForm = ({ defaultDate, selectedEvent, onClose, onSuccess }) => {
  const isEdit = !!selectedEvent;

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [startDate, setStartDate] = useState(defaultDate);
  const [endDate, setEndDate] = useState(defaultDate);
  const [colorCode, setColorCode] = useState('#60a5fa');
  const [reserverType, setReserverType] = useState('USER');
  const [reserverId, setReserverId] = useState('');
  const [reserverOptions, setReserverOptions] = useState([]);
  
useEffect(() => {
  if (isEdit && selectedEvent) {
    setTitle(selectedEvent.title);
    setContent(selectedEvent.content);
    setStartDate(selectedEvent.startDate?.slice(0, 10));
    setEndDate(selectedEvent.endDate?.slice(0, 10));
    setColorCode(selectedEvent.colorCode);
    setReserverType(selectedEvent.reserverType);
  } else if (defaultDate) {
    setStartDate(defaultDate);
    setEndDate(defaultDate);
  }
}, [defaultDate, selectedEvent]);


  useEffect(() => {
    if (reserverType === 'USER') {
      apiService.get('/users').then((res) => {
        const userList = res.data.data.map((user) => ({
          label: user.realname,
          value: user.id,
        }));
        setReserverOptions(userList);
        if (!selectedEvent) {
          setReserverId(userList[0]?.value || '');
        }
      });

    } else if (reserverType === 'TEAM') {
      apiService.get('/teams').then((res) => {
        const teamList = res.data.data.map((team) => ({
          label: team.teamName,
          value: team.id,
        }));
        setReserverOptions(teamList);
        if (!selectedEvent) {
          setReserverId(teamList[0]?.value || '');
        }
      });
    }
  }, [reserverType]);

const handleSubmit = () => {
  const payload = {
    title,
    content,
    startDate,
    endDate,
    reserverType,
    userId: reserverType === 'USER' ? reserverId : null,
    teamId: reserverType === 'TEAM' ? reserverId : null,
    colorCode,
  };

  const request = selectedEvent
    ? apiService.put(`/schedules/${selectedEvent.id}`, payload)
    : apiService.post('/schedules/write', payload);

  request
    .then(() => {
      toast.success(
        selectedEvent ? '일정이 수정되었습니다.' : '일정이 등록되었습니다.'
      );
      onSuccess();
    })
    .catch(() => {
      toast.error(
        selectedEvent ? '일정 수정에 실패했습니다.' : '일정 등록에 실패했습니다.'
      );
    });
};

const handleDelete = () => {
  if (!selectedEvent) return;

  if (window.confirm('정말 삭제하시겠습니까?')) {
    apiService
      .patch(`/schedules/${selectedEvent.scheduleId}`)
      .then(() => {
        toast.success('일정이 삭제되었습니다.');
        onSuccess();
      })
      .catch(() => {
        toast.error('일정 삭제에 실패했습니다.');
      });
  }
};


  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-white/5"
         onClick={onClose}>
      <div
        className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center border-b-2 border-blue-500 pb-2 mb-4">
          <h2 className="text-xl font-bold mb-4">{isEdit ? '일정 수정' : '일정 등록'}</h2>
          <button className="text-gray-500 hover:text-red-500 text-xl" onClick={onClose}>×</button>
        </div>

        <div className="space-y-3 text-sm">
          <div>
            <label className="block font-medium mb-1">제목</label>
            <input
              className="w-full border rounded px-2 py-1"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="block font-medium mb-1">내용</label>
            <textarea
              className="w-full border rounded px-2 py-1"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block font-medium mb-1">시작일</label>
              <input
                type="date"
                className="w-full border rounded px-2 py-1"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="flex-1">
              <label className="block font-medium mb-1">종료일</label>
              <input
                type="date"
                className="w-full border rounded px-2 py-1"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          {!isEdit && (
            <>
              <div>
                <label className="block font-medium mb-1">작성자 유형</label>
                <select
                  className="w-full border rounded px-2 py-1"
                  value={reserverType}
                  onChange={(e) => setReserverType(e.target.value)}
                >
                  <option value="USER">👤 개인</option>
                  <option value="TEAM">👥 팀</option>
                </select>
              </div>

              <div>
                <label className="block font-medium mb-1">작성자 선택</label>
                <select
                  className="w-full border rounded px-2 py-1"
                  value={reserverId}
                  onChange={(e) => setReserverId(e.target.value)}
                >
                  {reserverOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}

          <div>
            <label className="block font-medium mb-1">색상 선택</label>
            <div className="flex gap-2">
              {['#FFA7A7', '#FAED7D', '#B7F0B1', '#B2EBF4', '#D1B2FF','#D5D5D5'].map((color) => (
                <div
                  key={color}
                  className={`w-6 h-6 rounded-full cursor-pointer border-2 ${colorCode === color ? 'border-black' : 'border-white'}`}
                  style={{ backgroundColor: color }}
                  onClick={() => setColorCode(color)}
                  title={color}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
          >
            취소
          </button>

          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            등록
          </button>
        </div>
      </div>
    </div>
  );
};

export default CalendarForm;
