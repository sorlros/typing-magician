import { Toaster } from "sonner";
import "../globals.css"

const LocalePageLayout = ({children}: {children: React.ReactNode}) => {
  return (
    <>
      <Toaster />
      <div className="flex w-full min-h-screen bg-slate-800">
        {children}
      </div>
    </>
  )
}

export default LocalePageLayout;