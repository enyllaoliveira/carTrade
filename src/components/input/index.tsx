import { RegisterOptions, UseFormRegister } from "react-hook-form";
interface InputProps {
    placeholder: string;
    type: string;
    name: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    register: UseFormRegister<any>;
    error?: string
    rules?: RegisterOptions
}

export default function Input({name, placeholder, type, register, error, rules}: InputProps) {
    return (
        <div>
  <input
    className="w-full rounded-md border-2 h-11 px-2 "
    type={type}
    placeholder={placeholder}
    {... register(name,  rules)}
    id={name}
  />
  {error && <p className="my-1 text-red-500"> {error}</p>}
  </div>
    )
}