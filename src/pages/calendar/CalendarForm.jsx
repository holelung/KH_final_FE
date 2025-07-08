import { useState, useEffect, useCallback } from 'react';
import { apiService } from '../../api/apiService';
import { toast } from 'react-toastify';

const COLOR_PALETTE = [
  '#FFA7A7', '#FAED7D', '#B7F0B1', '#B2EBF4', '#D1B2FF', '#D5D5D5'
];

const fetchReserverOptions = async (type) => {
  if (type === 'USER') {
    const res = await apiService.get('/users');
    return res.data.data.map(user => ({
      label: user.realname,
      value: user.id,
    }));
  } else if (type === 'TEAM') {
    const res = await apiService.get('/teams');
    return res.data.data.map(team => ({
      label: team.teamName,
      value: team.id,
    }));
  }
  return [];
};

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
      setReserverId(selectedEvent.reserverId || '');
    } else if (defaultDate) {
      setTitle('');
      setContent('');
      setStartDate(defaultDate);
      setEndDate(defaultDate);
      setColorCode('#60a5fa');
      setReserverType('USER');
      setReserverId('');
    }
  }, [defaultDate, selectedEvent, isEdit]);

  useEffect(() => {
    let mounted = true;
    fetchReserverOptions(reserverType).then(list => {
      if (mounted) {
        setReserverOptions(list);
        if (!isEdit) setReserverId(list[0]?.value || '');
      }
    });
    return () => { mounted = false; };
  }, [reserverType, isEdit]);

  const handleSubmit = useCallback(() => {
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
    const req = isEdit
      ? apiService.put(`/schedules/${selectedEvent.id}`, payload)
      : apiService.post('/schedules/write', payload);

    req.then(() => {
      toast.success(isEdit ? '일정이 수정되었습니다.' : '일정이 등록되었습니다.');
      onSuccess();
    }).catch(() => {
      toast.error(isEdit ? '일정 수정에 실패했습니다.' : '일정 등록에 실패했습니다.');
    });
  }, [isEdit, selectedEvent, title, content, startDate, endDate, reserverType, reserverId, colorCode, onSuccess]);

  const handleDelete = useCallback(() => {
    if (!selectedEvent) return;
    if (!window.confirm('정말 삭제하시겠습니까?')) return;

    apiService.patch(`/schedules/${selectedEvent.scheduleId}`)
      .then(() => {
        toast.success('일정이 삭제되었습니다.');
        onSuccess();
      })
      .catch(() => {
        toast.error('일정 삭제에 실패했습니다.');
      });
  }, [selectedEvent, onSuccess]);

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-white/5"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md"
        onClick={e => e.stopPropagation()}
      >
        {/* 상단 타이틀 */}
        <div className="flex justify-between items-center border-b-2 border-blue-500 pb-2 mb-4">
          <h2 className="text-xl font-bold">{isEdit ? '일정 수정' : '일정 등록'}</h2>
          <button className="text-gray-500 hover:text-red-500 text-xl" onClick={onClose}>×</button>
        </div>

        {/* 입력 폼 */}
        <div className="space-y-3 text-sm">
          <div>
            <label className="block font-medium mb-1">제목</label>
            <input
              className="w-full border rounded px-2 py-1"
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
          </div>
          <div>
            <label className="block font-medium mb-1">내용</label>
            <textarea
              className="w-full border rounded px-2 py-1"
              value={content}
              onChange={e => setContent(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block font-medium mb-1">시작일</label>
              <input
                type="date"
                className="w-full border rounded px-2 py-1"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
              />
            </div>
            <div className="flex-1">
              <label className="block font-medium mb-1">종료일</label>
              <input
                type="date"
                className="w-full border rounded px-2 py-1"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
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
                  onChange={e => setReserverType(e.target.value)}
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
                  onChange={e => setReserverId(e.target.value)}
                >
                  {reserverOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </>
          )}
          <div>
            <label className="block font-medium mb-1">색상 선택</label>
            <div className="flex gap-2">
              {COLOR_PALETTE.map(color => (
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
        {/* 하단 버튼 */}
        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
          >취소</button>
          {isEdit && (
            <button
              onClick={handleDelete}
              className="px-4 py-2 rounded bg-red-400 text-white hover:bg-red-600"
            >삭제</button>
          )}
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >{isEdit ? '수정' : '등록'}</button>
        </div>
      </div>
    </div>
  );
};

export default CalendarForm;
