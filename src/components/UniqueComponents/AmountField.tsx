import type { TargetedEvent } from "preact/compat";

interface AmountFieldProps {
  id: string;
  placeholder: string;
  type: string;
  label: string;
  value: string;
  onchange: (event: TargetedEvent<HTMLInputElement, Event>) => void;
}

const AmountField = ({
  id,
  placeholder,
  type,
  label,
  value,
  onchange,
}: AmountFieldProps) => {
  return (
    <div class="flex flex-col w-full max-w-96 py-5">
      <label
        for={id}
        class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
      >
        {label}
      </label>
      <div class="flex flex-row w-full max-w-96 gap-x-3">
        <input
          id={id}
          name={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onInput={onchange}
          required
          class="text-sm rounded-lg w-full p-2.5 shadow-md bg-white border border-light_hover text-gray-900 dark:bg-light dark:border-gray-500 dark:placeholder-gray-400 dark:text-white opacity-80 focus:opacity-100 transition-transform focus:scale-105 hover:opacity-100"
        />
        <select
          class="w-full max-w-20 ps-2.5 border rounded-lg shadow-md focus:outline-none focus:ring-1 text-sm bg-white border-light_hover text-gray-900 dark:bg-light dark:border-gray-500 dark:placeholder-gray-400 dark:text-white opacity-80 focus:opacity-100 hover:opacity-100 focus:scale-105 transition-transform"
          id="currency"
        >
          <option value="ether">Ether</option>
          <option value="wei">Wei</option>
        </select>
      </div>
    </div>
  )
};

export default AmountField;