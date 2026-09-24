import { Settings, type LucideIcon, } from "lucide-react";

export interface WIPConfig {
  logoSrc?: string;
  icon: LucideIcon;
  title: string;
  description: string;
  dots: { colorClass: string; delay: string }[];
}

const defaultWIPConfig: WIPConfig = {
  icon: Settings,
  title: "Work in Progress",
  description: "We are currently crafting this section to bring you detailed insights and features. Please check back soon!",
  dots: [
    { colorClass: "bg-indigo-400", delay: "0ms" },
    { colorClass: "bg-indigo-500", delay: "150ms" },
    { colorClass: "bg-indigo-600", delay: "300ms" },
  ]
};

export function WorkInProgress({ config }: { config?: Partial<WIPConfig> }) {
  const {  icon: Icon, title, description, dots } = { ...defaultWIPConfig, ...config };

  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[calc(100vh-8rem)] p-3 md:p-3 text-center animate-in fade-in duration-700 zoom-in-95">
           <div className="bg-white/90 backdrop-blur-md p-10 md:p-12 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200 w-full flex-1 flex flex-col items-center justify-center min-h-[500px]">

        <div className="w-24 h-24 bg-indigo-50 text-indigo-500 rounded-3xl flex items-center justify-center mb-8 shadow-sm border border-indigo-100 rotate-3 transition-transform hover:rotate-12 duration-300">
          <Icon className="w-12 h-12 animate-[spin_6s_linear_infinite]" />
        </div>

        <h3 className="text-2xl md:text-3xl font-bold text-indigo-600 mb-6 uppercase tracking-widest">
          {title}
        </h3>

        <p className="text-slate-500 text-lg md:text-xl leading-relaxed max-w-xl">
          {description}
        </p>

        <div className="mt-12 flex gap-3 items-center justify-center">
          {dots.map((dot, index) => (
            <span
              key={index}
              className={`w-3.5 h-3.5 ${dot.colorClass} rounded-full animate-bounce shadow-sm shadow-indigo-200`}
              style={{ animationDelay: dot.delay }}
            />
          ))}
        </div>

      </div>
    </div>
  );
}
