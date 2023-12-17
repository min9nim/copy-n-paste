export default function Radio({ options, value, setValue, readOnly = false }) {
  return (
    <div className="flex flex-row gap-4 flex-wrap items-center">
      {options.map(option => (
        <div key={option.value} className="flex flex-row gap-1 cursor-pointer">
          <input
            type="radio"
            className="cursor-pointer"
            value={option.value}
            checked={option.value === value}
            onChange={e => setValue(option.value)}
            readOnly={readOnly}
          />
          <span onClick={e => setValue(option.value)}>{option.label}</span>
        </div>
      ))}
    </div>
  )
}
