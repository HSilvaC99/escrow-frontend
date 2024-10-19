import type { TargetedEvent } from "preact/compat";

interface FormFieldProps {
  id: string;
  placeholder: string;
  type: string;
  label: string;
  value: string;
  onchange: (e: TargetedEvent<HTMLInputElement, Event>) => void;
}


const FormField = ({
  id,
  placeholder,
  type,
  label,
  value,
  onchange,
}: FormFieldProps) => {
  return (
    <div class="flex flex-col w-full max-w-96 py-5">
      <label
        for={id}
        class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
      >
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onInput={onchange}
        required
        class="bg-white border shadow-md border-light_hover text-gray-900 text-sm rounded-lg min-w-full p-2.5 dark:bg-light dark:border-gray-500 dark:placeholder-gray-400 dark:text-white opacity-80 focus:opacity-100 transition-transform focus:scale-105 hover:opacity-100"
      />
    </div>
  );
};

export default FormField;
