import type { ReactNode, InputHTMLAttributes, TextareaHTMLAttributes } from "react"

interface BaseFormFieldProps {
  label: string
  isEditable: boolean
  icon?: ReactNode
  suffix?: string
}

interface TextFormFieldProps extends BaseFormFieldProps, Omit<InputHTMLAttributes<HTMLInputElement>, "className"> {
  type?: "text" | "date" | "time" | "datetime-local" | "number" | "email" | "tel"
}

interface TextareaFormFieldProps
  extends BaseFormFieldProps,
    Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "className"> {
  type: "textarea"
  rows?: number
}

type FormFieldProps = TextFormFieldProps | TextareaFormFieldProps

export const FormField = (props: FormFieldProps) => {
  const { label, isEditable, icon, suffix} = props

  // Common classes
  const baseInputClasses = `w-full p-2 ${icon ? "pl-8" : ""} ${suffix ? "pr-12" : ""} border outline-none ${
    isEditable ? "border-gray-300 bg-white focus:border-base-500 focus:ring focus:ring-base-200 " : "border-gray-200 bg-gray-50 cursor-not-allowed"} rounded-md`

  // Render textarea if type is textarea
  if ("type" in props && props.type === "textarea") {
    const { type, rows = 4, ...textareaProps } = props as TextareaFormFieldProps
    return (
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">{label}</label>
        <div className="relative">
          <textarea
            className={`${baseInputClasses} resize-none`}
            rows={rows}
            readOnly={!isEditable}
            {...textareaProps}
          />
          {suffix && <span className="absolute right-3 top-2 text-gray-500">{suffix}</span>}
        </div>
      </div>
    )
  }

  // Render input for all other types
  const { type = "text", ...inputProps } = props as TextFormFieldProps


  return (
    <div className="mb-4">
      <label className="block text-gray-700 mb-2">{label}</label>
      <div className="relative">
        <input type={type} className={baseInputClasses} readOnly={!isEditable} {...inputProps} />
        {icon}
        {suffix && <span className="absolute right-3 top-2.5 text-gray-500">{suffix}</span>}
      </div>
    </div>
  )
}
