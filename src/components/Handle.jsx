import './Handle.css';

const Handle = ({handle, style}) => {
  return (
    <span className="handle" style={style}>
      @{handle}
    </span>
  )
}

export default Handle