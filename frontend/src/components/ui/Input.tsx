

interface InputProps {
  label?: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
}

export const Input = ({ label, name, type = 'text', placeholder, required }: InputProps) => {
  return (
    <div className="flex flex-col gap-2 w-full">
      {label && <label className="text-[10px] font-black opacity-30 uppercase tracking-[0.2em] ml-1">{label}</label>}
      <input 
        type={type}
        name={name}
        placeholder={placeholder}
        required={required}
        className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm text-main placeholder:opacity-20 outline-none focus:border-blue-500/50 focus:bg-white/[0.08] transition-all"
      />
    </div>
  );
};
