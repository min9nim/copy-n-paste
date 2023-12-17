export default function Radio({ options, value, setValue }) {
  return (
    <div className="flex flex-row gap-4 flex-wrap items-center">
      {options.map(option => (
        <div
          key={option.value}
          className="flex flex-row gap-1 cursor-pointer"
          onClick={e => setValue(option.value)}
        >
          <input
            type="radio"
            className="cursor-pointer"
            value={option.value}
            checked={option.value === value}
          />
          <span>{option.label}</span>
        </div>
      ))}
    </div>
  )
}
