import InfoIcon from "@/components/icons/Info.astro";

interface ErrorLabelProps {
  message: string;
}

const ErrorLabel = ({ message }: ErrorLabelProps) => {
  return (
    <div class="flex text-xs items-start text-red-800 dark:text-red-400">
      <InfoIcon />
      {message}incorrecto, prueba de nuevo.
    </div>
  )
};

export default ErrorLabel;