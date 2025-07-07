import { useState, useEffect } from 'react';
import { apiService } from '../../api/apiService';
import { toast } from 'react-toastify';

const getToday = () => {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

const MeetingRoomForm = ({ onClose, onSuccess, roomList, editReservation }) => {
  const isEdit = !!editReservation;

  const [form, setForm] = useState({
    roomId: '',
    reserveDate: getToday(),
    startTime: '',
    endTime: '',
    purpose: '',
    reserverType: '',
    reserverId: '',
  });
  const [reserverOptions, setReserverOptions] = useState([]);

  // 수정모드 초기값
  useEffect(() => {
    if (isEdit && editReservation) {
      setForm({
        roomId: editReservation.roomId || '',
        reserveDate: (editReservation.reserveDate || '').slice(0, 10),
        startTime: (editReservation.startTime || '').slice(11, 16),
        endTime: (editReservation.endTime || '').slice(11, 16),
        purpose: editReservation.purpose || '',
        reserverType: editReservation.reserverType || '',
        reserverId: editReservation.reserverId || '',
      });
    }
  }, [isEdit, editReservation]);

  useEffect(() => {
    if (isEdit) return; // 수정모드일 땐 예약자 옵션 X
    // 등록시만 예약자 옵션
    if (form.reserverType === 'USER') {
      apiService.get('/users').then((res) => {
        const userList = res.data.data.map((user) => ({
          label: user.realname,
          value: user.id,
        }));
        setReserverOptions(userList);
        setForm((prev) => ({ ...prev, reserverId: userList[0]?.value || '' }));
      });
    } else if (form.reserverType === 'TEAM') {
      apiService.get('/teams').then((res) => {
        const teamList = res.data.data.map((team) => ({
          label: team.teamName,
          value: team.id,
        }));
        setReserverOptions(teamList);
        setForm((prev) => ({ ...prev, reserverId: teamList[0]?.value || '' }));
      });
    }
  }, [form.reserverType, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (!form.roomId || !form.reserveDate || !form.startTime || !form.endTime || !form.purpose || (!isEdit && (!form.reserverType || !form.reserverId))) {
      toast.error('모든 항목을 입력해 주세요.');
      return;
    }
    if (form.startTime >= form.endTime) {
      toast.error('시작 시간은 종료 시간보다 이전이어야 합니다.');
      return;
    }
    const payload = {
      ...form,
      userId: !isEdit && form.reserverType === 'USER' ? form.reserverId : null,
      teamId: !isEdit && form.reserverType === 'TEAM' ? form.reserverId : null,
    };

    if (!isEdit) {
      apiService
        .post('/meetingrooms/write', payload)
        .then(() => {
          toast.success('예약이 등록되었습니다');
          onSuccess();
          onClose();
        })
        .catch(() => toast.error('예약 등록 실패'));
    } else {
      apiService
        .put(`/meetingrooms/${editReservation.reservationId}`, payload)
        .then(() => {
          toast.success('예약이 수정되었습니다');
          onSuccess();
          onClose();
        })
        .catch(() => toast.error('예약 수정 실패'));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-white/5" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-2xl p-8 relative" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-2xl">×</button>
        <h2 className="text-2xl font-semibold mb-6 text-blue-600 border-b pb-2">{isEdit ? '예약 수정' : '회의실 예약'}</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="text-sm text-gray-600 mb-1 block">회의실 선택</label>
            <select name="roomId" value={form.roomId} onChange={handleChange} className="w-full border rounded-lg px-3 py-2">
              <option value="">선택하세요</option>
              {roomList.map((room) => (
                <option key={room.id} value={room.id}>{room.title}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm text-gray-600 mb-1 block">날짜</label>
            <input type="date" name="reserveDate" value={form.reserveDate} onChange={handleChange} className="w-full border rounded-lg px-3 py-2"/>
          </div>
          <div className="flex gap-2">
            <div className="w-1/2">
              <label className="text-sm text-gray-600 mb-1 block">시작 시간</label>
              <input type="time" name="startTime" value={form.startTime} onChange={handleChange} step="3600" className="w-full border rounded-lg px-3 py-2"/>
            </div>
            <div className="w-1/2">
              <label className="text-sm text-gray-600 mb-1 block">종료 시간</label>
              <input type="time" name="endTime" value={form.endTime} onChange={handleChange} step="3600" className="w-full border rounded-lg px-3 py-2"/>
            </div>
          </div>
          <div className="col-span-2">
            <label className="text-sm text-gray-600 mb-1 block">사용 목적</label>
            <input type="text" name="purpose" value={form.purpose} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" placeholder="예: 회의, OT, 발표 등"/>
          </div>
          {/* 예약자 유형/이름: 등록시에만 보임 */}
          {!isEdit && (
            <>
              <div className="col-span-2">
                <label className="text-sm text-gray-600 mb-1 block">예약자 유형</label>
                <select name="reserverType" value={form.reserverType} onChange={handleChange} className="w-full border rounded-lg px-3 py-2">
                  <option value="">선택하세요</option>
                  <option value="USER">개인</option>
                  <option value="TEAM">팀</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="text-sm text-gray-600 mb-1 block">예약자 선택</label>
                <select name="reserverId" value={form.reserverId} onChange={handleChange} className="w-full border rounded-lg px-3 py-2">
                  {reserverOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </>
          )}
        </div>
        <div className="flex justify-end mt-6 gap-3">
          <button onClick={onClose} className="px-5 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800">취소</button>
          <button onClick={handleSubmit} className="px-5 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white">{isEdit ? '예약 수정' : '예약 등록'}</button>
        </div>
      </div>
    </div>
  );
};

export default MeetingRoomForm;
