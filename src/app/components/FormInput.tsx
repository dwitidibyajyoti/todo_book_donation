interface FormInputProps {
  label: string;
  type: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  type,
  placeholder,
  value,
  onChange,
}) => {
  return (
    <div className="flex">
      <label htmlFor={label.toLowerCase()} className="mb-1 text-gray-700">
        {label} :
      </label>
      <input
        className="border-b-2 border-gray-300 focus:outline-none focus:border-sky-500 transition-colors duration-300 px-2 py-1"
        type={type}
        id={label.toLowerCase()}
        placeholder={placeholder || ``}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export { FormInput };
