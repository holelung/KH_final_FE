
const ListView = ({ data }) => {

  return (
    <>
      <tbody className="font-PretendardM text-center">
        {data.length > 0 ? (
          data.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.title}</td>
              <td>
                {item.realname}({item.username})
              </td>
              <td>{item.createDate}</td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={4}>게시물이 없습니다</td>
          </tr>
        )}
      </tbody>
    </>
  )
}

export default ListView;