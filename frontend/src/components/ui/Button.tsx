

interface ButtonProps {
  label: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  className?: string;
}

export const Button = ({ label, onClick, variant = 'primary', className = '' }: ButtonProps) => {
  const baseStyles = "px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-2";
  
  const variants = {
    primary: "bg-blue-600 text-white shadow-xl hover:bg-blue-500",
    secondary: "bg-white/10 text-main border border-white/10 hover:bg-white/20",
    danger: "bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20"
  };

  return (
    <button 
      onClick={onClick} 
      className={`${baseStyles} ${variants[variant]} ${className} text-main`}
    >
      {label}
    </button>
  );
};
