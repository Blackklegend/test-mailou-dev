import * as Label from '@radix-ui/react-label';

function FormField({ label, name, type = "text", value, onChange, required, error }) {
  return (
    <div className="mb-4">
      <Label.Root htmlFor={name} className="block mb-1">{label}</Label.Root>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        className="w-full border rounded px-2 py-1"
        required={required}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}

export default FormField;